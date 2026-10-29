import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Mic,
  MicOff,
  Play,
  Send,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  BrainCircuit,
  RotateCcw,
} from "lucide-react";

const API_URL = "https://smart-ai-resume-screener.onrender.com";

const styles = {
  page: {
    color: "var(--text-primary, #172033)",
    display: "grid",
    gap: 22,
    width: "100%",
    maxWidth: 1180,
    margin: "0 auto",
  },
  panel: {
    background: "var(--card-bg, #ffffff)",
    border: "1px solid var(--border-color, #e7e9f2)",
    borderRadius: 22,
    padding: "clamp(20px, 3vw, 34px)",
    minWidth: 0,
    boxShadow: "0 8px 30px rgba(31, 41, 85, 0.06)",
  },
  button: {
    border: 0,
    borderRadius: 12,
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: 650,
    fontSize: 14,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    transition: "all 0.2s ease",
  },
  primary: {
    background: "linear-gradient(135deg, #635bff, #4938d4)",
    color: "#ffffff",
    boxShadow: "0 5px 14px rgba(79, 70, 229, 0.22)",
  },
  secondary: {
    background: "#ffffff",
    color: "#374151",
    border: "1px solid #e2e5ef",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    borderRadius: 12,
    border: "1px solid #dfe3ef",
    background: "var(--input-bg, #ffffff)",
    color: "inherit",
    font: "inherit",
    outline: "none",
    transition: "border-color 0.2s ease",
  },
  typeButton: {
    padding: "17px 16px",
    borderRadius: 15,
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
    width: "100%",
    fontSize: 14,
    fontWeight: 600,
    transition: "all 0.2s ease",
  },
};

function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Something went wrong. Please retry."
  );
}

export default function MockInterview() {
  const [interviewType, setInterviewType] = useState("HR");
  const [role, setRole] = useState("Full Stack Developer");
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluations, setEvaluations] = useState({});
  const [report, setReport] = useState(null);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const recognitionRef = useRef(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("screenerToken") : null;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const currentQuestion = session?.questions?.[questionIndex];
  const currentEvaluation = evaluations[questionIndex];
  const answeredCount = Object.keys(evaluations).length;
  const isLastQuestion =
    questionIndex === (session?.questions?.length || 0) - 1;

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    setSpeechSupported(Boolean(SpeechRecognition));

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalText += text + " ";
        } else {
          interimText += text;
        }
      }

      if (finalText || interimText) {
        setAnswer((previous) => {
          const base = recognitionRef.current?.baseAnswer || previous;
          return [base, finalText, interimText]
            .filter(Boolean)
            .join(" ")
            .trim();
        });
      }
    };

    recognition.onerror = (event) => {
      setListening(false);

      if (event.error !== "no-speech" && event.error !== "aborted") {
        setError(
          "Microphone error: " +
            event.error +
            ". Microphone permission aur browser support check karo."
        );
      }
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // Recognition may already be stopped.
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        // Ignore cleanup errors.
      }
    };
  }, []);
  
  // AI interviewer question ko voice mein sunayega
  useEffect(() => {
    if (!session || !currentQuestion?.question) return;

    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      currentQuestion.question
    );

    utterance.lang = "en-IN";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [session?.interviewId, currentQuestion?.question]);

