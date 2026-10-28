   import dns from "node:dns";
   dns.setDefaultResultOrder("ipv4first");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

/* =========================================================
   ENVIRONMENT
========================================================= */

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env");
  process.exit(1);
}

if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing in .env");
  process.exit(1);
}

if (!GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env");
  process.exit(1);
}

/* =========================================================
   GEMINI
========================================================= */

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* =========================================================
   MONGODB
========================================================= */

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

/* =========================================================
   USER MODEL
========================================================= */

const userSchema = new mongoose.Schema(
  {
    jobMatchScore: {
      type: Number,
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    // Placement tracking fields
    placementStatus: {
      type: String,
      enum: ["Not Started", "In Progress", "Placed"],
      default: "Not Started",
    },

    companyName: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// User model
const User = mongoose.model("User", userSchema);


/* =========================================================
   ANALYSIS MODEL
========================================================= */

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    fileName: String,

    atsScore: {
      type: Number,
      default: 0,
    },

    matchedKeywords: {
      type: [String],
      default: [],
    },

    missingKeywords: {
      type: [String],
      default: [],
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    skillsMatch: {
      type: Number,
      default: 0,
    },

    jobMatch: {
      type: Number,
      default: 0,
    },

    resumeQuality: {
      type: Number,
      default: 0,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    recommendedKeywords: {
      type: [String],
      default: [],
    },

    aiRewriteAfter: {
      type: String,
      default: "",
    },

    resumeText: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Analysis = mongoose.model("Analysis", analysisSchema);

app.get("/api/student/dashboard-stats", authenticateToken, async (req, res) => {
  try {
   if (!["student", "admin"].includes(req.user.role)) {
  return res.status(403).json({
    success: false,
    message: "Access denied",
  });
}

    const userId = req.user.id;
    const currentUser = await User.findById(userId)
  .select("jobMatchScore")
  .lean();

    // Is student ki latest resume analysis
    const latestAnalysis = await Analysis.findOne({ userId })
      .sort({ createdAt: -1 })
      .lean();

    // Dashboard ke liye analysis count
    const totalAnalyses = await Analysis.countDocuments({ userId });

  return res.status(200).json({
  success: true,
  data: {
    atsScore: latestAnalysis?.atsScore ?? null,
    totalAnalyses,
    hasResumeAnalysis: Boolean(latestAnalysis),

    // Job Matching score
    jobMatchScore: currentUser?.jobMatchScore ?? null,

    latestAnalysis: latestAnalysis
      ? {
          atsScore: latestAnalysis.atsScore,
          matchedKeywords: latestAnalysis.matchedKeywords || [],
          missingKeywords: latestAnalysis.missingKeywords || [],
          createdAt: latestAnalysis.createdAt,
        }
      : null,
  },
});
  } catch (error) {
    console.error("Student dashboard stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load dashboard statistics",
    });
  }
});


/* =========================================================
   RESUME MODEL
========================================================= */

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    personalInfo: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String,
    },

    summary: String,

    skills: {
      type: [String],
      default: [],
    },

    education: [
      {
        degree: String,
        college: String,
        year: String,
        cgpa: String,
      },
    ],

    experience: [
      {
        company: String,
        position: String,
        duration: String,
        description: String,
      },
    ],

    projects: [
      {
        name: String,
        technologies: String,
        description: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

/* =========================================================
   INTERVIEW MODEL
========================================================= */

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: String,

    role: String,

    questions: [
      {
        question: String,
        category: String,
        difficulty: String,
        answer: String,
        feedback: String,
        score: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model("Interview", interviewSchema);

/* =========================================================
   MIDDLEWARE - AUTHENTICATION
========================================================= */

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Authorization token is required",
    });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

/* =========================================================
   GEMINI HELPER
========================================================= */

async function askGemini(prompt) {
  const models = [
    "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
  ];

  let lastError;

  for (const model of models) {
    try {
      console.log(`Trying Gemini model: ${model}`);

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      const text = response.text;

      if (!text || !text.trim()) {
        throw new Error("Gemini returned an empty response.");
      }

      console.log(`Gemini succeeded with model: ${model}`);
      return text;
    } catch (error) {
      lastError = error;

      console.error(
        `Model ${model} failed:`,
        error.message
      );
      console.error("Error name:", error.name);
       console.error("Error cause:", error.cause);
       console.error("Error stack:", error.stack);

      const message = error.message || "";
      const status = Number(error.status || error.code);

      const isTemporary =
        [429, 500, 502, 503, 504].includes(status) ||
        /UNAVAILABLE|high demand|RESOURCE_EXHAUSTED|temporarily unavailable/i.test(
          message
        );

      if (!isTemporary) {
        throw error;
      }
    }
  }

  throw new Error(
    `All Gemini models failed. Last error: ${lastError?.message || "Unknown error"}`
  );
}
/* =========================================================
   HOME
========================================================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart AI Resume Screener API is running",
    port: PORT,
  });
});

/* =========================================================
   SIGNUP
========================================================= */

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "student",
    });

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
});

/* =========================================================
   LOGIN
========================================================= */

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });
  
     console.log("LOGIN USER:", user?.name);
console.log("LOGIN EMAIL:", user?.email);
console.log("LOGIN ROLE:", user?.role);
console.log("DATABASE:", User.db.name);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || "student",
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "student",
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

