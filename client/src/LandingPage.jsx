import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Brain,
  BriefcaseBusiness,
  Mic2,
  Code2,
  Target,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "AI Resume Screening",
    text: "Get an intelligent ATS score with detailed resume improvement suggestions.",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    text: "Create professional and ATS-friendly resumes using modern templates.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Smart Job Matching",
    text: "Compare your resume with job descriptions and find your best matches.",
  },
  {
    icon: Mic2,
    title: "AI Interview",
    text: "Practice HR, technical and project interviews with an AI interviewer.",
  },
  {
    icon: Code2,
    title: "Coding Interview",
    text: "Solve coding questions and receive AI-powered code evaluation.",
  },
  {
    icon: Target,
    title: "Placement Preparation",
    text: "Follow a personalized roadmap for DSA, Core CS and development.",
  },
];

function LandingPage() {
  return (
    <div className="landing">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="nav-inner">

          <div className="logo-box">
            <div className="logo-icon">
              <Sparkles size={20} />
            </div>

            <div>
              <div className="logo-text">
                Smart<span>AI</span>
              </div>

              <div className="logo-subtitle">
                CAREER INTELLIGENCE
              </div>
            </div>
          </div>

          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#about">Why Smart AI</a>
          </nav>

          <div className="nav-buttons">
            <button className="login-btn">
              Login
            </button>

            <button className="start-btn">
              Get Started
              <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </header>


      {/* HERO */}
      <section className="hero">

        <div className="hero-container">

          {/* LEFT */}
          <div className="hero-content">

            <div className="ai-badge">
              <Sparkles size={15} />
              AI-Powered Career Platform
            </div>

            <h1>
              Build Your
              <span> Dream Career</span>
              With AI
            </h1>

            <p>
              Smart AI helps you build an ATS-friendly resume,
              discover matching jobs, identify skill gaps and
              prepare for interviews with personalized AI guidance.
            </p>

            <div className="hero-buttons">

              <button className="primary-btn">
                Create Your Resume
                <ArrowRight size={18} />
              </button>

              <button className="secondary-btn">
                Explore Features
              </button>

            </div>

            <div className="trust-list">

              <div>
                <CheckCircle2 size={17} />
                ATS Optimized
              </div>

              <div>
                <CheckCircle2 size={17} />
                AI Powered
              </div>

              <div>
                <CheckCircle2 size={17} />
                Placement Focused
              </div>

            </div>

          </div>


          {/* RIGHT DASHBOARD MOCKUP */}
          <div className="dashboard-wrapper">

            <div className="dashboard-glow"></div>

            <div className="dashboard-card">

              {/* Browser */}
              <div className="browser-bar">

                <div className="browser-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="browser-url">
                  smartai.com/dashboard
                </div>

              </div>


              <div className="dashboard-body">

                {/* SIDEBAR */}
                <div className="mini-sidebar">

                  <div className="mini-logo">
                    <Sparkles size={13} />
                    <span>Smart AI</span>
                  </div>

                  <div className="side-active">
                    Dashboard
                  </div>

                  <div className="side-item">
                    Resume
                  </div>

                  <div className="side-item">
                    Jobs
                  </div>

                  <div className="side-item">
                    Preparation
                  </div>

                  <div className="side-item">
                    AI Interview
                  </div>

                  <div className="side-item">
                    Progress
                  </div>

                </div>


                {/* MAIN DASHBOARD */}
                <div className="mini-main">

                  <div className="dashboard-heading">
                    <div>
                      <small>DASHBOARD</small>
                      <h3>Good Morning, Nidhi 👋</h3>
                      <p>
                        Here's your career progress at a glance.
                      </p>
                    </div>
                  </div>


                  {/* STATS */}
                  <div className="stats-grid">

                    <div className="stat-card">
                      <div className="stat-icon purple">
                        <Target size={15} />
                      </div>

                      <small>ATS Score</small>
                      <strong>82</strong>
                    </div>


                    <div className="stat-card">
                      <div className="stat-icon blue">
                        <BriefcaseBusiness size={15} />
                      </div>

                      <small>Job Matches</small>
                      <strong>12</strong>
                    </div>


                    <div className="stat-card">
                      <div className="stat-icon violet">
                        <BarChart3 size={15} />
                      </div>

                      <small>Preparation</small>
                      <strong>68%</strong>
                    </div>


                    <div className="stat-card">
                      <div className="stat-icon orange">
                        <Mic2 size={15} />
                      </div>

                      <small>Interviews</small>
                      <strong>4</strong>
                    </div>

                  </div>


                  {/* LOWER CARDS */}
                  <div className="dashboard-row">

                    {/* RESUME */}
                    <div className="resume-health">

                      <div className="card-title">
                        <strong>Resume Health</strong>

                        <span>Good</span>
                      </div>

                      <div className="resume-content">

                        <div className="score-circle">
                          <div>
                            <strong>82</strong>
                            <small>/100</small>
                          </div>
                        </div>

                        <div className="progress-list">

                          <div>
                            <label>
                              Skills <b>90%</b>
                            </label>

                            <div className="progress">
                              <span style={{ width: "90%" }}></span>
                            </div>
                          </div>


                          <div>
                            <label>
                              Keywords <b>76%</b>
                            </label>

                            <div className="progress">
                              <span style={{ width: "76%" }}></span>
                            </div>
                          </div>


                          <div>
                            <label>
                              Experience <b>84%</b>
                            </label>

                            <div className="progress">
                              <span style={{ width: "84%" }}></span>
                            </div>
                          </div>

                        </div>

                      </div>

                    </div>


                    {/* AI */}
                    <div className="ai-card">

                      <div className="ai-title">
                        <div>
                          <Sparkles size={15} />
                        </div>

                        <strong>AI Career Recommendation</strong>
                      </div>

                      <p>
                        Your resume is strong for MERN Developer roles.
                        Improve keywords and add measurable achievements.
                      </p>

                      <button>
                        View AI Suggestions
                      </button>

                    </div>

                  </div>


                  {/* JOBS */}
                  <div className="jobs-card">

                    <div className="jobs-heading">
                      <strong>Recommended Jobs</strong>

                      <span>View All</span>
                    </div>

                    <div className="jobs-grid">

                      <div className="job">
                        <div className="job-icon">
                          <BriefcaseBusiness size={13} />
                        </div>

                        <div>
                          <strong>MERN Developer</strong>
                          <small>92% Match · Remote</small>
                        </div>
                      </div>


                      <div className="job">
                        <div className="job-icon">
                          <Code2 size={13} />
                        </div>

                        <div>
                          <strong>Frontend Developer</strong>
                          <small>87% Match · Remote</small>
                        </div>
                      </div>


                      <div className="job">
                        <div className="job-icon">
                          <Brain size={13} />
                        </div>

                        <div>
                          <strong>Full Stack Developer</strong>
                          <small>84% Match · Remote</small>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* FLOATING ATS */}
            <div className="floating-card ats-card">

              <div className="floating-icon green">
                <ShieldCheck size={19} />
              </div>

              <div>
                <small>ATS Score</small>
                <strong>
                  92<span>/100</span>
                </strong>
              </div>

            </div>


            {/* FLOATING AI */}
            <div className="floating-card ai-floating">

              <div className="floating-icon purple-bg">
                <Brain size={19} />
              </div>

              <div>
                <small>AI Match</small>
                <strong>88%</strong>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* STATS */}
      <section className="platform-stats">

        <div>
          <strong>92%</strong>
          <span>Average ATS Score</span>
        </div>

        <div>
          <strong>10K+</strong>
          <span>Resumes Analyzed</span>
        </div>

        <div>
          <strong>5K+</strong>
          <span>Mock Interviews</span>
        </div>

        <div>
          <strong>95%</strong>
          <span>User Satisfaction</span>
        </div>

      </section>


      {/* FEATURES */}
      <section className="features-section" id="features">

        <div className="section-heading">

          <div className="section-badge">
            <Sparkles size={14} />
            Everything You Need
          </div>

          <h2>
            One Platform for Your
            <span> Entire Career Journey</span>
          </h2>

          <p>
            From creating your resume to clearing technical interviews,
            Smart AI helps you prepare smarter and get placement-ready.
          </p>

        </div>


        <div className="features-grid">

          {features.map((feature, index) => {

            const Icon = feature.icon;

            return (
              <div className="feature-card" key={index}>

                <div className="feature-icon">
                  <Icon size={22} />
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.text}</p>

                <div className="feature-link">
                  Explore
                  <ArrowRight size={14} />
                </div>

              </div>
            );

          })}

        </div>

      </section>


      {/* HOW IT WORKS */}
      <section className="how-section" id="how-it-works">

        <div className="section-heading">

          <div className="section-badge">
            <Zap size={14} />
            Simple Process
          </div>

          <h2>
            From Resume to Placement
          </h2>

          <p>
            A simple AI-powered workflow to help you become
            interview-ready.
          </p>

        </div>


        <div className="steps">

          <div className="step">
            <div className="step-icon">
              <FileText size={23} />
            </div>

            <small>STEP 01</small>

            <h3>Build Resume</h3>

            <p>
              Create a professional ATS-friendly resume.
            </p>
          </div>


          <div className="step">
            <div className="step-icon">
              <BarChart3 size={23} />
            </div>

            <small>STEP 02</small>

            <h3>Analyze</h3>

            <p>
              Get ATS score, skill match and AI feedback.
            </p>
          </div>


          <div className="step">
            <div className="step-icon">
              <Target size={23} />
            </div>

            <small>STEP 03</small>

            <h3>Prepare</h3>

            <p>
              Follow a personalized placement roadmap.
            </p>
          </div>


          <div className="step">
            <div className="step-icon">
              <Mic2 size={23} />
            </div>

            <small>STEP 04</small>

            <h3>Practice</h3>

            <p>
              Take AI interviews and coding challenges.
            </p>
          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="cta-section" id="about">

        <div className="cta-box">

          <div className="cta-content">

            <div className="cta-icon">
              <Sparkles size={26} />
            </div>

            <h2>
              Ready to Build Your Dream Career?
            </h2>

            <p>
              Create your resume, improve your skills and practice
              interviews with your personal AI career assistant.
            </p>

            <button className="cta-button">
              Get Started for Free
              <ArrowRight size={18} />
            </button>

          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="footer">

        <div className="footer-logo">
          <div className="logo-icon">
            <Sparkles size={17} />
          </div>

          <div>
            <strong>
              Smart<span>AI</span>
            </strong>

            <small>
              Career Intelligence Platform
            </small>
          </div>
        </div>

        <p>
          © 2026 Smart AI. Built for smarter careers.
        </p>

        <div className="footer-links">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>

      </footer>

    </div>
  );
}

export default LandingPage;