const startInterview = async () => {
  const token = localStorage.getItem("screenerToken");

  if (!token) {
    setError("Pehle login karo.");
    return;
  }

  setError("");
  setLoading(true);

  try {
    // Backend resume analysis check aur interview generation karega.
    const response = await axios.post(
      `${API_URL}/api/mock-interview/start`,
      { role, interviewType },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (
      !response.data?.success ||
      !response.data?.data?.interviewId ||
      response.data?.data?.questions?.length !== 20
    ) {
      throw new Error(
        response.data?.message || "Interview start nahi ho saka."
      );
    }

    setSession(response.data.data);
    setQuestionIndex(0);
    setAnswer("");
    setEvaluations([]);
    setReport(null);
  } catch (error) {
    setError(
      error.response?.data?.message ||
        error.message ||
        "Interview start nahi ho saka."
    );
  } finally {
    setLoading(false);
  }
};

  const startVoiceInput = () => {
    if (!recognitionRef.current) {
      setError("Is browser mein speech recognition supported nahi hai.");
      return;
    }

    setError("");

    try {
      recognitionRef.current.baseAnswer = answer;
      recognitionRef.current.start();
      setListening(true);
    } catch (err) {
      setError(
        "Microphone start nahi ho saka. Agar mic already running hai, pehle Stop dabao."
      );
    }
  };

  const stopVoiceInput = () => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // Ignore if already stopped.
    }
    setListening(false);
  };

  const submitAnswer = async () => {
    if (!answer.trim() || !session || !currentQuestion) {
      setError("Please apna answer type karo ya microphone se bolo.");
      return;
    }
     console.log("Session:", session);
  console.log("Interview ID:", session?.interviewId);
  console.log("Question Index:", questionIndex);


    stopVoiceInput();
    setEvaluating(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_URL}/api/mock-interview/answer`,
        {
          interviewId: session.interviewId,
          questionIndex,
          answer: answer.trim(),
        },
        {
          headers: authHeaders,
        }
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Evaluation failed.");
      }

      setEvaluations((previous) => ({
        ...previous,
        [questionIndex]: {
          ...response.data.data,
          answer: answer.trim(),
        },
      }));
    } catch (err) {
      console.error("Mock answer evaluation error:", err);
      setError(getErrorMessage(err));
    } finally {
      setEvaluating(false);
    }
  };

  const goToQuestion = (nextIndex) => {
    stopVoiceInput();
    setQuestionIndex(nextIndex);
    setAnswer(evaluations[nextIndex]?.answer || "");
    setError("");
  };

  const finishInterview = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_URL}/api/mock-interview/${session.interviewId}/report`,
        {
          headers: authHeaders,
        }
      );

      setReport(response.data.data);
    } catch (err) {
      console.error("Mock report error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const resetInterview = () => {
    stopVoiceInput();
    setSession(null);
    setReport(null);
    setEvaluations({});
    setQuestionIndex(0);
    setAnswer("");
    setError("");
  };

  const cardStyle = {
    ...styles.panel,
    display: "grid",
    gap: 16,
  };

  if (report) {
    return (
      <div style={styles.page}>
        <section style={cardStyle}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <CheckCircle2 size={32} color="#16a34a" />
            <div>
              <h2 style={{ margin: 0 }}>Mock Interview Report</h2>
              <p style={{ margin: "6px 0 0", opacity: 0.75 }}>
                {report.role}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 12,
            }}
          >
            <div style={cardStyle}>
              <span>Average score</span>
              <h2 style={{ margin: 0 }}>
                {report.averageScore}/10
              </h2>
            </div>
            <div style={cardStyle}>
              <span>Answered</span>
              <h2 style={{ margin: 0 }}>
                {report.answeredQuestions}/{report.totalQuestions}
              </h2>
            </div>
          </div>

          {report.questions.map((item) => (
            <div
              key={item.questionIndex}
              style={{
                borderTop: "1px solid var(--border-color, #e5e7eb)",
                paddingTop: 16,
              }}
            >
              <strong>
                Q{item.questionIndex + 1}. {item.question}
              </strong>
              <p style={{ opacity: 0.8 }}>
                Score: {item.score}/10 ? {item.category}
              </p>
              <p><strong>Your answer:</strong> {item.answer || "Not answered"}</p>
              <p><strong>Feedback:</strong> {item.feedback || "No feedback"}</p>
            </div>
          ))}

          <button
            style={{ ...styles.button, ...styles.primary }}
            onClick={resetInterview}
          >
            <RotateCcw size={17} /> Start another mock interview
          </button>
        </section>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={styles.page}>
        <section style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <BrainCircuit size={34} color="#4f46e5" />
            <div>
              <h2 style={{ margin: 0 }}>AI Mock Interview</h2>
              <p style={{ margin: "6px 0 0", opacity: 0.75 }}>
                Practice with 20 questions based on your analyzed resume.
              </p>
            </div>
          </div>

          <label htmlFor="mock-role"><strong>Target job role</strong></label>
          <input
            id="mock-role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            placeholder="e.g. Full Stack Developer"
            style={styles.input}
          />

          <div className="form-group">
           
            <div style={{ display: "grid", gap: 12 }}>
              <label style={{ fontWeight: 700, fontSize: 15 }}>
                Choose Interview Type
              </label>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
                  gap: 14,
                }}
              >
                {[
                  {
                    type: "HR",
                    icon: "??",
                    title: "HR Interview",
                    description: "Communication & behavioral questions",
                  },
                  {
                    type: "Technical",
                    icon: "??",
                    title: "Technical Interview",
                    description: "Programming & core concepts",
                  },
                  {
                    type: "Project",
                    icon: "??",
                    title: "Project Interview",
                    description: "Your projects & technical decisions",
                  },
                ].map((item) => {
                  const selected = interviewType === item.type;

                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setInterviewType(item.type)}
                      aria-pressed={selected}
                      style={{
                        ...styles.typeButton,
                        border: selected
                          ? "1.5px solid #635bff"
                          : "1px solid #e5e7ef",
                        background: selected ? "#f3f2ff" : "#ffffff",
                        color: "#20233a",
                        boxShadow: selected
                          ? "0 5px 18px rgba(99, 91, 255, 0.10)"
                          : "none",
                      }}
                    >
                      <span
                        style={{
                          width: 44,
                          height: 44,
                          flexShrink: 0,
                          borderRadius: 12,
                          display: "grid",
                          placeItems: "center",
                          fontSize: 21,
                          background: selected ? "#e4e0ff" : "#f3f4f8",
                        }}
                      >
                        {item.icon}
                      </span>

                      <span style={{ display: "grid", gap: 5, flex: 1 }}>
                        <span style={{ fontWeight: 750 }}>{item.title}</span>
                        <span
                          style={{
                            color: "#777d91",
                            fontSize: 12,
                            lineHeight: 1.5,
                            fontWeight: 400,
                          }}
                        >
                          {item.description}
                        </span>
                      </span>

                      <span
                        style={{
                          width: 18,
                          height: 18,
                          flexShrink: 0,
                          borderRadius: "50%",
                          border: selected
                            ? "5px solid #635bff"
                            : "1.5px solid #c8ccda",
                          boxSizing: "border-box",
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ opacity: 0.8, lineHeight: 1.6 }}>
            <p>? 20 questions generated from your latest ATS-analyzed resume.</p>
            <p>? Type answers or use microphone speech-to-text.</p>
            <p>? Each submitted answer receives AI feedback and a score out of 10.</p>
          </div>

          {error && <p role="alert" style={{ color: "#dc2626" }}>{error}</p>}

          <button
            style={{ ...styles.button, ...styles.primary, justifySelf: "start" }}
            onClick={startInterview}
            disabled={loading || !role.trim()}
          >
            {loading ? (
              <><LoaderCircle size={18} /> Generating 20 questions...</>
            ) : (
              <><Play size={18} /> Start mock interview</>
            )}
          </button>
        </section>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0 }}>AI Mock Interview</h2>
            <p style={{ opacity: 0.75 }}>{session.role}</p>
          </div>
          <strong>
            Question {questionIndex + 1} of {session.questions.length}
          </strong>
        </div>

        <div
          style={{
            height: 8,
            background: "var(--surface-secondary, #e5e7eb)",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${((questionIndex + 1) / session.questions.length) * 100}%`,
              background: "#4f46e5",
            }}
          />
        </div>

        <div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span>{currentQuestion.category}</span>
            <span>?</span>
            <span>{currentQuestion.difficulty}</span>
          </div>
          <h3 style={{ fontSize: 22, lineHeight: 1.5 }}>
            {currentQuestion.question}
          </h3>
        </div>

        <label htmlFor="mock-answer"><strong>Your answer</strong></label>
        <textarea
          id="mock-answer"
          rows={7}
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Apna answer yahan type karo, ya microphone se bolo..."
          disabled={evaluating || Boolean(currentEvaluation)}
          style={{ ...styles.input, resize: "vertical" }}
        />

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {speechSupported && !listening && (
            <button
              style={{ ...styles.button, ...styles.secondary }}
              onClick={startVoiceInput}
              disabled={evaluating || Boolean(currentEvaluation)}
            >
              <Mic size={17} /> Answer by voice
            </button>
          )}

          {listening && (
            <button
              style={{ ...styles.button, background: "#fee2e2", color: "#991b1b" }}
              onClick={stopVoiceInput}
            >
              <MicOff size={17} /> Stop recording
            </button>
          )}

          {!speechSupported && (
            <span style={{ opacity: 0.75 }}>
              Voice input is not supported by this browser. Typing is available.
            </span>
          )}

          {!currentEvaluation && (
            <button
              style={{ ...styles.button, ...styles.primary }}
              onClick={submitAnswer}
              disabled={evaluating || !answer.trim()}
            >
              {evaluating ? (
                <><LoaderCircle size={17} /> Evaluating...</>
              ) : (
                <><Send size={17} /> Submit & evaluate</>
              )}
            </button>
          )}
        </div>

        {listening && (
          <p style={{ color: "#dc2626" }}>
            ? Listening... English speech is being transcribed. Stop recording when finished.
          </p>
        )}

        {error && <p role="alert" style={{ color: "#dc2626" }}>{error}</p>}

        {currentEvaluation && (
          <div style={{ ...cardStyle, background: "var(--surface-secondary, #f8fafc)" }}>
            <h3 style={{ margin: 0 }}>
              AI Feedback ? {currentEvaluation.score}/10
            </h3>
            <p>{currentEvaluation.feedback}</p>

            <div>
              <strong>Strengths</strong>
              {currentEvaluation.strengths?.length ? (
                <ul>
                  {currentEvaluation.strengths.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : <p>No specific strengths listed.</p>}
            </div>

            <div>
              <strong>Improvements</strong>
              {currentEvaluation.improvements?.length ? (
                <ul>
                  {currentEvaluation.improvements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : <p>No specific improvements listed.</p>}
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <button
            style={{ ...styles.button, ...styles.secondary }}
            onClick={() => goToQuestion(questionIndex - 1)}
            disabled={questionIndex === 0 || evaluating}
          >
            <ArrowLeft size={17} /> Previous
          </button>

          {currentEvaluation && !isLastQuestion && (
            <button
              style={{ ...styles.button, ...styles.primary }}
              onClick={() => goToQuestion(questionIndex + 1)}
            >
              Next question <ArrowRight size={17} />
            </button>
          )}

          {currentEvaluation && isLastQuestion && (
            <button
              style={{ ...styles.button, ...styles.primary }}
              onClick={finishInterview}
              disabled={loading}
            >
              {loading ? "Preparing report..." : "Finish & view report"}
            </button>
          )}
        </div>

        <p style={{ opacity: 0.75 }}>
          Evaluated answers: {answeredCount} / {session.questions.length}
        </p>
      </section>
    </div>
  );
}