/* =========================================================
   MULTER
========================================================= */

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

/* =========================================================
   RESUME ANALYSIS
========================================================= */

app.post(
  "/api/analyze-resume",
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a PDF resume",
        });
      }

      const pdfData = await pdfParse(req.file.buffer);

      const resumeText = pdfData.text || "";

      if (!resumeText.trim()) {
        return res.status(400).json({
          success: false,
          message: "Could not extract text from the PDF",
        });
      }

      const keywords = [
        "Java",
        "JavaScript",
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "SQL",
        "HTML",
        "CSS",
        "Tailwind",
        "REST API",
        "Git",
        "GitHub",
        "Docker",
        "Python",
        "DSA",
        "Data Structures",
        "Algorithms",
        "Machine Learning",
        "AI",
        "TypeScript",
        "AWS",
      ];

      const lowerText = resumeText.toLowerCase();

      const matchedKeywords = keywords.filter((keyword) =>
        lowerText.includes(keyword.toLowerCase())
      );

      const missingKeywords = keywords.filter(
        (keyword) =>
          !lowerText.includes(keyword.toLowerCase())
      );

      const skillsMatch = Math.round(
        (matchedKeywords.length / keywords.length) * 100
      );

      const resumeQuality = Math.min(
        100,
        Math.round(
          40 +
            Math.min(resumeText.length / 100, 30) +
            matchedKeywords.length
        )
      );

      const jobMatch = Math.min(
        100,
        Math.round(skillsMatch * 0.8 + resumeQuality * 0.2)
      );

      const atsScore = Math.round(
        skillsMatch * 0.5 +
          resumeQuality * 0.3 +
          jobMatch * 0.2
      );

      const strengths = [];

      if (matchedKeywords.length > 0) {
        strengths.push(
          `Good coverage of technical skills: ${matchedKeywords
            .slice(0, 6)
            .join(", ")}`
        );
      }

      if (resumeText.length > 1000) {
        strengths.push("Resume contains sufficient detailed content");
      }

      if (resumeText.toLowerCase().includes("project")) {
        strengths.push("Projects section detected");
      }

      if (resumeText.toLowerCase().includes("education")) {
        strengths.push("Education section detected");
      }

      if (strengths.length === 0) {
        strengths.push("Resume content was successfully extracted");
      }

      const weaknesses = [];

      if (missingKeywords.length > 0) {
        weaknesses.push(
          `Consider adding relevant skills: ${missingKeywords
            .slice(0, 5)
            .join(", ")}`
        );
      }

      if (!resumeText.toLowerCase().includes("experience")) {
        weaknesses.push("Experience section may need improvement");
      }

      if (!resumeText.toLowerCase().includes("achievement")) {
        weaknesses.push("Add measurable achievements where possible");
      }

      const recommendedKeywords = missingKeywords.slice(0, 8);

      const aiRewriteAfter = `Improve the resume by highlighting measurable achievements, relevant technical skills, strong project descriptions, and keywords matching the target job description.`;

      const evaluation = {
        atsScore,
        matchedKeywords,
        missingKeywords,
        overallScore: atsScore,
        skillsMatch,
        jobMatch,
        resumeQuality,
        strengths,
        weaknesses,
        recommendedKeywords,
        aiRewriteAfter,
      };

      let userId = null;

      if (req.headers.authorization) {
        try {
          const token = req.headers.authorization.replace(
            "Bearer ",
            ""
          );

          const decoded = jwt.verify(token, JWT_SECRET);

          userId = decoded.id;
        } catch {
          userId = null;
        }
      }

      const savedAnalysis = await Analysis.create({
        userId,
        fileName: req.file.originalname,
        resumeText,
        ...evaluation,
      });

      res.json({
        success: true,
        message: "Resume analyzed successfully",
        data: evaluation,
        analysisId: savedAnalysis._id,
      });
    } catch (error) {
      console.error("Resume analysis error:", error);

      res.status(500).json({
        success: false,
        message: "Resume analysis failed",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   LATEST ANALYSIS
========================================================= */

app.get(
  "/api/latest-analysis",
  authenticateToken,
  async (req, res) => {
    try {
      const analysis = await Analysis.findOne({
        userId: req.user.id,
      }).sort({
        createdAt: -1,
      });

      if (!analysis) {
        return res.json({
          success: true,
          data: null,
        });
      }

      res.json({
        success: true,
        data: analysis,
      });
    } catch (error) {
      console.error("Latest analysis error:", error);

      res.status(500).json({
        success: false,
        message: "Could not fetch latest analysis",
      });
    }
  }
);

/* =========================================================
   SAVE RESUME
========================================================= */

app.post(
  "/api/resume/save",
  authenticateToken,
  async (req, res) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
  return res.status(400).json({
    success: false,
    message: "Resume data is empty",
  });
}
      const {
        personalInfo,
        summary,
        skills,
        education,
        experience,
        projects,
      } = req.body;

      const resume = await Resume.findOneAndUpdate(
        {
          userId: req.user.id,
        },
        {
          userId: req.user.id,
          personalInfo,
          summary,
          skills: skills || [],
          education: education || [],
          experience: experience || [],
          projects: projects || [],
        },
        {
          new: true,
          upsert: true,
        }
      );

      res.json({
        success: true,
        message: "Resume saved successfully",
        data: resume,
      });
    } catch (error) {
      console.error("Resume save error:", error);

      res.status(500).json({
        success: false,
        message: "Could not save resume",
      });
    }
  }
);

