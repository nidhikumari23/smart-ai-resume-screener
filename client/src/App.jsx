import MockInterview from "./MockInterview";
  import { jsPDF } from "jspdf";
  import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  FileText,
  ScanSearch,
  BriefcaseBusiness,
  BookOpen,
  BrainCircuit,
  Code2,
  Users,
  LogOut,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Upload,
  CheckCircle2,
  Clock3,
  Target,
  TrendingUp,
  UserCircle,
} from "lucide-react";
import Auth from "./Auth";
import "./App.css";

const API_URL = "http://localhost:5001";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("screenerUser");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("screenerUser");
      }
    }
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("screenerUser");
    localStorage.removeItem("screenerToken");

    setUser(null);
    setPage("dashboard");
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard user={user} setPage={setPage} />;

      case "resume-builder":
        return <ResumeBuilder />;

      case "ats-analysis":
        return <ATSAnalysis />;

      case "job-matching":
        return <JobMatching />;

      case "placement":
        return <PlacementPreparation />;

   case "mock-interview":
  return <MockInterview />;

      case "coding-interview":
        return <CodingInterview />;
   case "preparation":
  return <Preparation />;

      case "admin":
  return user?.role === "admin" ? (
    <AdminDashboard />
  ) : (
    <div>
      <h2>Access Denied</h2>
      <p>Only TPO/Admin can access this dashboard.</p>
    </div>
  );

      default:
        return <Dashboard user={user} setPage={setPage} />;
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "resume-builder",
      label: "Resume Builder",
      icon: FileText,
    },
    {
      id: "ats-analysis",
      label: "ATS Resume Analysis",
      icon: ScanSearch,
    },
    {
      id: "job-matching",
      label: "Job Matching",
      icon: BriefcaseBusiness,
    },
    {
      id: "placement",
      label: "Placement Preparation",
      icon: BookOpen,
    },
    {
  id: "mock-interview",
  label: "AI Mock Interview",
  icon: BrainCircuit,
},
    {
      id: "coding-interview",
      label: "AI Coding Interview",
      icon: Code2,
    },
    {
      id: "admin",
      label: "TPO / Admin",
      icon: Users,
    },
  ];

  return (
    <div className="app-layout">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Sparkles size={22} />
          </div>

          <div>
            <h2>Smart AI</h2>
            <span>Resume Screener</span>
          </div>

          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <div className="sidebar-section-title">MAIN MENU</div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={`sidebar-item ${
                  page === item.id ? "active" : ""
                }`}
                onClick={() => {
                  setPage(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar">
              {(user.name || user.email || "U")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="sidebar-user-info">
              <strong>{user.name || "User"}</strong>
              <span>{user.email}</span>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="topbar-title">
            <h1>
              {menuItems.find((item) => item.id === page)?.label ||
                "Dashboard"}
            </h1>
            <p>Build your career with AI-powered preparation.</p>
          </div>

          <div className="topbar-profile">
            <UserCircle size={28} />
            <div>
              <strong>{user.name || "User"}</strong>
              <span>  {user.role === "admin" ? "Admin" : "Student"}</span>
            </div>
          </div>
        </header>

        <section className="page-container">{renderPage()}</section>
      </main>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

const PREP_TASKS = [
  { id: "dsa1", category: "DSA", title: "Arrays and Strings" },
  { id: "dsa2", category: "DSA", title: "Searching and Sorting" },
  { id: "dsa3", category: "DSA", title: "Recursion and Backtracking" },
  { id: "dsa4", category: "DSA", title: "Trees and Graphs" },
  { id: "cs1", category: "Core CS", title: "DBMS and SQL" },
  { id: "cs2", category: "Core CS", title: "Operating Systems" },
  { id: "cs3", category: "Core CS", title: "Computer Networks" },
  { id: "web1", category: "Web Development", title: "HTML, CSS and JavaScript" },
  { id: "web2", category: "Web Development", title: "React.js" },
  { id: "web3", category: "Web Development", title: "Node.js, Express and MongoDB" },
  { id: "int1", category: "Interview Preparation", title: "Resume and Project Explanation" },
  { id: "int2", category: "Interview Preparation", title: "HR and Technical Mock Interview" },
];


function getPrepProgress() {
  try {
    const completed = JSON.parse(
      localStorage.getItem("placementPrepTasks") || "[]"
    );

    return Math.round(
      (completed.length / PREP_TASKS.length) * 100
    );
  } catch (error) {
    return 0;
  }
}
function getCategoryProgress(category) {
  try {
    const completed = JSON.parse(
      localStorage.getItem("placementPrepTasks") || "[]"
    );

    const categoryTasks = PREP_TASKS.filter(
      (task) => task.category === category
    );

    const completedCount = categoryTasks.filter(
      (task) => completed.includes(task.id)
    ).length;

    if (categoryTasks.length === 0) {
      return 0;
    }

    return Math.round(
      (completedCount / categoryTasks.length) * 100
    );
  } catch (error) {
    console.error("Category progress error:", error);
    return 0;
  }
}

function Preparation() {
  const [completed, setCompleted] = React.useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("placementPrepTasks") || "[]"
      );
    } catch {
      return [];
    }
  });

  const progress = Math.round(
    (completed.length / PREP_TASKS.length) * 100
  );

  function toggleTask(id) {
    const updated = completed.includes(id)
      ? completed.filter((taskId) => taskId !== id)
      : [...completed, id];

    localStorage.setItem(
      "placementPrepTasks",
      JSON.stringify(updated)
    );

    setCompleted(updated);
    window.dispatchEvent(new Event("placementProgressUpdated"));
  }

  const categories = [
    "DSA",
    "Core CS",
    "Web Development",
    "Interview Preparation",
  ];

  return (
    <div className="dashboard">
      <h1>Placement Preparation</h1>
      <p>Complete the tasks below to track your placement readiness.</p>

      <div className="stat-card" style={{ margin: "20px 0", padding: 20 }}>
        <h2>Your Preparation Progress</h2>
        <h1>{progress}%</h1>

        <div style={{
          height: 12,
          background: "#e5e7eb",
          borderRadius: 10,
          overflow: "hidden"
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: "#16a34a",
            transition: "width 0.3s ease"
          }} />
        </div>

        <p>{completed.length} of {PREP_TASKS.length} tasks completed</p>
      </div>

      {categories.map((category) => (
        <section key={category} style={{ marginBottom: 24 }}>
          <h2>{category}</h2>

          {PREP_TASKS.filter((task) => task.category === category).map((task) => (
            <label key={task.id} style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 14,
              margin: "8px 0",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              cursor: "pointer"
            }}>
              <input
                type="checkbox"
                checked={completed.includes(task.id)}
                onChange={() => toggleTask(task.id)}
              />

              <span style={{
                textDecoration: completed.includes(task.id)
                  ? "line-through"
                  : "none"
              }}>
                {task.title}
              </span>
            </label>
          ))}
        </section>
      ))}
    </div>
  );
}


function Dashboard({ user, setPage }) {
  const [preparationProgress, setPreparationProgress] =
    React.useState(() => getPrepProgress());

  const [dashboardStats, setDashboardStats] = React.useState({
    atsScore: null,
    totalAnalyses: 0,
    jobMatchScore: null,
  });

  const [statsLoading, setStatsLoading] = React.useState(true);

  // Update preparation progress
  React.useEffect(() => {
    const updateProgress = () => {
      setPreparationProgress(getPrepProgress());
    };

    updateProgress();

    window.addEventListener(
      "placementProgressUpdated",
      updateProgress
    );
    window.addEventListener("focus", updateProgress);

    return () => {
      window.removeEventListener(
        "placementProgressUpdated",
        updateProgress
      );
      window.removeEventListener("focus", updateProgress);
    };
  }, []);

  // Fetch dashboard statistics
  React.useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("screenerToken");

        if (!token) {
          return;
        }

        const response = await fetch(
          `${API_URL}/api/student/dashboard-stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (response.ok && result.success) {
          setDashboardStats(result.data);
        }
      } catch (error) {
        console.error("Dashboard stats error:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const categories = [
    "DSA",
    "Web Development",
    "Core CS",
    "Interview Preparation",
  ];

  return (
    <div className="dashboard">

      {user?.role === "student" && <StudentPlacementStatus />}

      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div>
          <span className="small-label">
            <Sparkles size={14} />
            AI CAREER ASSISTANT
          </span>

          <h2>
            Welcome back, {user?.name?.split(" ")[0] || "Student"}! 👋
          </h2>

          <p>
            Continue your placement preparation and improve your
            career readiness with AI.
          </p>

          <button
            className="primary-btn"
            onClick={() => setPage("ats-analysis")}
          >
            Analyze My Resume
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="banner-decoration">
          <Sparkles size={90} />
        </div>
      </div>

      {/* Dashboard Statistics */}
      <div className="stats-grid">
        <StatCard
          title="ATS Score"
          value={
            statsLoading
              ? "Loading..."
              : dashboardStats.atsScore !== null
                ? `${dashboardStats.atsScore}%`
                : "--"
          }
          subtitle={
            statsLoading
              ? "Loading your score..."
              : dashboardStats.atsScore !== null
                ? `${dashboardStats.totalAnalyses} analysis completed`
                : "Upload and analyze your resume"
          }
          icon={Target}
        />

        <StatCard
          title="Jobs Matched"
          value={
            statsLoading
              ? "Loading..."
              : dashboardStats.jobMatchScore !== null
                ? `${dashboardStats.jobMatchScore}%`
                : "--"
          }
          subtitle={
            dashboardStats.jobMatchScore !== null
              ? "Latest job match score"
              : "Analyze a job description"
          }
          icon={BriefcaseBusiness}
        />

        <StatCard
          title="Preparation"
          value={`${preparationProgress}%`}
          subtitle="Placement preparation completed"
          icon={TrendingUp}
        />

        <StatCard
          title="Interviews"
          value="0"
          subtitle="Practice interviews"
          icon={BrainCircuit}
        />
      </div>

      {/* Quick Actions */}
      <div className="section-heading">
        <div>
          <h3>Quick Actions</h3>
          <p>Start improving your placement profile.</p>
        </div>
      </div>

      <div className="quick-grid">
        <QuickAction
          icon={FileText}
          title="Build Resume"
          description="Create an ATS-friendly professional resume."
          button="Open Builder"
          onClick={() => setPage("resume-builder")}
        />

        <QuickAction
          icon={ScanSearch}
          title="Analyze Resume"
          description="Check ATS score, skills and missing keywords."
          button="Analyze Resume"
          onClick={() => setPage("ats-analysis")}
        />

        <QuickAction
          icon={BriefcaseBusiness}
          title="Find Jobs"
          description="Compare your resume with job descriptions."
          button="Match Jobs"
          onClick={() => setPage("job-matching")}
        />

        <QuickAction
          icon={BookOpen}
          title="Prepare for Placement"
          description="Follow a personalized placement roadmap."
          button="Start Preparation"
          onClick={() => setPage("placement")}
        />
      </div>

      {/* Placement Progress and Upcoming Tasks */}
      <div className="bottom-grid">

        {/* Placement Progress */}
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Placement Progress</h3>
              <p>Your preparation overview</p>
            </div>
            <TrendingUp size={22} />
          </div>

          {categories.map((category) => {
            const categoryProgress = getCategoryProgress(category);

            return (
              <div className="progress-item" key={category}>
                <div>
                  <span>{category}</span>
                  <strong>{categoryProgress}%</strong>
                </div>

                <div className="progress-bar">
                  <div
                    style={{ width: `${categoryProgress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Upcoming Tasks */}
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Upcoming Tasks</h3>
              <p>Things you can do next</p>
            </div>
            <Clock3 size={22} />
          </div>

          <TaskItem
            title="Upload Resume"
            status="Pending"
            onClick={() => setPage("ats-analysis")}
          />

          <TaskItem
            title="Complete Resume Analysis"
            status="Pending"
            onClick={() => setPage("ats-analysis")}
          />

          <TaskItem
            title="Practice AI Interview"
            status="Pending"
            onClick={() => setPage("ai-interview")}
          />
        </div>

      </div>
    </div>
  );
}



