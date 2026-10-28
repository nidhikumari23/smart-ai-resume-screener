# Smart AI Resume Screener & Interview Preparation Portal

An AI-powered placement preparation platform designed to help students build professional resumes, analyze their resumes, match job descriptions, and practice interviews.

## Overview

Smart AI Resume Screener is a full-stack web application that brings resume building and placement preparation into one platform. It combines a resume builder, AI-powered resume analysis, job matching, and mock interview evaluation to help candidates prepare for job opportunities.

## Features

- **User Authentication:** Login and signup functionality.
- **AI Resume Analysis:** Analyze resumes and provide resume-related feedback.
- **Resume Builder:** Create a structured resume with a live preview.
- **PDF Export:** Print or save the resume as a PDF.
- **Job Matching:** Compare a resume with a job description and identify relevant skills.
- **AI Mock Interview:** Generate personalized interview questions based on the analyzed resume.
- **Interview Evaluation:** Evaluate submitted answers and generate a performance report.
- **Database Integration:** Store application data using MongoDB.

## Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5 and CSS3
- Axios

### Backend
- Node.js
- Express.js
- REST APIs
- JWT authentication

### Database
- MongoDB
- MongoDB Atlas

### AI Integration
- Google Gemini API

### Development Tools
- Git and GitHub
- Visual Studio Code
- Postman
- npm

## Project Structure

```text
smart-ai-resume-screener/
├── client/             # React frontend
├── server/             # Express backend
├── docs/               # Project documentation
├── uploads/            # Local uploaded files (do not commit private files)
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js and npm
- Git
- A MongoDB database or MongoDB Atlas account
- A Google Gemini API key

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd smart-ai-resume-screener
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory using the environment variable names required by your backend:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
```

Never commit this file or share your API keys publicly.

### 3. Start the Backend

Run the development command configured in `server/package.json`. If the project uses the `dev` script:

```bash
npm run dev
```

The backend is configured to use port `5001` by default.

### 4. Configure the Frontend

Open another terminal:

```bash
cd client
npm install
```

Configure the frontend API base URL to point to the backend. For local development, the API base URL is typically:

```text
http://localhost:5001
```

Use the environment variable name expected by the existing frontend code. Do not expose private API keys in frontend environment variables.

### 5. Start the Frontend

Run the development command configured in `client/package.json`. If the project uses Vite:

```bash
npm run dev
```

Open the local URL printed in the terminal.

## Typical User Workflow

1. Create an account or log in.
2. Upload a resume and run the resume analysis.
3. Build or improve a resume using the Resume Builder.
4. Compare the resume against a job description.
5. Start a mock interview after resume analysis.
6. Answer interview questions and review the generated evaluation report.

## Security Notes

- Keep `.env` files and API keys private.
- Do not commit private resumes, uploaded documents, database exports, or user data.
- Use strong JWT secrets and secure authentication checks.
- Restrict access to resumes, interview sessions, and reports by authenticated user.
- Configure production CORS settings and validate uploaded files.

## Future Enhancements

- Persistent resume drafts and multiple resume templates.
- More detailed ATS and job-description matching analytics.
- Improved interview performance analytics.
- Responsive UI enhancements and accessibility improvements.
- Production deployment and automated testing.

## Author

**Nidhi Kumari**

B.Tech — Computer Science and Engineering

GitHub: Add your GitHub profile URL  
LinkedIn: Add your LinkedIn profile URL

---

*Built as a placement preparation project using the MERN stack and AI integration.*