/* =========================================================
   GET RESUME
========================================================= */

app.get(
  "/api/resume",
  authenticateToken,
  async (req, res) => {
    try {
      const resume = await Resume.findOne({
        userId: req.user.id,
      });

      res.json({
        success: true,
        data: resume,
      });
    } catch (error) {
      console.error("Resume fetch error:", error);

      res.status(500).json({
        success: false,
        message: "Could not fetch resume",
      });
    }
  }
);

/* =========================================================
   AI JOB MATCHING
========================================================= */

app.post("/api/job-match", authenticateToken, async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job description is required",
      });
    }

    let finalResumeText =
      typeof resumeText === "string" ? resumeText.trim() : "";

    // Step 1: Get the latest analyzed PDF resume
    if (!finalResumeText) {
      const latestAnalysis = await Analysis.findOne({
        userId: req.user.id,
        resumeText: { $exists: true, $ne: "" },
      }).sort({ createdAt: -1 });

      finalResumeText = latestAnalysis?.resumeText?.trim() || "";
    }

    // Step 2: If no PDF analysis exists, use Resume Builder data
    if (!finalResumeText) {
      const savedResume = await Resume.findOne({
        userId: req.user.id,
      });

      if (savedResume) {
        const personal = savedResume.personalInfo || {};

        const educationText = (savedResume.education || [])
          .map((item) =>
            [
              item.degree,
              item.college,
              item.year,
              item.cgpa,
            ]
              .filter(Boolean)
              .join(" | ")
          )
          .join("\n");

        const experienceText = (savedResume.experience || [])
          .map((item) =>
            [
              item.position,
              item.company,
              item.duration,
              item.description,
            ]
              .filter(Boolean)
              .join(" | ")
          )
          .join("\n");

        const projectsText = (savedResume.projects || [])
          .map((item) =>
            [
              item.name,
              item.technologies,
              item.description,
            ]
              .filter(Boolean)
              .join(" | ")
          )
          .join("\n");

        finalResumeText = [
          personal.fullName,
          personal.email,
          personal.location,
          savedResume.summary,
          Array.isArray(savedResume.skills)
            ? savedResume.skills.join(", ")
            : savedResume.skills,
          educationText,
          experienceText,
          projectsText,
        ]
          .filter(Boolean)
          .join("\n")
          .trim();
      }
    }

    // Step 3: Show an error if no resume is available
    if (!finalResumeText) {
      return res.status(400).json({
        success: false,
        message:
          "No resume found. Upload and analyze a PDF resume, or save your resume in Resume Builder first.",
      });
    }

    // Step 4: Compare resume with the job description
    const prompt = `
You are an expert ATS and recruitment assistant.

Compare the candidate's resume with the job description.
Only count skills supported by the resume.
Do not assume missing skills are present.
Calculate a reasonable match score from 0 to 100.

RESUME:
${finalResumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY valid JSON in this exact format:
{
  "matchScore": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "matchedKeywords": [],
  "missingKeywords": [],
  "recommendations": []
}

Do not include markdown or any text outside the JSON.
`;

    const text = await askGemini(prompt);

    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let result;

    try {
      result = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Invalid AI JSON:", cleaned);

      return res.status(502).json({
        success: false,
        message: "AI returned an invalid response. Please retry.",
      });
    }

    // Save the latest job match score for this student
const matchScore = Number(result.matchScore);

if (!Number.isFinite(matchScore) || matchScore < 0 || matchScore > 100) {
  return res.status(502).json({
    success: false,
    message: "AI returned an invalid match score. Please retry.",
  });
}

await User.findByIdAndUpdate(
  req.user.id,
  { $set: { jobMatchScore: matchScore } }
);

return res.json({
  success: true,
  data: {
    ...result,
    matchScore,
  },
});
  
} catch (error) {
  const message = String(error?.message || "");
  const status = error?.status || error?.statusCode || error?.cause?.status;

  console.error("Job match error:", {
    message,
    status,
  });

  const isTemporary =
    status === 503 ||
    status === 429 ||
    message.includes("503") ||
    message.includes("429") ||
    message.includes("UNAVAILABLE") ||
    message.includes("high demand") ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.includes("temporarily unavailable");

  return res.status(isTemporary ? 503 : 500).json({
    success: false,
    message: isTemporary
      ? "AI service is busy or temporarily rate-limited. Please wait a little and try again."
      : "Job matching failed. Please check the server logs and try again.",
  });
}
});
/* =========================================================
   START AI INTERVIEW
========================================================= */