/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={21} />
      </div>

      <div>
        <span>{title}</span>
        <h3>{value}</h3>
        <small>{subtitle}</small>
      </div>
    </div>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon: Icon,
  title,
  description,
  button,
  onClick,
}) {
  return (
    <div className="quick-card">
      <div className="quick-icon">
        <Icon size={24} />
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <button onClick={onClick}>
        {button}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

/* =========================================================
   TASK ITEM
========================================================= */

function TaskItem({ title, status, onClick }) {
  return (
    <button className="task-item" onClick={onClick}>
      <div className="task-left">
        <div className="task-check">
          <CheckCircle2 size={18} />
        </div>

        <span>{title}</span>
      </div>

      <small>{status}</small>
    </button>
  );
}

/* =========================================================
   RESUME BUILDER
========================================================= */


function ResumeBuilder() {
  const initial = {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    role: "Full Stack Developer (MERN)",
    summary: "",
    degree: "",
    college: "",
    year: "",
    cgpa: "",
    languages: "",
    frontend: "",
    backend: "",
    database: "",
    tools: "",
    project1: "",
    project1Tech: "",
    project1Desc: "",
    project2: "",
    project2Tech: "",
    project2Desc: "",
    experience: "",
    experienceDesc: "",
    certifications: "",
    achievements: "",
    resumeLanguages: "English (Professional), Hindi (Native)",
  };

  const [data, setData] = useState(() => {
    try {
      return {
        ...initial,
        ...JSON.parse(localStorage.getItem("resumeBuilderDraft") || "{}"),
      };
    } catch {
      return initial;
    }
  });

  const [step, setStep] = useState(0);
  const [tab, setTab] = useState("preview");
  const [saved, setSaved] = useState(false);

  const steps = [
    { title: "Personal Info", subtitle: "Tell us about yourself", icon: "👤" },
    { title: "Education", subtitle: "Add your academic details", icon: "🎓" },
    { title: "Skills", subtitle: "Showcase your technical skills", icon: "⌘" },
    { title: "Experience / Projects", subtitle: "Highlight your work", icon: "💼" },
    { title: "Additional Information", subtitle: "Certifications and achievements", icon: "★" },
  ];

  const update = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const saveDraft = () => {
    localStorage.setItem("resumeBuilderDraft", JSON.stringify(data));
    setSaved(true);
  };

  const field = (label, name, placeholder, wide = false) => (
    <label key={name} style={{ ...labelStyle, gridColumn: wide ? "1 / -1" : "auto" }}>
      {label}
      <input
        name={name}
        value={data[name]}
        onChange={update}
        placeholder={placeholder}
        style={inputStyle}
      />
    </label>
  );

  const textarea = (label, name, placeholder) => (
    <label key={name} style={{ ...labelStyle, gridColumn: "1 / -1" }}>
      {label}
      <textarea
        name={name}
        value={data[name]}
        onChange={update}
        placeholder={placeholder}
        rows={4}
        style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
      />
    </label>
  );

  const has = (key) => Boolean(data[key]?.trim());

  const section = (title, content) =>
    content ? (
      <div key={title} style={{ marginTop: 17 }}>
        <h4 style={previewHeading}>{title}</h4>
        <div style={{ fontSize: 11, lineHeight: 1.65, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {content}
        </div>
      </div>
    ) : null;

  const project = (name, tech, desc) =>
    has(name) ? (
      <div key={name} style={{ marginBottom: 12 }}>
        <strong>{data[name]}</strong>
        {has(tech) && <p style={mutedStyle}>{data[tech]}</p>}
        {has(desc) && <p style={{ margin: "4px 0" }}>{data[desc]}</p>}
      </div>
    ) : null;

  const downloadPDF = () => {
    const escapeHTML = (value) =>
      String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    const line = (value) => escapeHTML(value).replace(/\n/g, "<br/>");

    const block = (title, content) =>
      content
        ? `<section><h2>${title}</h2>${content}</section>`
        : "";

    const projectHTML = (name, tech, desc) =>
      has(name)
        ? `<p><b>${escapeHTML(data[name])}</b><br/>
          ${has(tech) ? `<span>${escapeHTML(data[tech])}</span><br/>` : ""}
          ${has(desc) ? line(data[desc]) : ""}</p>`
        : "";

    const html = `<!doctype html><html><head><meta charset="UTF-8"/>
      <title>${escapeHTML(data.name || "Resume")}</title>
      <style>
        @page{size:A4;margin:16mm}
        body{font:10pt/1.5 Arial,sans-serif;color:#202b3c}
        header{text-align:center;border-bottom:2px solid #243b63;padding-bottom:12px}
        h1{font-size:23pt;margin:0 0 5px;color:#1e3154}
        h2{font-size:11pt;color:#243b63;border-bottom:1px solid #d5dce7;padding-bottom:4px;margin:15px 0 7px}
        p{margin:4px 0;overflow-wrap:anywhere}
      </style></head><body>
      <header><h1>${escapeHTML(data.name || "Your Name")}</h1>
      <b>${escapeHTML(data.role)}</b>
      <p>${[data.email,data.phone,data.location].filter(Boolean).map(escapeHTML).join(" | ")}</p>
      <p>${[data.linkedin,data.github].filter(Boolean).map(escapeHTML).join(" | ")}</p></header>
      ${block("PROFESSIONAL SUMMARY", has("summary") ? `<p>${line(data.summary)}</p>` : "")}
      ${block("EDUCATION", [data.degree,data.college,data.year,data.cgpa ? "CGPA: "+data.cgpa : ""].filter(Boolean).map(line).join("<br/>"))}
      ${block("TECHNICAL SKILLS", ["Languages: "+data.languages,"Frontend: "+data.frontend,"Backend: "+data.backend,"Database: "+data.database,"Tools: "+data.tools].filter(x=>x.split(": ")[1]?.trim()).map(line).join("<br/>"))}
      ${block("PROJECTS", projectHTML("project1","project1Tech","project1Desc")+projectHTML("project2","project2Tech","project2Desc"))}
      ${block("EXPERIENCE", [data.experience,data.experienceDesc].filter(Boolean).map(line).join("<br/>"))}
      ${block("CERTIFICATIONS", line(data.certifications))}
      ${block("ACHIEVEMENTS", line(data.achievements))}
      ${block("LANGUAGES", line(data.resumeLanguages))}
      <script>window.onload=()=>window.print();<\/script>
      </body></html>`;

    const win = window.open("", "_blank");
    if (!win) {
      alert("Please allow pop-ups to download your resume.");
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
  };

  const stepFields = [
    <div style={formGrid}>
      {field("Full Name *", "name", "Your full name")}
      {field("Email Address *", "email", "you@example.com")}
      {field("Phone Number *", "phone", "+91 XXXXX XXXXX")}
      {field("Location *", "location", "City, State")}
      {field("LinkedIn Profile", "linkedin", "linkedin.com/in/username")}
      {field("GitHub Profile", "github", "github.com/username")}
      {field("Target Job Role", "role", "Full Stack Developer", true)}
      {textarea("Professional Summary", "summary", "Write a concise 3–4 line summary highlighting your skills, projects and career goal.")}
    </div>,

    <div style={formGrid}>
      {field("Degree / Course", "degree", "B.Tech in Computer Science")}
      {field("Graduation Year", "year", "2027")}
      {field("College / University", "college", "College name", true)}
      {field("CGPA / Percentage", "cgpa", "e.g. 7.75")}
    </div>,

    <div style={formGrid}>
      {field("Programming Languages", "languages", "Java, JavaScript", true)}
      {field("Frontend", "frontend", "React.js, HTML, CSS, Tailwind CSS", true)}
      {field("Backend", "backend", "Node.js, Express.js, REST APIs", true)}
      {field("Database", "database", "MongoDB, MySQL", true)}
      {field("Tools", "tools", "Git, GitHub, VS Code, Postman", true)}
    </div>,

    <div style={formGrid}>
      {field("Project 1 Name", "project1", "Project title", true)}
      {field("Technologies", "project1Tech", "React, Node.js, MongoDB", true)}
      {textarea("Project 1 Description", "project1Desc", "Describe features, your contribution and the problem solved.")}
      {field("Project 2 Name", "project2", "Project title", true)}
      {field("Technologies", "project2Tech", "Technologies used", true)}
      {textarea("Project 2 Description", "project2Desc", "Describe the project and its key features.")}
      {field("Internship / Experience", "experience", "Role — Company", true)}
      {textarea("Responsibilities", "experienceDesc", "Describe your work and contributions.")}
    </div>,

    <div style={formGrid}>
      {textarea("Certifications", "certifications", "Certificate — Issuing organization")}
      {textarea("Achievements", "achievements", "Hackathons, awards, coding achievements")}
      {field("Languages Known", "resumeLanguages", "English, Hindi", true)}
    </div>,
  ];

  const preview = (
    <div style={paperStyle}>
      <header style={{ textAlign: "center", borderBottom: "2px solid #263f70", paddingBottom: 13 }}>
        <h2 style={{ fontSize: 23, color: "#172b4d", margin: "0 0 5px" }}>
          {data.name || "Your Name"}
        </h2>
        <strong style={{ fontSize: 12 }}>{data.role || "Your Target Role"}</strong>
        <p style={mutedStyle}>
          {[data.email, data.phone, data.location].filter(Boolean).join("  |  ")}
        </p>
        <p style={mutedStyle}>
          {[data.linkedin, data.github].filter(Boolean).join("  |  ")}
        </p>
      </header>
      {section("Professional Summary", data.summary)}
      {section("Education", [data.degree,data.college,data.year,data.cgpa ? "CGPA: "+data.cgpa : ""].filter(Boolean).join("\n"))}
      {section("Technical Skills", [
        has("languages") ? "Languages: "+data.languages : "",
        has("frontend") ? "Frontend: "+data.frontend : "",
        has("backend") ? "Backend: "+data.backend : "",
        has("database") ? "Database: "+data.database : "",
        has("tools") ? "Tools: "+data.tools : "",
      ].filter(Boolean).join("\n"))}
      {section("Projects", <>{project("project1","project1Tech","project1Desc")}{project("project2","project2Tech","project2Desc")}</>)}
      {section("Experience", [data.experience,data.experienceDesc].filter(Boolean).join("\n"))}
      {section("Certifications", data.certifications)}
      {section("Achievements", data.achievements)}
      {section("Languages", data.resumeLanguages)}
    </div>
  );

  return (
    <div style={{ color: "#1d2939", fontFamily: "Inter, Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 18 }}>
        <div>
          <p style={{ color: "#536de5", fontSize: 11, fontWeight: 800, letterSpacing: 1, margin: "0 0 6px" }}>CAREER STUDIO</p>
          <h1 style={{ margin: "0 0 6px", fontSize: 27 }}>Resume Builder</h1>
          <p style={{ color: "#667085", margin: 0, fontSize: 13 }}>Create a professional, placement-ready resume.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={secondaryButton} onClick={saveDraft}>▣ {saved ? "Draft Saved" : "Save Draft"}</button>
          <button style={mainButton} onClick={downloadPDF}>↓ Download PDF</button>
        </div>
      </div>

      <div style={stepperStyle}>
        {steps.map((item, index) => (
          <button key={item.title} onClick={() => setStep(index)} style={{
            flex: "1 1 100px", minWidth: 0, border: 0, background: "transparent",
            cursor: "pointer", padding: 7, color: index === step ? "#425ee8" : "#667085",
          }}>
            <div style={{
              width: 31, height: 31, borderRadius: "50%", margin: "0 auto 7px",
              display: "grid", placeItems: "center",
              background: index <= step ? "#5369ed" : "#edf0f7",
              color: index <= step ? "#fff" : "#536078", fontWeight: 700,
            }}>{index + 1}</div>
            <div style={{ fontSize: 11, fontWeight: 700 }}>{item.title}</div>
          </button>
        ))}
      </div>

      <div className="resume-builder-columns" style={{
        display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 0.95fr)",
        gap: 16, alignItems: "start",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div style={iconCircle}>{steps[step].icon}</div>
              <div>
                <h3 style={{ margin: 0, fontSize: 17 }}>{step + 1}. {steps[step].title}</h3>
                <p style={{ margin: "5px 0 0", color: "#667085", fontSize: 12 }}>{steps[step].subtitle}</p>
              </div>
            </div>
            {stepFields[step]}
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 22, paddingTop: 15, borderTop: "1px solid #edf0f5" }}>
              <button disabled={step === 0} onClick={() => setStep((s) => s - 1)} style={{ ...secondaryButton, opacity: step === 0 ? 0.5 : 1 }}>← Previous</button>
              <button onClick={() => step < steps.length - 1 ? setStep((s) => s + 1) : downloadPDF()} style={mainButton}>
                {step === steps.length - 1 ? "Download Resume ↓" : "Next: " + steps[step + 1].title + " →"}
              </button>
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle, background: "#f8faff", padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: "0 0 4px", fontSize: 16 }}>Resume Preview</h3>
              <p style={{ margin: 0, color: "#667085", fontSize: 11 }}>Your details update live</p>
            </div>
            <button style={secondaryButton} onClick={() => setTab(tab === "preview" ? "ats" : "preview")}>
              {tab === "preview" ? "◉ Live Preview" : "✦ ATS Tips"}
            </button>
          </div>

          {tab === "preview" ? preview : (
            <div style={{ background: "#fff", border: "1px solid #e4e7ec", borderRadius: 10, padding: 18 }}>
              <h3 style={{ marginTop: 0 }}>ATS-friendly checklist</h3>
              {[
                ["Contact details", ["name", "email", "phone"]],
                ["Professional summary", ["summary"]],
                ["Education", ["degree", "college"]],
                ["Technical skills", ["languages", "frontend", "backend"]],
                ["Projects", ["project1", "project1Desc"]],
              ].map(([title, keys]) => {
                const complete = keys.every(has);
                return <p key={title} style={{ fontSize: 13, color: complete ? "#16803d" : "#667085" }}>
                  {complete ? "✓" : "○"} &nbsp; {title}
                </p>;
              })}
              <p style={{ fontSize: 12, color: "#667085", lineHeight: 1.6 }}>
                These are completion tips, not an actual ATS score. Use relevant keywords from the job description and keep formatting simple.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media(max-width: 950px) {
          .resume-builder-columns { grid-template-columns: minmax(0,1fr) !important; }
        }
        @media(max-width: 560px) {
          .resume-builder-columns label { min-width: 0; }
        }
      `}</style>
    </div>
  );
}

const labelStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 7,
  fontSize: 12,
  fontWeight: 700,
  color: "#344054",
  minWidth: 0,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #dfe4ee",
  borderRadius: 8,
  background: "#fff",
  color: "#1d2939",
  padding: "11px 12px",
  fontSize: 12,
  fontFamily: "inherit",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 14,
};

const cardStyle = {
  background: "#fff",
  border: "1px solid #e6eaf2",
  borderRadius: 12,
  padding: 18,
  minWidth: 0,
  boxShadow: "0 3px 12px rgba(16,24,40,0.025)",
};

const stepperStyle = {
  display: "flex",
  justifyContent: "space-around",
  gap: 5,
  flexWrap: "wrap",
  background: "#fff",
  border: "1px solid #e6eaf2",
  borderRadius: 12,
  padding: "12px 5px",
  marginBottom: 16,
};

const iconCircle = {
  width: 42,
  height: 42,
  borderRadius: 12,
  background: "#eef2ff",
  display: "grid",
  placeItems: "center",
  fontSize: 22,
};

const mainButton = {
  border: 0,
  borderRadius: 8,
  background: "#5369ed",
  color: "#fff",
  padding: "11px 14px",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButton = {
  border: "1px solid #dfe4ee",
  borderRadius: 8,
  background: "#fff",
  color: "#344054",
  padding: "10px 12px",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};

const previewHeading = {
  color: "#243b63",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: 0.7,
  borderBottom: "1px solid #dce2ec",
  paddingBottom: 6,
  margin: "0 0 8px",
};

const mutedStyle = {
  color: "#667085",
  fontSize: 10,
  margin: "5px 0",
};

const paperStyle = {
  background: "#fff",
  border: "1px solid #e4e7ec",
  borderRadius: 5,
  padding: "23px 18px",
  minHeight: 500,
  boxShadow: "0 3px 12px rgba(16,24,40,0.04)",
  color: "#202b3c",
  overflowWrap: "anywhere",
};


/* =========================================================
   ATS ANALYSIS
========================================================= */

function ATSAnalysis() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const analyzeResume = async () => {
    if (!file) {
      setError("Please select a PDF resume first.");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF resume is supported.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const token = localStorage.getItem("screenerToken");

      const formData = new FormData();

      // IMPORTANT:
      // Backend expects upload.single("resume")
      formData.append("resume", file);

      const response = await axios.post(
        `${API_URL}/api/analyze-resume`,
        formData,
        {
          headers: {
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      console.log("ATS API RESPONSE:", response.data);

      if (response.data?.success) {
        setResult(response.data.data);
      } else {
        setError(
          response.data?.error ||
            "Resume analysis failed."
        );
      }
    } catch (err) {
      console.error("ATS ERROR:", err);

      if (err.response) {
        setError(
          err.response.data?.error ||
            err.response.data?.message ||
            "Server error while analyzing resume."
        );
      } else if (err.request) {
        setError(
          "Backend se response nahi aa raha. Check karo server port 5001 par running hai."
        );
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModulePage
      icon={ScanSearch}
      title="ATS Resume Analysis"
      description="Analyze your resume and improve your ATS compatibility."
    >
      {/* Upload Section */}
      <div className="upload-card">
        <div className="upload-icon">
          <Upload size={35} />
        </div>

        <h3>Upload your resume</h3>

        <p>
          Upload your PDF resume to calculate ATS score,
          matched skills and missing keywords.
        </p>

        <label className="file-input">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];

              setError("");
              setResult(null);

              if (!selectedFile) {
                setFile(null);
                return;
              }

              if (selectedFile.type !== "application/pdf") {
                setFile(null);
                setError("Please select a PDF file only.");
                return;
              }

              setFile(selectedFile);
            }}
          />

          <span>
            {file
              ? `Selected: ${file.name}`
              : "Choose PDF Resume"}
          </span>
        </label>

        {file && (
          <p style={{ marginTop: "10px" }}>
            File size: {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        )}

        <button
          className="primary-btn"
          onClick={analyzeResume}
          disabled={loading || !file}
        >
          {loading ? "Analyzing Resume..." : "Analyze Resume"}

          {!loading && <ArrowRight size={18} />}
        </button>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="analysis-result">
          <div style={{ textAlign: "center", padding: "30px" }}>
            <h3>🔍 Analyzing your resume...</h3>

            <p>
              PDF text extract ho raha hai aur ATS
              compatibility calculate ho rahi hai.
            </p>
          </div>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="analysis-result">

          <div className="panel-header">
            <div>
              <h3>Resume Analysis Result</h3>

              <p>
                Target Role:{" "}
                <strong>
                  {result.targetRole ||
                    "Full Stack Developer"}
                </strong>
              </p>
            </div>

            <CheckCircle2
              size={25}
              style={{ color: "#2d9b59" }}
            />
          </div>

          {/* Scores */}
          <div className="analysis-grid">

            {/* ATS Score */}
            <div className="analysis-score">
              <span>ATS Score</span>

              <strong>
                {result.atsScore ?? 0}
              </strong>

              <small>/ 100</small>
            </div>

            {/* Skills */}
            <div className="analysis-box">
              <h4>Matched Skills</h4>

              <div className="tag-container">
                {(result.matchedKeywords || []).map(
                  (skill, index) => (
                    <span
                      className="skill-tag"
                      key={index}
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>

              {(!result.matchedKeywords ||
                result.matchedKeywords.length === 0) && (
                <p>No matched skills detected.</p>
              )}
            </div>

            {/* Missing */}
            <div className="analysis-box">
              <h4>Missing Keywords</h4>

              <div className="tag-container">
                {(result.missingKeywords || []).map(
                  (skill, index) => (
                    <span
                      className="skill-tag missing"
                      key={index}
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Detailed Scores */}
          <div
            className="stats-grid"
            style={{ marginTop: "20px" }}
          >
            <StatCard
              title="Overall Score"
              value={`${result.overallScore ?? 0}`}
              subtitle="/ 100"
              icon={Target}
            />

            <StatCard
              title="Skills Match"
              value={`${result.skillsMatch ?? 0}%`}
              subtitle="Technical alignment"
              icon={Code2}
            />

            <StatCard
              title="Job Match"
              value={`${result.jobMatch ?? 0}%`}
              subtitle="Estimated match"
              icon={BriefcaseBusiness}
            />

            <StatCard
              title="Resume Quality"
              value={`${result.resumeQuality ?? 0}%`}
              subtitle="Content quality"
              icon={TrendingUp}
            />
          </div>

          {/* Strengths / Weaknesses */}
          <div className="bottom-grid">

            <div className="panel">
              <div className="panel-header">
                <div>
                  <h3>Strengths</h3>
                  <p>What your resume does well</p>
                </div>

                <CheckCircle2 size={21} />
              </div>

              {(result.strengths || []).map(
                (item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "10px 0",
                      borderBottom:
                        "1px solid #f0f1f4",
                      fontSize: "12px",
                    }}
                  >
                    ✓ {item}
                  </div>
                )
              )}
            </div>

            <div className="panel">
              <div className="panel-header">
                <div>
                  <h3>Areas to Improve</h3>
                  <p>Recommended improvements</p>
                </div>

                <Target size={21} />
              </div>

              {(result.weaknesses || []).map(
                (item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "10px 0",
                      borderBottom:
                        "1px solid #f0f1f4",
                      fontSize: "12px",
                    }}
                  >
                    • {item}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Recommended Keywords */}
          <div
            className="panel"
            style={{ marginTop: "20px" }}
          >
            <div className="panel-header">
              <div>
                <h3>Recommended Keywords</h3>
                <p>
                  Consider adding these technologies
                </p>
              </div>

              <Sparkles size={21} />
            </div>

            <div className="tag-container">
              {(result.recommendedKeywords || []).map(
                (keyword, index) => (
                  <span
                    className="skill-tag"
                    key={index}
                  >
                    {keyword}
                  </span>
                )
              )}
            </div>
          </div>

          {/* AI Feedback */}
          <div
            className="feedback-box"
            style={{ marginTop: "20px" }}
          >
            <h4>🤖 AI Resume Feedback</h4>

            <p>
              {result.aiRewriteAfter ||
                "Your resume has been analyzed successfully. Follow the recommended improvements to increase your ATS score."}
            </p>
          </div>

        </div>
      )}
    </ModulePage>
  );
}

/* =========================================================
   JOB MATCHING
========================================================= */

function JobMatching() {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeJobMatch = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description first.");
      return;
    }

    const token = localStorage.getItem("screenerToken");

    if (!token) {
      setError("Please log in again.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post(
        `${API_URL}/api/job-match`,
        { jobDescription },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(response.data.data ?? response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Job matching failed. Please check the server."
      );
      console.error("Job matching error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModulePage
      icon={BriefcaseBusiness}
      title="Job Matching"
      description="Compare your resume with a job description."
    >
      <div className="two-column-panel">
        <div className="form-panel">
          <h3>Job Description</h3>
          <textarea
            rows={16}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the complete job description here..."
          />

          <button
            className="primary-btn"
            onClick={analyzeJobMatch}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Job Match"}
            {!loading && <ArrowRight size={18} />}
          </button>

          {error && <p className="error-message">{error}</p>}
        </div>

       
<div className="empty-result job-match-results">
  {!result ? (
    <>
      <BriefcaseBusiness size={35} />
      <h3>Your Match Results</h3>
      <p>Paste a job description and click Analyze Job Match.</p>
    </>
  ) : (
    <div className="match-dashboard">
      <h3>Job Match Results</h3>

      <div className="match-score-card">
        <p>Resume Match Score</p>
        <div className="score-circle">
          <span>{result.matchScore ?? 0}%</span>
        </div>
        <p>
          {result.matchScore >= 75
            ? "Great match! Your profile aligns well with this role."
            : result.matchScore >= 50
            ? "Good start! Improve the missing skills to strengthen your profile."
            : "Keep improving your skills to better match this role."}
        </p>
      </div>

      <div className="match-stats-grid">
        <div className="match-stat-card">
          <h4>Matched Skills</h4>
          <strong>{result.matchedSkills?.length ?? 0}</strong>
        </div>
        <div className="match-stat-card">
          <h4>Missing Skills</h4>
          <strong>{result.missingSkills?.length ?? 0}</strong>
        </div>
      </div>

      <section className="match-section">
        <h4>✅ Matched Skills</h4>
        <div className="skill-tags">
          {result.matchedSkills?.length ? (
            result.matchedSkills.map((skill) => (
              <span className="skill-tag matched" key={skill}>
                {skill}
              </span>
            ))
          ) : (
            <p>No matched skills found.</p>
          )}
        </div>
      </section>

      <section className="match-section">
        <h4>🎯 Skills to Improve</h4>
        <div className="skill-tags">
          {result.missingSkills?.length ? (
            result.missingSkills.map((skill) => (
              <span className="skill-tag missing" key={skill}>
                {skill}
              </span>
            ))
          ) : (
            <p>No missing skills found.</p>
          )}
        </div>
      </section>

      <section className="match-section">
        <h4>Matched Keywords</h4>
        <div className="skill-tags">
          {result.matchedKeywords?.map((keyword) => (
            <span className="skill-tag" key={keyword}>
              {keyword}
            </span>
          ))}
        </div>
      </section>

      <section className="match-section">
        <h4>Missing Keywords</h4>
        <div className="skill-tags">
          {result.missingKeywords?.map((keyword) => (
            <span className="skill-tag missing" key={keyword}>
              {keyword}
            </span>
          ))}
        </div>
      </section>

      <section className="match-section">
        <h4>💡 AI Recommendations</h4>
        <ul className="recommendation-list">
          {result.recommendations?.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      </section>
    </div>
  )}
</div>
      </div>
    </ModulePage>
  );
}
/* =========================================================
   PLACEMENT
========================================================= */


const makeQuestions = (items) =>
  items.map(([question, a, b, c, d, answer, explanation, difficulty = "Medium"]) => ({
    question,
    options: [a, b, c, d],
    answer,
    explanation,
    difficulty
  }));

const placementQuestionBank = {
  dsa: makeQuestions([
    ["Binary search time complexity?", "O(n)", "O(log n)", "O(n²)", "O(1)", 1, "Binary search halves the search space each step.", "Easy"],
    ["Which data structure follows LIFO?", "Queue", "Stack", "Graph", "Heap", 1, "Stack follows Last In, First Out.", "Easy"],
    ["Which BST traversal produces sorted order?", "Preorder", "Postorder", "Inorder", "Level order", 2, "Inorder visits left, root, then right.", "Easy"],
    ["Which structure is used in BFS?", "Stack", "Queue", "Heap", "Hash map", 1, "BFS explores nodes level by level using a queue."],
    ["Which structure is used in iterative DFS?", "Queue", "Stack", "Array only", "Trie", 1, "DFS uses a stack, explicitly or through recursion."],
    ["Average lookup time in a hash table?", "O(n)", "O(log n)", "O(1)", "O(n²)", 2, "Hash tables provide average constant-time lookup.", "Medium"],
    ["Which sorting algorithm is stable in its standard implementation?", "Heap sort", "Merge sort", "Selection sort", "Quick sort", 1, "Merge sort is stable when equal elements retain their order."],
    ["What is the worst-case time complexity of merge sort?", "O(n)", "O(log n)", "O(n log n)", "O(n²)", 2, "Merge sort divides and merges across log n levels."],
    ["Which technique solves overlapping subproblems efficiently?", "Dynamic programming", "Linear search", "Bubble sort", "Binary search", 0, "Dynamic programming stores results of repeated subproblems."],
    ["What does a base case do in recursion?", "Repeats forever", "Stops recursive calls", "Sorts data", "Creates a queue", 1, "A base case prevents recursion from continuing indefinitely."],
    ["Which data structure is commonly used for priority scheduling?", "Stack", "Queue only", "Heap", "Linked list only", 2, "A heap efficiently retrieves the highest- or lowest-priority item."],
    ["What is the time complexity of accessing an array element by index?", "O(n)", "O(log n)", "O(1)", "O(n log n)", 2, "Array index access is constant time."],
    ["Which algorithm finds shortest paths in an unweighted graph?", "BFS", "DFS", "Selection sort", "Binary search", 0, "BFS finds shortest paths by number of edges in an unweighted graph."],
    ["What is the worst-case time complexity of linear search?", "O(1)", "O(log n)", "O(n)", "O(n log n)", 2, "It may inspect every element."],
    ["Which data structure is best suited for undo operations?", "Stack", "Graph", "Heap", "Trie", 0, "Undo commonly reverses the most recent action first.", "Easy"]
  ]),

  javascript: makeQuestions([
    ["Which keyword declares a reassignable block-scoped variable?", "var", "let", "const", "static", 1, "let is block-scoped and allows reassignment.", "Easy"],
    ["What does Array.map() return?", "A new array", "Always a number", "Undefined", "A Promise always", 0, "map returns a new array of transformed elements.", "Easy"],
    ["Which object represents an asynchronous result?", "Set", "Promise", "Symbol", "RegExp", 1, "A Promise represents eventual success or failure.", "Easy"],
    ["What is typeof null in JavaScript?", "null", "undefined", "object", "boolean", 2, "This is a historical JavaScript behavior.", "Medium"],
    ["Which operator checks strict equality?", "=", "==", "===", "!===", 2, "=== compares without type coercion.", "Easy"],
    ["Which array method adds an item to the end?", "pop()", "shift()", "push()", "unshift()", 2, "push appends items to an array.", "Easy"],
    ["What does JSON.parse() do?", "Object to JSON text", "JSON text to a value", "Sorts an object", "Encrypts data", 1, "JSON.parse converts valid JSON text into a JavaScript value."],
    ["Which keyword defines an asynchronous function?", "await", "async", "defer", "promise", 1, "async functions return a Promise.", "Easy"],
    ["What does the spread syntax commonly do with arrays?", "Deletes them", "Expands iterable elements", "Encrypts them", "Makes them immutable", 1, "Spread expands iterable elements into a new array or argument list."],
    ["What is a closure?", "A loop", "A function with access to its lexical scope", "A class constructor only", "A JSON object", 1, "A closure retains access to variables from its lexical environment."],
    ["Which method converts JSON text into an object?", "JSON.stringify()", "JSON.parse()", "Object.freeze()", "Array.from()", 1, "JSON.parse reads JSON text."],
    ["What does Promise.all() do when all promises fulfill?", "Returns their results together", "Returns only the first result", "Cancels all promises", "Runs synchronously", 0, "Promise.all fulfills with an array of results when all inputs fulfill."],
    ["Which array method creates a filtered array?", "filter()", "forEach()", "findIndex()", "splice()", 0, "filter returns elements satisfying a condition."],
    ["What does event bubbling mean?", "Event moves from target toward ancestors", "Event never fires", "CSS animation", "Page reload", 0, "Bubbling propagates an event from the target up through ancestors."],
    ["What is the result of Boolean(0)?", "true", "false", "0", "undefined", 1, "Zero is a falsy value in JavaScript.", "Easy"]
  ]),

  react: makeQuestions([
    ["Which Hook manages component state?", "useRoute", "useState", "useClass", "useStyle", 1, "useState stores state in a function component.", "Easy"],
    ["What is useEffect commonly used for?", "Side effects", "CSS only", "Declaring HTML", "Creating classes", 0, "useEffect synchronizes a component with external systems.", "Easy"],
    ["Why are keys used in rendered lists?", "Encrypt items", "Help identify items between renders", "Style elements", "Create routes", 1, "Keys help React track list item identity."],
    ["What is JSX?", "A database", "A JavaScript syntax extension", "A CSS framework", "A server", 1, "JSX lets developers describe UI using HTML-like syntax in JavaScript.", "Easy"],
    ["How should a child receive data from a parent?", "Props", "Local storage only", "CSS", "SQL", 0, "Props pass data from parent components to children.", "Easy"],
    ["What is a controlled input?", "An input managed through React state", "An input without value", "A database input", "A CSS class", 0, "React state controls the input value."],
    ["What does React Router help with?", "Client-side navigation", "Image compression", "Database indexing", "Sorting arrays", 0, "React Router maps URLs to UI components."],
    ["Why should state not be mutated directly?", "React may not detect the update correctly", "It disables CSS", "It deletes props", "It stops JavaScript", 0, "Use state setters and immutable updates to trigger reliable rendering."],
    ["What does useRef commonly provide?", "A persistent mutable reference", "A new database", "A route", "A CSS file", 0, "useRef retains a value between renders without triggering a render when changed."],
    ["What is the purpose of lifting state up?", "Share state between components", "Move CSS to HTML", "Create a server", "Remove props", 0, "A common parent can own shared state for its children."],
    ["Which prop handles a click in React?", "onclick", "onClick", "clickEvent", "onPressHTML", 1, "React event props use camelCase, such as onClick."],
    ["What does conditional rendering mean?", "Render UI based on a condition", "Always render every element", "Compile CSS", "Store passwords", 0, "Conditions determine which UI elements appear."],
    ["What does useMemo help with?", "Memoizing a computed value", "Routing", "Creating APIs", "Replacing all state", 0, "useMemo can cache a calculation between renders."],
    ["What is the virtual DOM?", "A lightweight representation of UI", "A physical server", "A SQL table", "A browser extension", 0, "React uses an in-memory representation to calculate UI updates."],
    ["When should a React list item key be stable?", "Between renders for the same item", "Only during startup", "Never", "Only on mobile", 0, "Stable keys help React preserve the identity of list items."]
  ]),

  node: makeQuestions([
    ["What is Express.js primarily used for?", "Building web servers and APIs", "Styling pages", "Writing SQL only", "Compiling Java", 0, "Express is a web framework for Node.js.", "Easy"],
    ["Which HTTP method is commonly used to create a resource?", "GET", "POST", "HEAD", "OPTIONS", 1, "POST commonly submits data to create a resource.", "Easy"],
    ["What is Express middleware?", "A request/response processing function", "A CSS selector", "A database table", "A browser", 0, "Middleware can process requests and pass control to the next handler."],
    ["Which object contains route parameters in Express?", "req.params", "req.css", "res.params", "app.html", 0, "req.params contains named route parameters."],
    ["What is npm?", "Node package manager", "A database", "A browser", "A CSS preprocessor", 0, "npm manages JavaScript packages and project scripts.", "Easy"],
    ["Which module format uses import/export natively in modern Node projects?", "ES modules", "HTML modules", "CSS modules only", "SQL modules", 0, "ES modules use import and export syntax."],
    ["What does res.json() do in Express?", "Sends a JSON response", "Starts a database", "Reads CSS", "Deletes a route", 0, "res.json sends a JSON response to the client."],
    ["What is the purpose of try/catch?", "Handle thrown errors", "Style forms", "Create routes", "Encrypt every request", 0, "try/catch allows handling exceptions."],
    ["Which status code commonly indicates successful resource creation?", "200", "201", "404", "500", 1, "201 Created indicates successful resource creation.", "Easy"],
    ["What does REST describe?", "An architectural style for APIs", "A database language", "A UI library", "A compiler", 0, "REST is an architectural style for networked applications."],
    ["What is environment configuration commonly used for?", "Store deployment-specific settings", "Replace JavaScript", "Render buttons", "Sort arrays", 0, "Environment variables hold configuration such as ports and secret references."],
    ["What does HTTP 404 mean?", "Not Found", "Created", "Unauthorized", "Server success", 0, "404 indicates that the requested resource was not found.", "Easy"],
    ["What does authentication verify?", "Who the user is", "Only page colors", "Database size", "Network speed", 0, "Authentication verifies identity."],
    ["Why hash passwords before storing them?", "Avoid storing plaintext passwords", "Make them reversible", "Improve CSS", "Remove login", 0, "Use a purpose-built password hashing algorithm rather than storing plaintext."],
    ["What does CORS control?", "Cross-origin browser access to resources", "Database schema", "Sorting order", "Password strength", 0, "CORS lets servers specify which origins may access responses from browsers."]
  ]),

  dbms: makeQuestions([
    ["What is the purpose of a primary key?", "Uniquely identify a row", "Allow duplicate keys", "Encrypt a table", "Sort all data", 0, "A primary key uniquely identifies a row.", "Easy"],
    ["Which SQL command retrieves data?", "SELECT", "UPDATE", "DELETE", "ALTER", 0, "SELECT reads data from tables.", "Easy"],
    ["What does normalization help reduce?", "Data redundancy", "Number of users", "Network speed", "SQL keywords", 0, "Normalization reduces unnecessary duplication and anomalies."],
    ["Which JOIN returns matching rows from both tables?", "INNER JOIN", "CROSS JOIN", "FULL JOIN always", "No JOIN", 0, "INNER JOIN returns rows satisfying the join condition."],
    ["What does ACID stand for in databases?", "Atomicity, Consistency, Isolation, Durability", "Access, Control, Index, Data", "Array, Class, Input, Delete", "None", 0, "ACID describes key transaction properties."],
    ["Which SQL command modifies existing rows?", "UPDATE", "CREATE", "SELECT", "GRANT", 0, "UPDATE changes values in existing rows.", "Easy"],
    ["What is a foreign key?", "A reference to a key in another or the same table", "A password", "A duplicate primary key", "A query result", 0, "Foreign keys enforce relationships between tables."],
    ["What is an index used for?", "Speed up data lookup", "Always remove duplicates", "Replace every table", "Encrypt passwords", 0, "Indexes can improve read performance but add storage and write overhead."],
    ["Which command removes table rows matching a condition?", "DELETE", "CREATE", "GRANT", "COMMIT", 0, "DELETE removes rows matching its WHERE condition.", "Easy"],
    ["What does GROUP BY do?", "Groups rows for aggregate calculations", "Sorts only", "Deletes records", "Creates users", 0, "GROUP BY groups rows sharing values in specified columns."],
    ["Which aggregate function counts rows?", "COUNT()", "TOTALROW()", "SIZE()", "NUMBEROF()", 0, "COUNT counts rows or non-NULL values depending on its argument."],
    ["What does COMMIT do?", "Makes transaction changes permanent", "Always rolls back", "Deletes a table", "Creates an index", 0, "COMMIT completes a transaction."],
    ["Which NoSQL database is commonly document-oriented?", "MongoDB", "SQLite", "PostgreSQL only", "Excel", 0, "MongoDB stores data in BSON documents.", "Easy"],
    ["What is a candidate key?", "A minimal set of attributes uniquely identifying a row", "Any non-unique field", "A backup table", "An index name only", 0, "A candidate key uniquely identifies records and has no unnecessary attribute."],
    ["What does a LEFT JOIN preserve?", "All rows from the left table", "Only unmatched right rows", "No rows", "Only identical table names", 0, "LEFT JOIN includes all left-table rows and matching right-side values."]
  ]),

  os: makeQuestions([
    ["What is a process?", "A program in execution", "A database", "A network cable", "A language", 0, "A process is an executing program.", "Easy"],
    ["Which is a necessary deadlock condition?", "Circular wait", "Compilation", "Inheritance", "Normalization", 0, "Circular wait is one of the four Coffman conditions."],
    ["Which memory is generally fastest?", "Hard disk", "RAM", "CPU registers", "Optical disc", 2, "CPU registers are very fast storage inside the processor.", "Easy"],
    ["What is a thread?", "An execution unit within a process", "A database table", "A network protocol", "A file extension", 0, "Threads execute within a process and can share its resources."],
    ["What is context switching?", "Switching CPU execution between tasks", "Deleting a process", "Formatting a disk", "Compiling CSS", 0, "The operating system saves and restores execution state."],
    ["Which scheduling algorithm uses time slices?", "Round Robin", "FCFS only", "FIFO database", "Binary search", 0, "Round Robin allocates a time quantum to each process.", "Easy"],
    ["What is virtual memory?", "An abstraction that extends usable memory using storage", "CPU registers only", "A network address", "A database index", 0, "Virtual memory provides each process an address space and can use disk-backed pages."],
    ["What is a semaphore used for?", "Synchronization", "Image rendering", "SQL joins", "Sorting arrays", 0, "Semaphores coordinate access to shared resources."],
    ["What is a race condition?", "Outcome depends on timing of concurrent operations", "A CPU benchmark", "A file system", "A sorting algorithm", 0, "Unsynchronized concurrent operations can produce timing-dependent results."],
    ["What is a system call?", "A request for an OS service", "A CSS function", "A database row", "A JavaScript loop", 0, "System calls let programs request services from the operating system."],
    ["What is paging?", "Dividing memory into fixed-size pages and frames", "Sorting processes", "Encrypting files", "Creating threads", 0, "Paging manages memory in fixed-size blocks."],
    ["What can cause starvation?", "A task repeatedly denied needed resources", "Balanced scheduling always", "A successful commit", "A syntax error only", 0, "Starvation occurs when a task cannot obtain resources for a long time."],
    ["Which is a non-preemptive scheduling algorithm?", "FCFS", "Round Robin", "Shortest Remaining Time First", "Preemptive priority", 0, "Traditional FCFS scheduling does not preempt the running process.", "Medium"],
    ["What is a critical section?", "Code accessing shared resources", "A CSS section", "A disk partition", "A compiler flag", 0, "Critical sections need coordination to prevent unsafe concurrent access."],
    ["What is thrashing?", "Excessive paging activity", "Fast CPU execution", "Successful scheduling", "A network handshake", 0, "Thrashing occurs when the system spends excessive time swapping pages."]
  ]),

  cn: makeQuestions([
    ["How many layers are in the OSI model?", "4", "5", "7", "8", 2, "The OSI reference model has seven layers.", "Easy"],
    ["Which protocol provides reliable, ordered delivery?", "TCP", "UDP", "ARP", "ICMP", 0, "TCP provides reliable, ordered byte-stream delivery.", "Easy"],
    ["What is DNS used for?", "Resolve domain names", "Encrypt files", "Create databases", "Compile code", 0, "DNS maps domain names to records such as IP addresses.", "Easy"],
    ["Which protocol is commonly used to transfer web pages securely?", "HTTPS", "FTP only", "Telnet", "ARP", 0, "HTTPS uses HTTP over TLS."],
    ["Which device commonly forwards packets between networks?", "Router", "Keyboard", "Monitor", "Printer", 0, "Routers forward packets between IP networks.", "Easy"],
    ["What is an IP address used for?", "Identifying a network interface logically", "Storing passwords", "Naming variables", "Formatting HTML", 0, "IP addresses support network addressing and routing."],
    ["Which transport protocol is connectionless?", "UDP", "TCP", "TLS", "SSH", 0, "UDP sends datagrams without establishing a connection.", "Easy"],
    ["What is the purpose of DHCP?", "Automatically assign network configuration", "Encrypt websites", "Store database records", "Compile code", 0, "DHCP can assign IP addresses and other network settings."],
    ["Which OSI layer is associated with IP routing?", "Network", "Presentation", "Session", "Application", 0, "The network layer handles logical addressing and routing.", "Medium"],
    ["What does HTTP 500 indicate?", "Internal Server Error", "Not Found", "Created", "Redirect only", 0, "500 indicates a server encountered an unexpected condition."],
    ["What is latency?", "Time delay in communication", "Data capacity only", "Disk size", "CPU core count", 0, "Latency measures delay between an action and its response."],
    ["What does a firewall do?", "Filters network traffic based on rules", "Always increases bandwidth", "Writes source code", "Stores HTML", 0, "Firewalls allow or block traffic according to security rules."],
    ["Which protocol securely supports remote shell access?", "SSH", "Telnet", "HTTP", "POP3", 0, "SSH provides encrypted remote access.", "Easy"],
    ["What is a MAC address associated with?", "A network interface's link-layer identity", "A website title", "A database query", "A CPU instruction", 0, "MAC addresses identify interfaces at the link layer."],
    ["Which protocol translates IP addresses to MAC addresses in IPv4 LANs?", "ARP", "DNS", "HTTP", "SMTP", 0, "ARP resolves IPv4 addresses to link-layer addresses on a local network."]
  ]),

  hr: makeQuestions([
    ["How should you answer 'Tell me about yourself'?", "Share a concise professional introduction", "Tell your whole life story", "Discuss salary first", "Only mention hobbies", 0, "Connect your education, skills, projects and goals to the role.", "Easy"],
    ["How should you explain a project?", "Problem, solution, technologies and contribution", "Only read its title", "Avoid your role", "Only describe colors", 0, "Explain the problem, your decisions, your contribution and the outcome."],
    ["What should you do if you do not know an answer?", "Be honest and explain your understanding", "Invent facts", "Remain silent", "Change topic immediately", 0, "Honesty and structured reasoning are better than bluffing.", "Easy"],
    ["What is a good way to describe a weakness?", "Share a real weakness and how you are improving", "Say you have none", "Blame others", "Avoid all examples", 0, "Show self-awareness and practical improvement."],
    ["How should you handle a disagreement in a team?", "Listen, discuss evidence and seek a solution", "Ignore everyone", "Escalate immediately", "Refuse to communicate", 0, "Professional disagreement focuses on facts and shared goals."],
    ["What makes a resume bullet stronger?", "Action, contribution and measurable result when available", "Long unrelated paragraphs", "Only adjectives", "Unverified claims", 0, "Specific, truthful evidence communicates impact."],
    ["What should you do before an interview?", "Research the role and company", "Avoid reviewing projects", "Arrive unprepared", "Memorize fabricated answers", 0, "Research helps you connect your skills to the job.", "Easy"],
    ["How should you respond to constructive feedback?", "Listen and identify an improvement action", "Argue automatically", "Ignore it", "Blame the reviewer", 0, "Consider feedback and decide on concrete next steps."],
    ["What is STAR in behavioral interviews?", "Situation, Task, Action, Result", "Skill, Time, Answer, Review", "Start, Test, Apply, Repeat", "None", 0, "STAR structures behavioral examples clearly.", "Easy"],
    ["How can you show ownership of a project?", "Explain your decisions and specific contributions", "Claim teammates' work", "Avoid technical details", "Only show a logo", 0, "Be clear about what you personally implemented."],
    ["What is a professional way to discuss a missed deadline?", "Explain facts, corrective action and prevention", "Hide the issue", "Blame a teammate without evidence", "Invent a reason", 0, "Accountability includes transparent communication and learning."],
    ["What should you do when asked about salary expectations?", "Give a researched, reasonable range when appropriate", "Insult the company", "Make an unrelated demand", "Refuse every discussion", 0, "Research the role and market, and communicate professionally."],
    ["What is a good question to ask an interviewer?", "What would success look like in this role?", "Can I skip all work?", "Do you dislike the team?", "Can I leave immediately?", 0, "Ask about responsibilities, team, learning and success measures."],
    ["How should you describe a team achievement?", "Explain the team's result and your contribution", "Claim all credit", "Hide collaboration", "Give no details", 0, "Be specific about your role while recognizing the team."],
    ["What is the best interview follow-up?", "Send a brief, polite thank-you if appropriate", "Send repeated messages", "Demand an immediate offer", "Share confidential details", 0, "A concise professional message can reinforce your interest."]
  ]),

  aptitude: makeQuestions([
    ["What is 25% of 240?", "40", "50", "60", "80", 2, "25% is one quarter; 240 ÷ 4 = 60.", "Easy"],
    ["A product costs ₹800 and has a 10% discount. What is the sale price?", "₹700", "₹720", "₹740", "₹780", 1, "10% of 800 is 80; 800 − 80 = ₹720.", "Easy"],
    ["Find the average of 10, 20 and 30.", "15", "20", "25", "30", 1, "Average = (10 + 20 + 30) ÷ 3 = 20.", "Easy"],
    ["A car travels 150 km in 3 hours. What is its average speed?", "30 km/h", "40 km/h", "50 km/h", "60 km/h", 2, "Speed = distance ÷ time = 150 ÷ 3 = 50 km/h.", "Easy"],
    ["The ratio of two numbers is 2:3 and their sum is 25. What is the smaller number?", "5", "10", "15", "20", 1, "Five total parts equal 25, so one part is 5; smaller number = 10.", "Medium"],
    ["Find the next number: 2, 4, 8, 16, __.", "18", "24", "30", "32", 3, "Each term is multiplied by 2.", "Easy"],
    ["If x + 7 = 19, what is x?", "10", "11", "12", "13", 2, "Subtract 7 from both sides: x = 12.", "Easy"],
    ["A can complete a task in 6 days. What fraction of the task does A complete in one day?", "1/3", "1/4", "1/5", "1/6", 3, "One day's work is the reciprocal of 6 days: 1/6.", "Medium"],
    ["A fair coin is tossed once. What is the probability of heads?", "0", "1/4", "1/2", "1", 2, "One of two equally likely outcomes is heads.", "Easy"],
    ["Which number is the odd one out?", "9", "16", "25", "30", 3, "9, 16 and 25 are perfect squares; 30 is not.", "Easy"],
    ["If CAT is coded as DBU by shifting each letter forward one, DOG becomes:", "EPH", "CNG", "FQI", "EOG", 0, "D→E, O→P, G→H; the result is EPH.", "Easy"],
    ["A person faces north, turns right, then turns right again. Which direction are they facing?", "North", "South", "East", "West", 1, "North → East → South.", "Easy"],
    ["Choose the synonym of 'Rapid'.", "Slow", "Quick", "Weak", "Quiet", 1, "Rapid means fast or quick.", "Easy"],
    ["Choose the grammatically correct sentence.", "She go to college.", "She going college.", "She goes to college.", "She gone college.", 2, "With third-person singular 'she', the simple present uses 'goes'.", "Easy"],
    ["A bag has 3 red and 2 blue balls. What is the probability of drawing a blue ball at random?", "1/5", "2/5", "3/5", "1/2", 1, "There are 2 blue balls among 5 total balls, so probability = 2/5.", "Medium"]
  ])
};


function PlacementPreparation() {
  const topics = [
    { id: "dsa", title: "Data Structures & Algorithms", icon: "💻", description: "Arrays, Strings, Trees, Graphs and problem solving" },
    { id: "javascript", title: "JavaScript", icon: "🟨", description: "Core JavaScript, ES6 and asynchronous programming" },
    { id: "react", title: "React.js", icon: "⚛️", description: "Components, Hooks, State and API integration" },
    { id: "node", title: "Node.js & Express", icon: "🟢", description: "Backend, REST APIs and middleware" },
    { id: "dbms", title: "DBMS & SQL", icon: "🗄️", description: "SQL, keys, normalization and databases" },
    { id: "os", title: "Operating Systems", icon: "🖥️", description: "Processes, memory, scheduling and deadlocks" },
    { id: "cn", title: "Computer Networks", icon: "🌐", description: "OSI, TCP/IP, DNS and protocols" },
    { id: "hr", title: "HR & Interview Preparation", icon: "🎯", description: "Communication and interview scenarios" },
    { id: "aptitude", title: "Aptitude & Logical Reasoning",icon: "🧠",description: "Quantitative aptitude, reasoning, series and verbal ability"  },

  ];

  const [activeTopic, setActiveTopic] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionAnswers, setSessionAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  const [stats, setStats] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("placementQuizStats") || "{}");
    } catch {
      return {};
    }
  });

  const currentQuestions = activeTopic
    ? placementQuestionBank[activeTopic] || []
    : [];

  const currentQuestion = currentQuestions[questionIndex];
  
useEffect(() => {
  if (!activeTopic || !currentQuestion || submitted) return;

  setTimeLeft(60);

  const timer = setInterval(() => {
    setTimeLeft((previous) => {
      if (previous <= 1) {
        clearInterval(timer);
        setSubmitted(true);
        setSessionAnswers((value) => value + 1);

        setStats((oldStats) => {
          const old = oldStats[activeTopic] || {
            answered: 0,
            correct: 0
          };

          const updated = {
            ...oldStats,
            [activeTopic]: {
              answered: old.answered + 1,
              correct: old.correct
            }
          };

          localStorage.setItem(
            "placementQuizStats",
            JSON.stringify(updated)
          );

          return updated;
        });

        return 0;
      }

      return previous - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [activeTopic, questionIndex, submitted]);


  const answeredCount = Object.values(stats).reduce(
    (sum, topic) => sum + (topic.answered || 0),
    0
  );

  const correctCount = Object.values(stats).reduce(
    (sum, topic) => sum + (topic.correct || 0),
    0
  );

  const accuracy = answeredCount
    ? Math.round((correctCount / answeredCount) * 100)
    : 0;

  const startQuiz = (topicId) => {
    setTimeLeft(60);
    setActiveTopic(topicId);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setSubmitted(false);
    setSessionScore(0);
    setSessionAnswers(0);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || submitted || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.answer;

    setSubmitted(true);
    setSessionAnswers((value) => value + 1);

    if (isCorrect) {
      setSessionScore((value) => value + 1);
    }

    setStats((previous) => {
      const old = previous[activeTopic] || { answered: 0, correct: 0 };

      const updated = {
        ...previous,
        [activeTopic]: {
          answered: old.answered + 1,
          correct: old.correct + (isCorrect ? 1 : 0)
        }
      };

      localStorage.setItem("placementQuizStats", JSON.stringify(updated));
      return updated;
    });
  };

  const nextQuestion = () => {
    setQuestionIndex ((value) => value + 1);
    setSelectedAnswer(null);
    setSubmitted(false);
    setTimeLeft(60);
  };

  const closeQuiz = () => {
    setActiveTopic(null);
    setSelectedAnswer(null);
    setSubmitted(false);
  };

  return (
    <ModulePage
      icon={BookOpen}
      title="Placement Preparation"
      description="Practice interview questions, test your knowledge and track your progress."
    >
      {!activeTopic ? (
        <>
          <div className="placement-overview">
            <div className="placement-overview-text">
              <span className="placement-eyebrow">PLACEMENT LEARNING CENTER</span>
              <h2>Your next opportunity starts here 🚀</h2>
              <p>Practice topic-wise questions and prepare with confidence.</p>
            </div>
            <div className="placement-progress-circle">
              <strong>{accuracy}%</strong>
              <span>Accuracy</span>
            </div>
          </div>

          <div className="placement-stats">
            <div className="placement-stat-card">
              <span>Learning Tracks</span>
              <strong>{topics.length}</strong>
            </div>
            <div className="placement-stat-card">
              <span>Questions Attempted</span>
              <strong>{answeredCount}</strong>
            </div>
            <div className="placement-stat-card">
              <span>Correct Answers</span>
              <strong>{correctCount}</strong>
            </div>
          </div>

          <div className="placement-topic-list">
            {topics.map((topic) => {
              const topicStats = stats[topic.id] || { answered: 0, correct: 0 };
              const topicAccuracy = topicStats.answered
                ? Math.round((topicStats.correct / topicStats.answered) * 100)
                : 0;

              return (
                <div className="placement-topic-card" key={topic.id}>
                  <div className="placement-topic-header">
                    <div className="placement-topic-icon">{topic.icon}</div>
                    <div className="placement-topic-info">
                      <h3>{topic.title}</h3>
                      <p>{topic.description}</p>
                      <div className="placement-topic-progress">
                        <div>
                          <span
                            style={{
                             width: `${Math.min(topicStats.answered / 15, 1) * 100}%`
                            }}
                          />
                        </div>
                        <small>
                          {topicStats.answered}/15 questions attempted · {topicAccuracy}% accuracy
                        </small>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="placement-start-btn"
                    onClick={() => startQuiz(topic.id)}
                  >
                    Start Practice →
                  </button>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="quiz-workspace">
          <div className="quiz-topbar">
            <button className="quiz-back-btn" onClick={closeQuiz} type="button">
              ← All Topics
            </button>
            <span>
              Question {Math.min(questionIndex + 1, currentQuestions.length)} of {currentQuestions.length}
            </span>
          </div>

          {questionIndex >= currentQuestions.length ? (
            <div className="quiz-result">
              <div className="quiz-result-icon">🏆</div>
              <span className="placement-eyebrow">PRACTICE COMPLETED</span>
              <h2>Great work!</h2>
              <p>You have completed this practice set.</p>
              <div className="quiz-final-score">
                <strong>{sessionScore}/{currentQuestions.length}</strong>
                <span>Correct in this session</span>
              </div>
              <button className="placement-start-btn" onClick={closeQuiz} type="button">
                Back to Learning Tracks
              </button>
            </div>
          ) : currentQuestion ? (
            <>
              <div className="quiz-progress-track">
                <div
                  style={{
                    width: `${((questionIndex + (submitted ? 1 : 0)) / currentQuestions.length) * 100}%`
                  }}
                />
              </div>

              <div className="quiz-question-card">
                <div className="quiz-question-meta">
                  
            <div className={`quiz-timer ${timeLeft <= 10 ? "urgent" : ""}`}>
          <span>⏱️</span>
          <strong>
           {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
             {String(timeLeft % 60).padStart(2, "0")}
          </strong>
             <span>remaining</span>
               </div>

                  <span>{topics.find((topic) => topic.id === activeTopic)?.title}</span>
                  <span className="quiz-difficulty">{currentQuestion.difficulty}</span>
                </div>

                <h2>{currentQuestion.question}</h2>
                <p className="quiz-instruction">Choose the best answer below.</p>

                <div className="quiz-options">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrectOption = currentQuestion.answer === index;

                    let optionClass = "";
                    if (submitted && isCorrectOption) optionClass = "correct";
                    else if (submitted && isSelected) optionClass = "incorrect";
                    else if (isSelected) optionClass = "selected";

                    return (
                      <button
                        key={option}
                        type="button"
                        className={`quiz-option ${optionClass}`}
                        onClick={() => !submitted && setSelectedAnswer(index)}
                        disabled={submitted}
                      >
                        <span className="quiz-option-letter">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span>{option}</span>
                        {submitted && isCorrectOption && <span>✓</span>}
                        {submitted && isSelected && !isCorrectOption && <span>✕</span>}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className={`quiz-explanation ${selectedAnswer === currentQuestion.answer ? "success" : "error"}`}>
                    <strong>
                      {selectedAnswer === currentQuestion.answer
                        ? "Correct answer!"
                        : "Not quite. Review the explanation:"}
                    </strong>
                    <p>{currentQuestion.explanation}</p>
                  </div>
                )}

                <div className="quiz-footer">
                  <span>
                    {submitted
                      ? "Answer submitted"
                      : "Take your time before submitting"}
                  </span>

                  {!submitted ? (
                    <button
                      type="button"
                      className="placement-start-btn"
                      disabled={selectedAnswer === null}
                      onClick={submitAnswer}
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="placement-start-btn"
                      onClick={nextQuestion}
                    >
                      {questionIndex === currentQuestions.length - 1
                        ? "View Results"
                        : "Next Question →"}
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}
    </ModulePage>
  );
}


/* =========================================================
   AI INTERVIEW
========================================================= */

function AIInterview() {
  const [type, setType] = useState("HR");
  const [role, setRole] = useState("Full Stack Developer");
  const [interviewId, setInterviewId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const token = localStorage.getItem("screenerToken");
  const [questions, setQuestions] = useState([]);
const [questionIndex, setQuestionIndex] = useState(0);

  async function startInterview() {
    if (!token) {
      setError("Please login again to start your interview.");
      return;
    }

    setLoading(true);
    setError("");
    setEvaluation(null);
    setAnswer("");
    setQuestion("");
    setInterviewId("");
    setQuestionCount(0);
    setTotalScore(0);
    setFinished(false);

    try {
      const response = await fetch(`${API_URL}/api/interview/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, role }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not start interview.");
      }

      
setQuestions(result.data.questions);
setQuestionIndex(0);
setQuestion(result.data.questions[0].question);
setInterviewId(result.data.interviewId);
setQuestionCount(1);

    } catch (err) {
      setError(err.message || "Failed to start interview.");
    } finally {
      setLoading(false);
    }
  }

  async function submitAnswer() {
    if (!answer.trim()) {
      setError("Please type your answer first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/interview/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      
        body: JSON.stringify({
         interviewId,
        questionIndex,
         question,
         answer,
         role,
      }),

      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not evaluate your answer.");
      }

      const data = result.data;
      setEvaluation(data);
      setTotalScore((previous) => previous + (Number(data.score) || 0));
    } catch (err) {
      setError(err.message || "Answer evaluation failed.");
    } finally {
      setLoading(false);
    }
  }
  
function nextInterviewQuestion() {
  const nextIndex = questionIndex + 1;

  if (nextIndex >= questions.length) {
    setFinished(true);
    return;
  }

  setQuestionIndex(nextIndex);
  setQuestion(questions[nextIndex].question);
  setAnswer("");
  setEvaluation(null);
  setError("");
  setQuestionCount(nextIndex + 1);
}

function endInterview() {
  setFinished(true);
}


  function endInterview() {
    setFinished(true);
  }

  return (
    <ModulePage
      icon={BrainCircuit}
      title="AI Interview"
      description="Practice HR, technical and project interviews with AI feedback."
    >
      {!question && !finished && (
        <div className="interview-setup">
          <h2>Prepare for your interview</h2>
          <p>Choose an interview type and your target role.</p>

          <label>Interview Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="HR">HR Interview</option>
            <option value="Technical">Technical Interview</option>
            <option value="Project">Project Interview</option>
          </select>

          <label>Target Role</label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Full Stack Developer"
          />

          {error && <p className="interview-error">{error}</p>}

          <button
            className="primary-btn"
            onClick={startInterview}
            disabled={loading || !role.trim()}
          >
            {loading ? "Generating Question..." : "Start Interview"}
            {!loading && <ArrowRight size={17} />}
          </button>
        </div>
      )}

      {question && !finished && (
        <div className="interview-session">
          <div className="interview-session-header">
            <div>
              <span className="interview-tag">{type} Interview</span>
              <h2>Question {questionCount} of 20</h2>
            </div>
            <span className="interview-progress">
              {Math.round((questionCount / 20) * 100)}%
            </span>
          </div>

          <div className="interview-progress-track">
            <div style={{ width: `${(questionCount / 20) * 100}%` }} />
          </div>

          <div className="interview-question">
            <h3>{question}</h3>
          </div>

          {!evaluation ? (
            <>
              <label htmlFor="interview-answer">Your Answer</label>
              <textarea
                id="interview-answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={7}
              />

              {error && <p className="interview-error">{error}</p>}

              <button
                className="primary-btn"
                onClick={submitAnswer}
                disabled={loading || !answer.trim()}
              >
                {loading ? "Evaluating Answer..." : "Submit Answer"}
              </button>
            </>
          ) : (
            <div className="interview-feedback">
              <h3>
                AI Evaluation: {evaluation.score ?? 0}/10
              </h3>

              <p>{evaluation.feedback}</p>

              <h4>Strengths</h4>
              {evaluation.strengths?.length ? (
                <ul>
                  {evaluation.strengths.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : <p>Keep practising to improve your answer.</p>}

              <h4>Areas to Improve</h4>
              {evaluation.improvements?.length ? (
                <ul>
                  {evaluation.improvements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : <p>Try to make your answer clearer and more specific.</p>}

              {questionCount < 20 ? (
                <button
                  className="primary-btn"
                  onClick={nextInterviewQuestion}
                  disabled={loading}
                >
                  Next Question <ArrowRight size={17} />
                </button>
              ) : (
                <button className="primary-btn" onClick={endInterview}>
                  View Final Report
                </button>
              )}

              <button
                className="interview-secondary-btn"
                onClick={endInterview}
              >
                End Interview
              </button>
            </div>
          )}
        </div>
      )}

      {finished && (
        <div className="interview-result">
          <h2>Interview Completed!</h2>
          <p>
            Questions attempted: {questionCount}
          </p>
          <p>
            Total score: {totalScore} / {questionCount * 10}
          </p>
          <p>
            Average score:{" "}
            {questionCount
              ? (totalScore / questionCount).toFixed(1)
              : "0"} / 10
          </p>

          <button
            className="primary-btn"
            onClick={() => {
              setQuestion("");
              setEvaluation(null);
              setAnswer("");
              setInterviewId("");
              setQuestionCount(0);
              setTotalScore(0);
              setFinished(false);
              setError("");
            }}
          >
            Start New Interview
          </button>
        </div>
      )}
    </ModulePage>
  );
}

/* =========================================================
   CODING INTERVIEW
========================================================= */

const codingQuestions = [
  
{
  title: "Two Sum",
  difficulty: "Easy",

  description: `Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.

You may assume that each input has exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Your Task:
Implement a solution that finds the indices of the two elements whose sum equals target.`,

  example: `Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9.

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]
Explanation: nums[1] + nums[2] = 2 + 4 = 6.

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]
Explanation: Both elements are 3, and their sum is 6.`,

  constraints: [
    "2 <= nums.length <= 10⁴",
    "-10⁹ <= nums[i] <= 10⁹",
    "-10⁹ <= target <= 10⁹",
    "Only one valid answer exists.",
    "The same element cannot be used twice."
  ],

  java: `import java.util.*;

class Main {
    public static void main(String[] args) {
        // Write your solution here
    }
}`,

  javascript: `// Write your solution here`
  },
  {
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    description: "Given an array prices where prices[i] is the price of a stock on day i, find the maximum profit you can achieve by buying once and selling later. Return 0 if no profit is possible.",
    example: "Input: prices = [7,1,5,3,6,4]\nOutput: 5",
    constraints: [
  "1 <= prices.length <= 10⁵",
  "0 <= prices[i] <= 10⁴",
  "You must buy before you sell.",
  "You can complete at most one transaction."
],
    java: `class Main {
    public static void main(String[] args) {
        int[] prices = {7, 1, 5, 3, 6, 4};
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;

        for (int price : prices) {
            minPrice = Math.min(minPrice, price);
            maxProfit = Math.max(maxProfit, price - minPrice);
        }

        System.out.println(maxProfit);
    }
}`,
    javascript: `const prices = [7, 1, 5, 3, 6, 4];
let minPrice = Infinity;
let maxProfit = 0;

for (const price of prices) {
  minPrice = Math.min(minPrice, price);
  maxProfit = Math.max(maxProfit, price - minPrice);
}

console.log(maxProfit);`
  },
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: "Given a string containing (), {}, and [], determine whether the brackets are properly opened and closed in the correct order.",
    example: 'Input: s = "()[]{}"\nOutput: true',
    constraints: [
  "1 <= s.length <= 10⁴",
  "s consists only of the characters '(', ')', '{', '}', '[' and ']'.",
  "Every opening bracket must be closed by the same type of bracket.",
  "Brackets must be closed in the correct order."
],
    java: `import java.util.*;

class Main {
    public static void main(String[] args) {
        String s = "()[]{}";
        Stack<Character> stack = new Stack<>();

        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) {
                    System.out.println(false);
                    return;
                }
                char top = stack.pop();
                if ((c == ')' && top != '(') ||
                    (c == ']' && top != '[') ||
                    (c == '}' && top != '{')) {
                    System.out.println(false);
                    return;
                }
            }
        }

        System.out.println(stack.isEmpty());
    }
}`,
    javascript: `const s = "()[]{}";
const stack = [];
const pairs = { ")": "(", "]": "[", "}": "{" };
let valid = true;

for (const c of s) {
  if ("([{".includes(c)) {
    stack.push(c);
  } else if (stack.pop() !== pairs[c]) {
    valid = false;
    break;
  }
}

console.log(valid && stack.length === 0);`
  },
  {
    title: "Missing Number",
    difficulty: "Easy",
    description: "An array contains distinct numbers from 0 to n with one number missing. Find the missing number.",
    example: "Input: nums = [3,0,1]\nOutput: 2",
    constraints: [
  "n == nums.length",
  "1 <= n <= 10⁴",
  "0 <= nums[i] <= n",
  "All numbers in nums are unique.",
  "Exactly one number in the range [0, n] is missing."
],
    java: `class Main {
    public static void main(String[] args) {
        int[] nums = {3, 0, 1};
        int n = nums.length;
        int missing = n * (n + 1) / 2;

        for (int num : nums) {
            missing -= num;
        }

        System.out.println(missing);
    }
}`,
    javascript: `const nums = [3, 0, 1];
const n = nums.length;
let missing = n * (n + 1) / 2;

for (const num of nums) {
  missing -= num;
}

console.log(missing);`
  },
  {
    title: "Move Zeroes",
    difficulty: "Easy",
    description: "Move all zeroes to the end of the array while keeping the order of non-zero elements unchanged.",
    example: "Input: nums = [0,1,0,3,12]\nOutput: [1,3,12,0,0]",
    constraints: [
  "1 <= nums.length <= 10⁴",
  "-2³¹ <= nums[i] <= 2³¹ - 1",
  "Move all zeroes to the end of the array.",
  "Maintain the relative order of non-zero elements.",
  "Modify the array in-place."
],
    java: `import java.util.*;

class Main {
    public static void main(String[] args) {
        int[] nums = {0, 1, 0, 3, 12};
        int index = 0;

        for (int num : nums) {
            if (num != 0) nums[index++] = num;
        }

        while (index < nums.length) nums[index++] = 0;
        System.out.println(Arrays.toString(nums));
    }
}`,
    javascript: `const nums = [0, 1, 0, 3, 12];
let index = 0;

for (const num of nums) {
  if (num !== 0) nums[index++] = num;
}

while (index < nums.length) nums[index++] = 0;
console.log(nums);`
  }
];


function CodingInterview() {
  
const [questionIndex, setQuestionIndex] = React.useState(0);
const currentQuestion = codingQuestions[questionIndex];

  const [language, setLanguage] = React.useState("java");
  const [code, setCode] = React.useState(`import java.util.*;

class Main {
    public static void main(String[] args) {

    }
}`);
  const [stdin, setStdin] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [evaluation, setEvaluation] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [evaluating, setEvaluating] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("result");

  const token = localStorage.getItem("screenerToken");

  

const starterCode = {
  java: `import java.util.*;

class Main {
    public static void main(String[] args) {
        // Write your solution here
    }
}`,
  javascript: `function solution() {
  // Write your solution here
}

solution();`
};


  async function runCode() {
    setLoading(true);
    setOutput("Running code...");
    setActiveTab("result");
    setEvaluation(null);

    try {
      const response = await fetch(`${API_URL}/api/coding/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ language, code, stdin }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Execution failed");
      }

const data = result.data;

console.log("Piston response:", result);

const programOutput =
  data.stdout || data.output || data.run?.stdout || "";

const programError =
  data.stderr || data.run?.stderr || "";

setOutput(
  `Status: ${data.status ?? "Unknown"}\n` +
  `Language: ${data.language ?? language} ${data.version ?? ""}\n` +
  `Exit code: ${data.exitCode ?? data.run?.code ?? "Unknown"}\n\n` +
  `Output:\n${programOutput || "(No standard output)"}\n` +
  (programError ? `\nErrors:\n${programError}` : "")
);

    } catch (error) {
      setOutput(`Execution error:\n${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function evaluateCode() {
    setEvaluating(true);
    setEvaluation(null);

    try {
      const response = await fetch(`${API_URL}/api/coding/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          question: `${currentQuestion.title}\n${currentQuestion.description}\n${currentQuestion.example}`,
          code,
          language:
            language === "java"
              ? "Java"
              : language === "javascript"
              ? "JavaScript"
              : "Python",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "AI evaluation failed");
      }

      setEvaluation(result.data);
      setActiveTab("evaluation");
    } catch (error) {
      setEvaluation({ error: error.message });
      setActiveTab("evaluation");
    } finally {
      setEvaluating(false);
    }
  }

  
function changeLanguage(nextLanguage) {
  setLanguage(nextLanguage);
  setCode(starterCode[nextLanguage]);
  setOutput("");
  setEvaluation(null);
  setActiveTab("result");
}

function changeQuestion(nextIndex) {
  if (nextIndex < 0 || nextIndex >= codingQuestions.length) return;

  setQuestionIndex(nextIndex);
  setCode(starterCode[language]);
  setOutput("");
  setEvaluation(null);
  setStdin("");
  setActiveTab("result");
}


  return (
    <ModulePage
      icon={Code2}
      title="AI Coding Interview"
      description="Write, run, and evaluate code with AI feedback."
    >
      <div className="coding-layout">
        <div className="question-panel">
         
<div className="question-progress">
  Question {questionIndex + 1} of {codingQuestions.length}
</div>

<span className="difficulty">{currentQuestion.difficulty}</span>
<h3>{currentQuestion.title}</h3>
<p>{currentQuestion.description}</p>

<h4>Example</h4>
<pre>{currentQuestion.example}</pre>
{currentQuestion.constraints && (
  <>
    <h4>Constraints</h4>
    <ul className="constraints-list">
      {currentQuestion.constraints.map((constraint, index) => (
        <li key={index}>{constraint}</li>
      ))}
    </ul>
  </>
)}

<div className="question-navigation">
  <button
    onClick={() => changeQuestion(questionIndex - 1)}
    disabled={questionIndex === 0}
  >
    ← Previous
  </button>

  <button
    onClick={() => changeQuestion(questionIndex + 1)}
    disabled={questionIndex === codingQuestions.length - 1}
  >
    Next Question →
  </button>
</div>

          
        </div>

        <div className="code-panel">
          <div className="code-header">
            <Code2 size={18} />
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
            >
              
<option value="java">Java</option>
<option value="javascript">JavaScript</option>

            </select>
          </div>

          <textarea
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            aria-label="Code editor"
          />

        

<div className="coding-actions">
  <button
    className="run-button"
    onClick={runCode}
    disabled={loading || !code.trim()}
  >
    {loading ? "Running..." : "▶ Run Code"}
  </button>

  <button
    className="evaluate-button"
    onClick={evaluateCode}
    disabled={evaluating || !code.trim()}
  >
    {evaluating ? "Evaluating..." : "✦ Evaluate Code"}
  </button>
</div>

<div className="coding-results">
  <div className="coding-tabs">
    <button
      className={activeTab === "result" ? "coding-tab active" : "coding-tab"}
      onClick={() => setActiveTab("result")}
    >
      <span>▣</span> Execution Output
    </button>

    <button
      className={activeTab === "evaluation" ? "coding-tab active" : "coding-tab"}
      onClick={() => setActiveTab("evaluation")}
    >
      <span>✦</span> AI Code Review
    </button>
  </div>

  {activeTab === "result" && (
    <pre className="execution-output">
      {output || "Your execution output will appear here."}
    </pre>
  )}

  {activeTab === "evaluation" && (
    <div className="execution-output">
      {evaluation ? (
        evaluation.error ? (
          <p className="error-message">{evaluation.error}</p>
        ) : (
          <pre className="feedback-output">
            {typeof evaluation === "string"
              ? evaluation
              : JSON.stringify(evaluation, null, 2)}
          </pre>
        )
      ) : (
        <p>Submit your code for AI-powered feedback and suggestions.</p>
      )}
    </div>
  )}
</div>

          </div>
        </div>
      
    </ModulePage>
  );
}


/* =========================================================
   ADMIN
========================================================= */



function AdminDashboard() {
  const [stats, setStats] = React.useState({
    totalStudents: 0,
    totalResumes: 0,
    totalAnalyses: 0,
    averageATS: 0,
  });

  const [placement, setPlacement] = React.useState({
    students: [],
    placedStudents: 0,
    atRiskStudents: 0,
    placementPercentage: 0,
  });

  const [loading, setLoading] = React.useState(true);
  const [savingId, setSavingId] = React.useState("");
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");

  const loadPlacement = async (token) => {
    const response = await fetch(
      `${API_URL}/api/admin/students`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Could not load student placement data"
      );
    }

    setPlacement(result.data);
  };

  React.useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("screenerToken");

        if (!token) {
          throw new Error("Please log in again.");
        }

        const response = await fetch(
          `${API_URL}/api/admin/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Could not load dashboard statistics"
          );
        }

        setStats(result.data);
        await loadPlacement(token);
      } catch (err) {
        setError(err.message || "Could not load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handlePlacementChange = (studentId, field, value) => {
    setPlacement((previous) => ({
      ...previous,
      students: previous.students.map((student) =>
        student._id === studentId
          ? { ...student, [field]: value }
          : student
      ),
    }));
  };

  const savePlacement = async (student) => {
    setError("");
    setNotice("");

    if (
      student.placementStatus === "Placed" &&
      !student.companyName.trim()
    ) {
      setError("Placed status ke liye company name enter karo.");
      return;
    }

    try {
      setSavingId(student._id);

      const token = localStorage.getItem("screenerToken");

      const response = await fetch(
        `${API_URL}/api/admin/students/${student._id}/placement`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            placementStatus: student.placementStatus,
            companyName: student.companyName,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Could not save placement status"
        );
      }

      await loadPlacement(token);
      setNotice(`${student.name} ka placement status save ho gaya.`);
    } catch (err) {
      setError(err.message || "Could not save placement status");
    } finally {
      setSavingId("");
    }
  };

  return (
    <ModulePage
      icon={Users}
      title="TPO / Admin Dashboard"
      description="Monitor student placement preparation."
    >
      {error && <div className="error-message">{error}</div>}

      {notice && (
        <div
          style={{
            padding: "12px",
            marginBottom: "16px",
            borderRadius: "8px",
            background: "#dcfce7",
            color: "#166534",
          }}
        >
          {notice}
        </div>
      )}

      <div className="admin-stats">
        <StatCard
          title="Total Students"
          value={loading ? "..." : stats.totalStudents}
          subtitle="Registered students"
          icon={Users}
        />

        <StatCard
          title="Total Resumes"
          value={loading ? "..." : stats.totalResumes}
          subtitle="Resumes uploaded"
          icon={FileText}
        />

        <StatCard
          title="Total Analyses"
          value={loading ? "..." : stats.totalAnalyses}
          subtitle="Resume analyses completed"
          icon={TrendingUp}
        />

        <StatCard
          title="Avg ATS Score"
          value={loading ? "..." : `${stats.averageATS}%`}
          subtitle="Average resume score"
          icon={Target}
        />
      </div>

      <div className="admin-stats">
        <StatCard
          title="Placed Students"
          value={loading ? "..." : placement.placedStudents}
          subtitle="Students marked as placed"
          icon={Users}
        />

        <StatCard
          title="Placement Percentage"
          value={
            loading ? "..." : `${placement.placementPercentage}%`
          }
          subtitle="Placed out of registered students"
          icon={TrendingUp}
        />

        <StatCard
          title="At-Risk Students"
          value={loading ? "..." : placement.atRiskStudents}
          subtitle="Placement preparation not started"
          icon={Target}
        />
      </div>

      <div className="panel admin-table">
        <div className="panel-header">
          <div>
            <h3>Student Placement Overview</h3>
            <p>Update and save each student's placement status.</p>
          </div>
        </div>

        {loading ? (
          <p>Loading students...</p>
        ) : placement.students.length === 0 ? (
          <div className="empty-table">
            <Users size={45} />
            <p>No registered students found.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "760px",
              }}
            >
              <thead>
                <tr>
                  {["Student", "Email", "Placement Status", "Company", "Action"].map(
                    (heading) => (
                      <th
                        key={heading}
                        style={{
                          textAlign: "left",
                          padding: "12px",
                        }}
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {placement.students.map((student) => (
                  <tr key={student._id}>
                    <td style={{ padding: "12px" }}>{student.name}</td>

                    <td style={{ padding: "12px" }}>{student.email}</td>

                    <td style={{ padding: "12px" }}>
                      <select
                        value={student.placementStatus}
                        onChange={(event) =>
                          handlePlacementChange(
                            student._id,
                            "placementStatus",
                            event.target.value
                          )
                        }
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Placed">Placed</option>
                      </select>
                    </td>

                    <td style={{ padding: "12px" }}>
                      <input
                        type="text"
                        value={student.companyName}
                        placeholder="Company name"
                        disabled={student.placementStatus !== "Placed"}
                        onChange={(event) =>
                          handlePlacementChange(
                            student._id,
                            "companyName",
                            event.target.value
                          )
                        }
                      />
                    </td>

                    <td style={{ padding: "12px" }}>
                      <button
                        type="button"
                        disabled={savingId === student._id}
                        onClick={() => savePlacement(student)}
                      >
                        {savingId === student._id ? "Saving..." : "Save"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ModulePage>
  );
}


function StudentPlacementStatus() {
  const [placement, setPlacement] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem("screenerToken");

        if (!token) {
          throw new Error("Please log in again.");
        }

        const response = await fetch(
          `${API_URL}/api/student/placement-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Could not load placement status");
        }

        setPlacement(result);
      } catch (err) {
        setError(err.message || "Could not load placement status.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (loading) return <p>Loading placement status...</p>;
  if (error) return <div className="error-message">{error}</div>;
  if (!placement) return null;

  const status = placement.placementStatus || "Not Started";

  return (
    <div className="panel" style={{ padding: "24px", marginBottom: "24px" }}>
      <h2>My Placement Status</h2>

      {status === "Placed" ? (
        <>
          <h3 style={{ color: "#15803d" }}>
            🎉 Congratulations! You are Placed
          </h3>
          <p>
            Company: <strong>{placement.companyName || "Not specified"}</strong>
          </p>
        </>
      ) : status === "In Progress" ? (
        <>
          <h3>Placement In Progress</h3>
          <p>Your placement preparation is in progress.</p>
        </>
      ) : (
        <>
          <h3>Placement Preparation</h3>
          <p>Your placement status has not been started yet.</p>
        </>
      )}
    </div>
  );
}

/* =========================================================
   MODULE PAGE
========================================================= */

function ModulePage({ icon: Icon, title, description, children }) {
  return (
    <div className="module-page">
      <div className="module-header">
        <div className="module-header-icon">
          <Icon size={28} />
        </div>

        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      {children}
    </div>
  );
}

export default App;