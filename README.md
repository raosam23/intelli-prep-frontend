# IntelliPrep — Frontend

AI-powered mock interview platform. Upload your resume and a job description, get a fit score, and go through a full AI-driven interview with real-time feedback, scores, and a hire/no-hire verdict.

> **Note:** This frontend requires the [IntelliPrep backend](https://github.com/raosam23/intelli-prep-backend) to be running. Clone and start the backend first.

---

## Tech Stack

| Layer            | Technology              |
| ---------------- | ----------------------- |
| Framework        | Next.js 16 (App Router) |
| Language         | TypeScript              |
| Styling          | Tailwind CSS v4         |
| UI Components    | shadcn/ui + Radix UI    |
| State Management | Zustand                 |
| HTTP Client      | Axios                   |
| Charts           | Recharts                |
| Notifications    | Sonner                  |

---

## How It Works

1. **Sign up / Log in** — Create an account or log in to access the platform.
2. **Upload a resume** — Upload a PDF resume. The backend extracts structured data from it.
3. **Create a job application** — Enter the job description for the role you are targeting.
4. **Create an interview session** — Link a resume and a job application to start a session.
5. **Start the interview** — Connects to the backend via WebSocket. The LangGraph AI agent:
    - Parses the resume and job description.
    - Generates a **fit score** and **fit breakdown** (how well your profile matches the role).
    - Asks tailored interview questions one at a time.
    - May ask **follow-up questions** if an answer needs more depth.
6. **Get your results** — After all questions are answered, the AI produces:
    - **Technical**, **problem-solving**, and **communication** scores.
    - A **hire verdict** (`HIRE`, `STRONG_HIRE`, `NO_HIRE`, `STRONG_NO_HIRE`, or `NO_DECISION`).
    - A list of **improvement tips**.
7. **Dashboard** — View an overview of all your interview sessions, fit scores, and performance trends across applications.

You can run multiple interview sessions per job application, swap resumes, create new job applications, and repeat the process freely.

---

## Project Structure

```
app/
├── (auth)/
│   ├── login/          # Login page
│   └── register/       # Registration page
├── (dashboard)/
│   ├── dashboard/      # Analytics & overview dashboard
│   ├── resumes/        # Resume management
│   ├── applications/   # Job application management
│   └── interview/      # Interview session UI (WebSocket)
├── layout.tsx
└── page.tsx
store/                  # Zustand stores (auth, resume, application, interview, analytics)
components/             # Shared UI components
lib/                    # Utilities & API client
types/                  # TypeScript type definitions
```

---

## Installation & Running

### Prerequisites

- Node.js 18+
- The IntelliPrep backend running at `http://localhost:8000` (see [intelli-prep-backend](https://github.com/raosam23/intelli-prep-backend))

### 1. Clone the repository

```bash
git clone <repo-url>
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### 4. Start the development server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Command         | Description                 |
| --------------- | --------------------------- |
| `npm run dev`   | Start development server    |
| `npm run build` | Build for production        |
| `npm run start` | Start the production server |
| `npm run lint`  | Run ESLint                  |

---

## Environment Variables Reference

| Variable              | Required | Description                                   |
| --------------------- | -------- | --------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Yes      | Base URL of the IntelliPrep backend REST API  |
| `NEXT_PUBLIC_WS_URL`  | Yes      | Base WebSocket URL of the IntelliPrep backend |