const fallbackInterviewQuestions = {
  HR: [
    "Tell me about yourself.",
    "What are your strengths and weaknesses?",
    "Why should we hire you?",
    "Why do you want to join our company?",
    "Where do you see yourself in five years?",
    "Describe a challenge you overcame.",
    "How do you handle pressure?",
    "Tell me about a time you worked in a team.",
    "How do you handle feedback?",
    "What motivates you?",
    "What is your biggest achievement?",
    "How do you manage your time?",
    "Describe a mistake you learned from.",
    "How do you handle disagreements?",
    "What are your career goals?",
    "Why did you choose computer science?",
    "What makes you different from other candidates?",
    "Are you comfortable learning new technologies?",
    "What are your salary expectations?",
    "Do you have any questions for us?"
  ],
  Technical: [
    "Explain let, const and var in JavaScript.",
    "What is the Virtual DOM in React?",
    "What are React hooks?",
    "Explain props and state in React.",
    "What is Node.js?",
    "What is Express.js?",
    "What is a REST API?",
    "Explain GET, POST, PUT and DELETE.",
    "What is middleware in Express?",
    "What is MongoDB?",
    "Compare SQL and NoSQL databases.",
    "What is a Promise in JavaScript?",
    "Explain async and await.",
    "What is JWT authentication?",
    "Differentiate authentication and authorization.",
    "What is Git used for?",
    "What are HTTP status codes?",
    "Explain == versus === in JavaScript.",
    "What is time complexity?",
    "Explain MVC architecture."
  ],
  Project: [
    "Describe your project and its main objective.",
    "What problem does your project solve?",
    "Why did you choose this project?",
    "Explain your project architecture.",
    "Which technologies did you use and why?",
    "Explain your frontend structure.",
    "How does your backend work?",
    "How does your app connect to MongoDB?",
    "How did you implement authentication?",
    "How does resume analysis work?",
    "How is the ATS score calculated?",
    "How does job matching work?",
    "How did you integrate the Gemini API?",
    "How does your app handle API failures?",
    "What was the most difficult bug you fixed?",
    "How do you validate user input?",
    "How do you protect sensitive data?",
    "What testing have you performed?",
    "What would you improve in your project?",
    "Explain the most important feature of your project."
  ]
};


app.post(
  "/api/interview/start",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        type = "Technical",
        role = "Full Stack Developer",
      } = req.body;

      const selectedType = ["HR", "Technical", "Project"].includes(type)
        ? type
        : "Technical";

      // Get the latest analyzed resume for this user.
      const latestAnalysis = await Analysis.findOne({
        userId: req.user.id,
        resumeText: { $exists: true, $ne: "" },
      }).sort({ createdAt: -1 });

      const resumeText = latestAnalysis?.resumeText?.trim();

      if (!resumeText) {
        return res.status(400).json({
          success: false,
          message:
            "Please upload and analyze your resume before starting the AI interview.",
        });
      }

      const resumeForPrompt = resumeText.slice(0, 5000);

      const prompt = `
You are a placement interviewer conducting a ${selectedType} interview
for a ${role} candidate.

Candidate resume:
"""
${resumeForPrompt}
"""

Generate exactly 20 unique, concise questions personalized to this resume.

Rules:
- Use only skills, projects, education, and experience present in the resume.
- Technical questions must test listed skills.
- Project questions must refer to actual listed projects.
- HR questions must reflect the candidate's background.
- Distribute difficulty across Easy, Medium, and Hard.
- Do not invent candidate details.
- Return only valid JSON, without markdown.

Required format:
{
  "questions": [
    {
      "question": "Question text",
      "category": "${selectedType}",
      "difficulty": "Easy"
    }
  ]
}
`;

      let generatedQuestions = [];

      try {
       const startTime = Date.now();

const aiText = await askGemini(prompt);

console.log(
  "AI question generation time:",
  ((Date.now() - startTime) / 1000).toFixed(2),
  "seconds"
);
        const cleaned = aiText
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();

        const parsed = JSON.parse(cleaned);

        if (Array.isArray(parsed.questions)) {
          generatedQuestions = parsed.questions
            .filter((item) => item && item.question)
            .slice(0, 20)
            .map((item) => ({
              question: String(item.question),
              category: selectedType,
              difficulty: ["Easy", "Medium", "Hard"].includes(item.difficulty)
                ? item.difficulty
                : "Medium",
              answer: "",
              feedback: "",
              score: 0,
            }));
        }
      } catch (aiError) {
        console.error("Resume-based AI generation failed:", aiError.message);
      }

      // If AI generation fails, use the existing fallback questions.
      if (generatedQuestions.length === 0) {
        generatedQuestions = fallbackInterviewQuestions[selectedType]
          .slice(0, 20)
          .map((question, index) => ({
            question,
            category: selectedType,
            difficulty: index < 4 ? "Easy" : index < 7 ? "Medium" : "Hard",
            answer: "",
            feedback: "",
            score: 0,
          }));
      }

      const interview = await Interview.create({
        userId: req.user.id,
        type: selectedType,
        role,
        questions: generatedQuestions,
      });

      return res.json({
        success: true,
        data: {
          interviewId: interview._id,
          questions: generatedQuestions,
        },
      });
    } catch (error) {
      console.error("Interview start error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Could not start interview. Please try again.",
      });
    }
  }
);



/* =========================================================
   INTERVIEW ANSWER
========================================================= */


app.post(
  "/api/interview/answer",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        interviewId,
        questionIndex,
        question,
        answer,
        role = "Full Stack Developer",
      } = req.body;

      // Validate required fields
      if (!question || !answer) {
        return res.status(400).json({
          success: false,
          message: "Question and answer are required",
        });
      }

      // Prompt for AI evaluation
      const prompt = `
You are an expert placement interviewer.

Evaluate the candidate's answer.

Role:
${role}

Question:
${question}

Candidate Answer:
${answer}

Return ONLY valid JSON in this format:

{
  "score": 0,
  "feedback": "feedback here",
  "strengths": [],
  "improvements": []
}

Score should be from 0 to 10.
Do not include markdown.
`;

      // Get evaluation from Gemini
      const text = await askGemini(prompt);

      const cleaned = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      let evaluation;

      try {
        evaluation = JSON.parse(cleaned);
      } catch (parseError) {
        console.error("Evaluation JSON parse error:", parseError);

        evaluation = {
          score: 0,
          feedback: cleaned,
          strengths: [],
          improvements: [],
        };
      }

      // Validate score
      const score = Number(evaluation.score);

      evaluation.score = Number.isFinite(score)
        ? Math.max(0, Math.min(10, score))
        : 0;

      // Save the answer and evaluation to MongoDB
      if (interviewId && questionIndex !== undefined) {
        const interview = await Interview.findOne({
          _id: interviewId,
          userId: req.user.id,
        });

        const index = Number(questionIndex);

        if (
          interview &&
          Number.isInteger(index) &&
          index >= 0 &&
          index < interview.questions.length
        ) {
          const currentQuestion = interview.questions[index];

          currentQuestion.answer = answer;
          currentQuestion.feedback = evaluation.feedback;
          currentQuestion.score = evaluation.score;

          await interview.save();
        }
      }

      return res.json({
        success: true,
        data: evaluation,
      });
   
    } catch (error) {
      console.error("Interview answer error:", error);
      console.error("Error message:", error.message);
      console.error("Error status:", error.status || error.code);

      return res.status(500).json({
        success: false,
        message: "Interview evaluation failed",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   AI MOCK INTERVIEW - START
   Uses the latest ATS-analyzed resume.
========================================================= */

app.post(
  "/api/mock-interview/start",
  authenticateToken,
  async (req, res) => {
    try {
      const role = String(
        req.body.role || "Full Stack Developer"
      ).slice(0, 100);

      // Validate selected interview type
      const { interviewType } = req.body;
      const allowedTypes = ["HR", "Technical", "Project"];

      if (!allowedTypes.includes(interviewType)) {
        return res.status(400).json({
          success: false,
          message: "Please select HR, Technical, or Project interview.",
        });
      }

      // Require a previously analyzed resume
      const analysis = await Analysis.findOne({
        userId: req.user.id,
      }).sort({ createdAt: -1 });

      if (!analysis || !analysis.resumeText?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Resume analysis nahi mila. Pehle ATS Resume Analysis mein apna PDF upload aur analyze karo.",
        });
      }

      const resumeText = analysis.resumeText.slice(0, 14000);

     const prompt = `
Create exactly 20 interview questions using this resume.

Role: ${role}
Interview type: ${interviewType}

Resume:
${resumeText.slice(0, 7000)}

Rules:
- Personalize questions to resume skills and projects.
- HR: behavioral and career questions.
- Technical: skills and concepts.
- Project: actual resume projects.
- Use concise questions.
- Return ONLY valid JSON:
{
  "questions": [
    {
      "question": "Question text",
      "category": "${interviewType}",
      "difficulty": "Easy"
    }
  ]
}
`;

      const text = await askGemini(prompt);
      const cleaned = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      let parsed;

      try {
        parsed = JSON.parse(cleaned);
      } catch (parseError) {
        console.error("Mock questions JSON error:", parseError);
        return res.status(502).json({
          success: false,
          message: "AI ne valid question list return nahi ki. Please retry.",
        });
      }

      if (
        !Array.isArray(parsed.questions) ||
        parsed.questions.length < 20
      ) {
        return res.status(502).json({
          success: false,
          message:
            "AI ne 20 complete questions generate nahi kiye. Please retry.",
        });
      }

      const questions = parsed.questions.slice(0, 20).map((item) => ({
        question: String(item.question || "").trim(),
        category: interviewType,
        difficulty: ["Easy", "Medium", "Hard"].includes(item.difficulty)
          ? item.difficulty
          : "Medium",
        answer: "",
        feedback: "",
        score: 0,
      }));

      if (questions.some((item) => !item.question)) {
        return res.status(502).json({
          success: false,
          message: "AI returned an incomplete question. Please retry.",
        });
      }

      const interview = await Interview.create({
        userId: req.user.id,
        type: "Mock",
        role,
        questions,
      });

      return res.status(201).json({
        success: true,
        message: "Mock interview ready",
        data: {
          interviewId: interview._id,
          role,
          interviewType,
          questions: questions.map((item, index) => ({
            questionIndex: index,
            question: item.question,
            category: item.category,
            difficulty: item.difficulty,
          })),
        },
      });
    } catch (error) {
      console.error("Mock interview start error:", error);

      return res.status(500).json({
        success: false,
        message: "Mock interview start nahi ho saka.",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   AI MOCK INTERVIEW - EVALUATE ANSWER
========================================================= */

app.post(
  "/api/mock-interview/answer",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        interviewId,
        questionIndex,
        answer,
      } = req.body;

      if (
        !interviewId ||
        !Number.isInteger(Number(questionIndex)) ||
        !String(answer || "").trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Interview, question index and answer are required.",
        });
      }

      const index = Number(questionIndex);

      const foundInterview = await Interview.findById(interviewId).lean();

console.log("Interview ID:", interviewId);
console.log("Logged-in user ID:", req.user.id);

console.log(
  "Database interview:",
  foundInterview
    ? {
        id: String(foundInterview._id),
        userId: String(foundInterview.userId),
        type: foundInterview.type,
      }
    : null
);

const interview = await Interview.findOne({
  _id: interviewId,
  userId: req.user.id,
  type: { $in: ["Mock", "HR", "Technical", "Project"] },
});
      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Mock interview not found.",
        });
      }

      if (index < 0 || index >= interview.questions.length) {
        return res.status(400).json({
          success: false,
          message: "Invalid question index.",
        });
      }

      const current = interview.questions[index];
      const safeAnswer = String(answer).trim().slice(0, 8000);

      const prompt = `
You are a fair placement interviewer evaluating one answer.

Role: ${interview.role}
Category: ${current.category}
Difficulty: ${current.difficulty}
Question: ${current.question}
Candidate answer: ${safeAnswer}

Evaluate relevance, correctness, clarity and practical understanding.
Do not reward unsupported claims. If the answer is blank or irrelevant,
give a low score.

Return ONLY valid JSON:
{
  "score": 0,
  "feedback": "Specific, helpful feedback",
  "strengths": ["strength"],
  "improvements": ["improvement"]
}

Score must be a number from 0 to 10.
Use empty arrays when appropriate. No markdown.
`;

     const evaluationStart = Date.now();

const aiResponse = await ai.models.generateContent({
  model: "gemini-3.5-flash-lite",
  contents: prompt,
});

const text = aiResponse.text;

console.log(
  "Single-model evaluation time:",
  ((Date.now() - evaluationStart) / 1000).toFixed(2),
  "seconds"
);
      const cleaned = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      let evaluation;

      try {
        evaluation = JSON.parse(cleaned);
      } catch (parseError) {
        console.error("Mock evaluation JSON error:", parseError);
        return res.status(502).json({
          success: false,
          message: "AI evaluation response invalid hai. Please retry.",
        });
      }

      const score = Number(evaluation.score);

      if (!Number.isFinite(score)) {
        return res.status(502).json({
          success: false,
          message: "AI evaluation score valid nahi hai. Please retry.",
        });
      }

      evaluation.score = Math.max(0, Math.min(10, score));
      evaluation.feedback = String(evaluation.feedback || "");
      evaluation.strengths = Array.isArray(evaluation.strengths)
        ? evaluation.strengths.map(String)
        : [];
      evaluation.improvements = Array.isArray(evaluation.improvements)
        ? evaluation.improvements.map(String)
        : [];

      current.answer = safeAnswer;
      current.feedback = evaluation.feedback;
      current.score = evaluation.score;

      await interview.save();

      const answeredCount = interview.questions.filter(
        (item) => String(item.answer || "").trim()
      ).length;

      const scoredQuestions = interview.questions.filter(
        (item) => String(item.answer || "").trim()
      );

      const totalScore = scoredQuestions.reduce(
        (sum, item) => sum + (Number(item.score) || 0),
        0
      );

      return res.json({
        success: true,
        data: evaluation,
        progress: {
          answered: answeredCount,
          total: interview.questions.length,
          averageScore: scoredQuestions.length
            ? Number((totalScore / scoredQuestions.length).toFixed(1))
            : 0,
          completed: answeredCount === interview.questions.length,
        },
      });
    } catch (error) {
      console.error("Mock answer evaluation error:", error);

      return res.status(500).json({
        success: false,
        message: "Mock interview evaluation failed.",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   AI MOCK INTERVIEW - FINAL REPORT
========================================================= */

app.get(
  "/api/mock-interview/:interviewId/report",
  authenticateToken,
  async (req, res) => {
    try {
    const interview = await Interview.findOne({
  _id: req.params.interviewId,
  userId: req.user.id,
  type: { $in: ["Mock", "HR", "Technical", "Project"] },
}).lean();
console.log("Report interview ID:", req.params.interviewId);
console.log("Logged-in user ID:", req.user.id);

const found = await Interview.findById(
  req.params.interviewId
).lean();

console.log(
  "Database record:",
  found
    ? {
        id: String(found._id),
        userId: String(found.userId),
        type: found.type,
      }
    : null
);
      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Mock interview not found.",
        });
      }

      const questions = interview.questions || [];
      const answered = questions.filter(
        (item) => String(item.answer || "").trim()
      );

      const totalScore = answered.reduce(
        (sum, item) => sum + (Number(item.score) || 0),
        0
      );

      return res.json({
        success: true,
        data: {
          role: interview.role,
          totalQuestions: questions.length,
          answeredQuestions: answered.length,
          averageScore: answered.length
            ? Number((totalScore / answered.length).toFixed(1))
            : 0,
          questions: questions.map((item, index) => ({
            questionIndex: index,
            question: item.question,
            category: item.category,
            difficulty: item.difficulty,
            answer: item.answer || "",
            score: Number(item.score) || 0,
            feedback: item.feedback || "",
          })),
        },
      });
    } catch (error) {
      console.error("Mock report error:", error);

      return res.status(500).json({
        success: false,
        message: "Mock interview report load nahi ho saka.",
      });
    }
  }
);


/* =========================================================
   CODING QUESTION
========================================================= */

app.get(
  "/api/coding/question",
  authenticateToken,
  async (req, res) => {
    const fallbackQuestion = {
      title: "Two Sum",
      difficulty: "Easy",
      description:
        "Given an array of integers nums and an integer target, return the indices of two numbers that add up to target. You may not use the same element twice.",
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      example:
        "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
      language: "Java",
    };

    try {
      const prompt = `
Generate ONE easy coding interview question for a placement candidate.

Return ONLY valid JSON with these fields:
{
  "title": "Question title",
  "difficulty": "Easy",
  "description": "Problem description",
  "input": "Sample input",
  "output": "Expected output",
  "example": "Example",
  "language": "Java"
}
Do not include markdown.
`;

      const text = await askGemini(prompt);
      const cleaned = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const question = JSON.parse(cleaned);

      return res.json({
        success: true,
        data: question,
      });
    } catch (error) {
      console.error(
        "Coding question generation failed; using fallback:",
        error.message
      );

      return res.json({
        success: true,
        data: fallbackQuestion,
      });
    }
  }
);

app.post("/api/coding/execute", authenticateToken, async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide code to execute.",
      });
    }

    if (code.length > 20000) {
      return res.status(400).json({
        success: false,
        message: "Code must be under 20,000 characters.",
      });
    }

    const supportedLanguages = {
      java: {
        language: "java",
        version: "15.0.2",
        filename: "Main.java",
      },
      javascript: {
        language: "javascript",
        version: "20.11.1",
        filename: "main.js",
      },
    };

    const selectedLanguage = String(language || "java").toLowerCase();
    const runtime = supportedLanguages[selectedLanguage];

    if (!runtime) {
      return res.status(400).json({
        success: false,
        message: "Supported languages: Java and JavaScript.",
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let pistonResult;

    try {
      const response = await fetch(
        "http://localhost:2000/api/v2/execute",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({
            language: runtime.language,
            version: runtime.version,
            files: [
              {
                name: runtime.filename,
                content: code,
              },
            ],
          }),
        }
      );

      pistonResult = await response.json();

      if (!response.ok) {
        return res.status(502).json({
          success: false,
          message: pistonResult.message || "Code execution service failed.",
        });
      }
    } finally {
      clearTimeout(timeout);
    }

    return res.json({
      success: true,
      language: runtime.language,
      output: pistonResult.run?.stdout || "",
      error: pistonResult.run?.stderr || "",
      exitCode: pistonResult.run?.code ?? null,
      status: pistonResult.run?.status || null,
    });
  } catch (error) {
    console.error("Code execution failed:", error.message);

    return res.status(500).json({
      success: false,
      message:
        error.name === "AbortError"
          ? "Code execution timed out."
          : "Unable to execute code. Check that Piston is running.",
    });
  }
});



/* =========================================================
   CODING SUBMISSION
========================================================= */

app.post(
  "/api/coding/submit",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        question,
        code,
        language = "Java",
      } = req.body;

      if (!code) {
        return res.status(400).json({
          success: false,
          message: "Code is required",
        });
      }

      const prompt = `
You are an expert coding interviewer.

Evaluate the following candidate solution.

Question:
${question || "Two Sum"}

Language:
${language}

Candidate Code:
${code}

Return ONLY valid JSON:

{
  "score": 0,
  "correctness": "Correct",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(n)",
  "feedback": "feedback",
  "improvements": []
}

Score should be from 0 to 10.

Do not include markdown.
`;

      const text = await askGemini(prompt);

      const cleaned = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      let evaluation;

      try {
        evaluation = JSON.parse(cleaned);
      } catch {
        evaluation = {
          score: 0,
          correctness: "Unable to evaluate",
          timeComplexity: "Unknown",
          spaceComplexity: "Unknown",
          feedback: cleaned,
          improvements: [],
        };
      }

      res.json({
        success: true,
        data: evaluation,
      });
    } catch (error) {
      console.error("Coding submission error:", error);

      res.status(500).json({
        success: false,
        message: "Code evaluation failed",
      });
    }
  }
);


app.post("/api/coding/run", authenticateToken, async (req, res) => {
  try {
    const { language, code, stdin = "" } = req.body;

    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter your code.",
      });
    }

    if (code.length > 20000) {
      return res.status(400).json({
        success: false,
        message: "Code must be under 20,000 characters.",
      });
    }

    const runtimes = {
      java: { language: "java", version: "15.0.2", filename: "Main.java" },
      javascript: {
        language: "javascript",
        version: "20.11.1",
        filename: "main.js",
      },
    };

    const selectedLanguage = String(language || "java").toLowerCase();
    const runtime = runtimes[selectedLanguage];

    if (!runtime) {
      return res.status(400).json({
        success: false,
        message: "Supported languages: Java and JavaScript.",
      });
    }

    const response = await fetch(
      `${process.env.PISTON_API_URL || "http://localhost:2000"}/api/v2/execute`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
          language: runtime.language,
          version: runtime.version,
          files: [{ name: runtime.filename, content: code }],
          stdin: String(stdin),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: data.message || "Piston execution request failed.",
      });
    }

    const compileError = data.compile?.stderr || "";
    const run = data.run || {};
    const stderr = [compileError, run.stderr].filter(Boolean).join("\n");

    return res.json({
      success: true,
      data: {
        status:
          run.code === 0 && !compileError ? "Success" : "Failed",
        output:
          [compileError, run.stdout, run.stderr]
            .filter(Boolean)
            .join("\n") || "(No output)",
        stdout: run.stdout || "",
        stderr,
        exitCode: run.code ?? data.compile?.code ?? null,
        language: data.language,
        version: data.version,
      },
    });
  } catch (error) {
    console.error("Coding run error:", error.message);

    return res.status(502).json({
      success: false,
      message:
        error.name === "TimeoutError" || error.name === "AbortError"
          ? "Code execution timed out."
          : "Execution service unavailable. Check that Piston is running.",
    });
  }
});


/* =========================================================
   ADMIN STATS
========================================================= */



app.get(
  "/api/admin/stats",
  authenticateToken,
  async (req, res) => {
    try {
      // Only admin can access these statistics
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Admin access required",
        });
        
      }

      // Count registered students
      const totalStudents = await User.countDocuments({
        role: "student",
      });

      // Count resumes and analyses
      const totalResumes = await Resume.countDocuments();
      const totalAnalyses = await Analysis.countDocuments();

      // Calculate average ATS score
      const averageResult = await Analysis.aggregate([
        {
          $group: {
            _id: null,
            averageScore: {
              $avg: "$atsScore",
            },
          },
        },
      ]);

      const averageATS =
        averageResult.length > 0
          ? Math.round(averageResult[0].averageScore || 0)
          : 0;

      return res.status(200).json({
        success: true,
        data: {
          totalStudents,
          totalResumes,
          totalAnalyses,
          averageATS,
        },
      });
    } catch (error) {
      console.error("Admin stats error:", error);

      return res.status(500).json({
        success: false,
        message: "Could not fetch admin statistics",
      });
    }
  }
);

/* =========================================================
   ADMIN: GET ALL STUDENTS AND PLACEMENT STATISTICS
========================================================= */

app.get(
  "/api/admin/students",
  authenticateToken,
  async (req, res) => {
    try {
      // Only admin/TPO can access this route
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Admin access required",
        });
      }

      const students = await User.find({ role: "student" })
        .select("name email placementStatus companyName")
        .sort({ name: 1 })
        .lean();

      const normalizedStudents = students.map((student) => ({
        ...student,
        placementStatus: student.placementStatus || "Not Started",
        companyName: student.companyName || "",
      }));

      const totalStudents = normalizedStudents.length;

      const placedStudents = normalizedStudents.filter(
        (student) => student.placementStatus === "Placed"
      ).length;

      const atRiskStudents = normalizedStudents.filter(
        (student) => student.placementStatus === "Not Started"
      ).length;

      const placementPercentage =
        totalStudents > 0
          ? Math.round((placedStudents / totalStudents) * 100)
          : 0;

      return res.status(200).json({
        success: true,
        data: {
          students: normalizedStudents,
          placedStudents,
          atRiskStudents,
          placementPercentage,
        },
      });
    } catch (error) {
      console.error("Admin students error:", error);

      return res.status(500).json({
        success: false,
        message: "Could not load student placement data",
      });
    }
  }
);


/* =========================================================
   ADMIN: UPDATE A STUDENT'S PLACEMENT STATUS
========================================================= */

app.patch(
  "/api/admin/students/:id/placement",
  authenticateToken,
  async (req, res) => {
    try {
      // Only admin/TPO can update placement status
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Admin access required",
        });
      }

      const { id } = req.params;
      const { placementStatus, companyName } = req.body;

      const allowedStatuses = [
        "Not Started",
        "In Progress",
        "Placed",
      ];

      if (!allowedStatuses.includes(placementStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid placement status",
        });
      }

      const normalizedCompanyName =
        typeof companyName === "string" ? companyName.trim() : "";

      if (
        placementStatus === "Placed" &&
        !normalizedCompanyName
      ) {
        return res.status(400).json({
          success: false,
          message: "Please enter the company name",
        });
      }

      // Only update registered student accounts
      const student = await User.findOneAndUpdate(
        { _id: id, role: "student" },
        {
          $set: {
            placementStatus,
            companyName:
              placementStatus === "Placed"
                ? normalizedCompanyName
                : "",
          },
        },
        {
          new: true,
          runValidators: true,
        }
      ).select("name email placementStatus companyName");

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Placement status updated successfully",
        data: student,
      });
    } catch (error) {
      console.error("Update placement error:", error);

      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "Invalid student ID",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Could not save placement status",
      });
    }
  }
);



app.get(
  "/api/student/placement-status",
  authenticateToken,
  async (req, res) => {
    try {
      const student = await User.findById(req.user.id).select(
        "name role placementStatus companyName"
      );

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      if (student.role !== "student") {
        return res.status(403).json({
          success: false,
          message: "Student account required",
        });
      }

      return res.json({
        success: true,
        name: student.name,
        placementStatus: student.placementStatus || "Not Started",
        companyName: student.companyName || "",
      });
    } catch (error) {
      console.error("Student placement status error:", error);
      return res.status(500).json({
        success: false,
        message: "Could not fetch placement status",
      });
    }
  }
);



/* =========================================================
   404
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use((error, req, res, next) => {
  console.error("Global server error:", error);

  res.status(500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

/* =========================================================
   SERVER START
========================================================= */

app.listen(PORT, () => {
  console.log(`Professional Server running on port ${PORT}`);
});
