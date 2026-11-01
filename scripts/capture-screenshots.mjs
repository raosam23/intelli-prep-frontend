/**
 * Capture README screenshots of the real IntelliPrep UI.
 *
 * The production app is unchanged. Browser calls to the REST API and the
 * interview WebSocket are intercepted and answered with a Python / GenAI
 * interview fixture. Shapes match intelli-prep-backend:
 *
 *   POST /api/auth/login
 *   POST /api/auth/register
 *   GET  /api/auth/me
 *   GET  /api/resumes
 *   GET  /api/job-applications
 *   GET  /api/job-applications/{id}
 *   GET  /api/interview-sessions/job-application/{id}
 *   GET  /api/interview-sessions/{id}
 *   GET  /api/analytics/dashboard
 *
 *   WS /api/ws/interview/{session_id}?token=
 *     server -> { type: "fit_score", fit_score, fit_breakdown }
 *     server -> { type: "question", question, question_number, total_questions }
 *     client -> { type: "answer", answer }
 *     server -> { type: "evaluation", final_evaluation }
 *
 * question.order_index is a float (follow-ups use a fractional index).
 * question.question_type is technical | behavioral | managerial | followup.
 * final_evaluation.verdict is strong_hire | hire | no_decision | no_hire | strong_no_hire.
 *
 * Re-run from the repo root (Google Chrome required, port 3000 free):
 *   npm run screenshots
 *
 * The script rebuilds the production app with the public API and WebSocket
 * URLs pointed at localhost:8000, serves it on port 3000, writes PNGs to
 * docs/screenshots/, and stops the server. No Postgres or OpenAI key is used.
 */
import { spawn } from "node:child_process";
import { mkdir, readFile } from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "docs", "screenshots");
const API_ORIGIN = "http://localhost:8000";
const WS_ORIGIN = "ws://localhost:8000";
const PORT = 3000;
const BASE = `http://127.0.0.1:${PORT}`;

const USER = {
    id: "7c2e9a14-1b6d-4f08-9c33-5a8e2d71b0a4",
    name: "Alex Okonkwo",
    email: "alex.okonkwo@example.com",
    created_at: "2026-06-02T15:00:00.000Z",
};

const RESUME_ID = "b4e1c0aa-2f77-4a1e-8d55-0c9b6e31a812";
const GENAI_APP_ID = "c91d0e27-5a44-4b18-9f02-6d8a1c47e093";
const PENDING_SESSION_ID = "d18a6f30-7c52-4e91-a0b4-3f5e9d21c678";

const RESUME = {
    id: RESUME_ID,
    user_id: USER.id,
    file_name: "Alex_Okonkwo_GenAI.pdf",
    parsed_json: {
        name: "Alex Okonkwo",
        title: "Python / GenAI Engineer",
        skills: ["Python", "FastAPI", "LangGraph", "RAG", "pgvector"],
    },
    created_at: "2026-09-02T15:00:00.000Z",
    updated_at: "2026-09-02T15:00:00.000Z",
};

const GENAI_JD =
    "Northwind Labs is hiring a Senior Python / GenAI Engineer to ship production RAG and tool-calling agents on FastAPI. The role owns retrieval quality, LangGraph workflows, and an eval harness for faithfulness and latency.";

const APPLICATIONS = [
    {
        id: "e21b7a40-8d63-4f02-b1c5-4a6f0e32d789",
        user_id: USER.id,
        resume_id: RESUME_ID,
        jd_raw_text:
            "Harbor ML is hiring a platform engineer to keep training and embedding jobs reliable. Python, queues, and boring on-call matter more than model novelty.",
        fit_score: 71,
        fit_breakdown_score: null,
        status: "applied",
        created_at: "2026-09-12T15:00:00.000Z",
        updated_at: "2026-09-12T15:00:00.000Z",
    },
    {
        id: "f32c8b51-9e74-4013-c2d6-5b701f43e890",
        user_id: USER.id,
        resume_id: RESUME_ID,
        jd_raw_text:
            "Lumen is hiring a backend engineer for a payments API. The stack is Python, Postgres, and a long list of edge cases around retries.",
        fit_score: 76,
        fit_breakdown_score: null,
        status: "rejected",
        created_at: "2026-09-28T15:00:00.000Z",
        updated_at: "2026-10-02T15:00:00.000Z",
    },
    {
        id: "a43d9c62-0f85-4124-d3e7-6c812054f901",
        user_id: USER.id,
        resume_id: RESUME_ID,
        jd_raw_text:
            "Kindred is hiring an AI product engineer to prototype assistant features with a designer and ship the ones that survive an eval set.",
        fit_score: 84,
        fit_breakdown_score: null,
        status: "approved",
        created_at: "2026-10-09T15:00:00.000Z",
        updated_at: "2026-10-20T15:00:00.000Z",
    },
    {
        id: GENAI_APP_ID,
        user_id: USER.id,
        resume_id: RESUME_ID,
        jd_raw_text: GENAI_JD,
        fit_score: 86,
        fit_breakdown_score: JSON.stringify({
            technical_skills_match: 91,
            experience_match: 84,
            education_match: 78,
        }),
        status: "interviewing",
        created_at: "2026-10-24T15:00:00.000Z",
        updated_at: "2026-10-28T15:00:00.000Z",
    },
];

const SESSIONS = [
    {
        id: PENDING_SESSION_ID,
        job_application_id: GENAI_APP_ID,
        num_questions: 4,
        difficulty: "senior",
        interview_type: "technical",
        focus_area: "RAG pipelines",
        status: "pending",
        feedback: null,
        created_at: "2026-10-28T15:00:00.000Z",
        updated_at: "2026-10-28T15:00:00.000Z",
    },
    {
        id: "b29e7041-1a63-4235-e4f8-7d9231650a12",
        job_application_id: GENAI_APP_ID,
        num_questions: 5,
        difficulty: "mid",
        interview_type: "mixed",
        focus_area: "System design",
        status: "completed",
        feedback: "Strong retrieval narrative. Quantify the eval set next time.",
        created_at: "2026-10-02T15:00:00.000Z",
        updated_at: "2026-10-02T16:00:00.000Z",
    },
    {
        id: "c30f8152-2b74-4346-f509-8e0342761b23",
        job_application_id: GENAI_APP_ID,
        num_questions: 3,
        difficulty: "junior",
        interview_type: "behavioral",
        focus_area: "Storytelling",
        status: "incomplete",
        feedback: null,
        created_at: "2026-09-14T15:00:00.000Z",
        updated_at: "2026-09-14T15:20:00.000Z",
    },
];

const DASHBOARD = {
    overall_stats: {
        total_applications: 4,
        total_interviews_completed: 3,
        average_fit_score: 79.25,
        average_overall_score: 81.33,
    },
    fit_score_trend: APPLICATIONS.map((application) => ({
        job_application_id: application.id,
        fit_score: application.fit_score,
        created_at: application.created_at,
        status: application.status,
    })),
    interview_performance_trend: [
        {
            session_id: SESSIONS[2].id,
            communication_score: 74,
            technical_score: 78,
            problem_solving_score: 70,
            overall_score: 74,
            created_at: "2026-09-14T16:00:00.000Z",
        },
        {
            session_id: SESSIONS[1].id,
            communication_score: 82,
            technical_score: 85,
            problem_solving_score: 79,
            overall_score: 82,
            created_at: "2026-10-02T16:00:00.000Z",
        },
        {
            session_id: "d41a9263-3c85-4457-a610-9f1453872c34",
            communication_score: 88,
            technical_score: 92,
            problem_solving_score: 84,
            overall_score: 88,
            created_at: "2026-10-26T16:00:00.000Z",
        },
    ],
    application_by_status: {
        applied: 1,
        interviewing: 1,
        approved: 1,
        rejected: 1,
    },
    average_scores: {
        communication_score: 81.33,
        technical_score: 85,
        problem_solving_score: 77.67,
    },
};

const FIT_SCORE = {
    type: "fit_score",
    fit_score: 86,
    fit_breakdown: {
        technical_skills_match: 91,
        experience_match: 84,
        education_match: 78,
    },
};

// order_index matches the backend: whole numbers are planned questions,
// a tenth marks a follow-up of the question before it.
const QUESTIONS = [
    {
        order_index: 1,
        question_type: "technical",
        question_text:
            "How would you design a RAG pipeline for a Python service that answers questions over internal engineering docs?",
    },
    {
        order_index: 1.1,
        question_type: "followup",
        question_text: "Hybrid search just missed a policy that was edited this morning. What do you change first?",
    },
    {
        order_index: 2,
        question_type: "technical",
        question_text: "When should a LangGraph node ask a follow-up instead of moving to the next planned question?",
    },
    {
        order_index: 3,
        question_type: "behavioral",
        question_text: "Tell me about a model change that looked better offline and worse in production.",
    },
    {
        order_index: 4,
        question_type: "technical",
        question_text: "How do you keep a tool-calling agent inside a latency budget?",
    },
];

const ANSWERS = [
    "Chunk by section, embed into pgvector, and retrieve with hybrid search before a grounded answer. A golden set tracks recall and faithfulness so a retriever change cannot ship on vibes.",
    "I would check ingestion lag before touching the embedder. If the policy is not in the index yet, I would tighten the sync job, add a freshness alert, and rerun the same eval set.",
    "Only when the answer is missing a decision or a number the rubric asked for. The node gets one follow-up, so a thin answer cannot stall the interview.",
    "A new embedder won a public benchmark and lost on our tickets. Faithfulness dropped on the nightly set, we rolled it back the same day, and we kept the old index until the gap was explained.",
    "Cap the tool rounds, stream the final answer, and cache retrieval for repeat questions. Latency sits on the same dashboard as faithfulness, with a budget per route.",
];

const EVALUATION = {
    type: "evaluation",
    final_evaluation: {
        communication_score: 86,
        technical_score: 92,
        problem_solving_score: 84,
        overall_score: 88,
        verdict: "hire",
        improvement_tips: [
            "Name the failure mode a metric is for before you quote the number.",
            "For a retrieval miss, check whether the document was indexed before you swap models.",
            "Bound follow-up questions so a thin answer cannot stall the interview.",
        ],
    },
};

const TOTAL_QUESTIONS = 4;

const CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
};

function questionMessage(question, questionNumber) {
    return {
        type: "question",
        question,
        question_number: questionNumber,
        total_questions: TOTAL_QUESTIONS,
    };
}

function json(route, status, body) {
    return route.fulfill({
        status,
        contentType: "application/json",
        headers: CORS,
        body: JSON.stringify(body),
    });
}

async function mockApi(route) {
    const request = route.request();
    const method = request.method();
    const pathName = new URL(request.url()).pathname.replace(/\/+$/, "") || "/";

    if (method === "OPTIONS") {
        return route.fulfill({ status: 204, headers: CORS, body: "" });
    }

    const log = (status) => console.log(`  mock ${method} ${pathName} -> ${status}`);

    if (method === "POST" && pathName === "/api/auth/login") {
        log(200);
        return json(route, 200, { access_token: "mock-access-token", token_type: "bearer" });
    }
    if (method === "POST" && pathName === "/api/auth/register") {
        log(201);
        return json(route, 201, USER);
    }
    if (method === "GET" && pathName === "/api/auth/me") {
        log(200);
        return json(route, 200, USER);
    }
    if (method === "GET" && pathName === "/api/resumes") {
        log(200);
        return json(route, 200, { resumes: [RESUME], total: 1 });
    }
    if (method === "GET" && pathName === "/api/analytics/dashboard") {
        log(200);
        return json(route, 200, DASHBOARD);
    }
    if (method === "GET" && pathName === "/api/job-applications") {
        log(200);
        return json(route, 200, { job_applications: APPLICATIONS, total: APPLICATIONS.length });
    }

    const application = pathName.match(/^\/api\/job-applications\/([^/]+)$/);
    if (application && method === "GET") {
        log(200);
        const found = APPLICATIONS.find((item) => item.id === application[1]) ?? APPLICATIONS[3];
        return json(route, 200, found);
    }

    const sessionsForApp = pathName.match(/^\/api\/interview-sessions\/job-application\/([^/]+)$/);
    if (sessionsForApp && method === "GET") {
        log(200);
        const interview_sessions = SESSIONS.filter((item) => item.job_application_id === sessionsForApp[1]);
        return json(route, 200, { interview_sessions, total: interview_sessions.length });
    }

    const session = pathName.match(/^\/api\/interview-sessions\/([^/]+)$/);
    if (session && method === "GET") {
        log(200);
        const found = SESSIONS.find((item) => item.id === session[1]) ?? SESSIONS[0];
        return json(route, 200, found);
    }

    log(404);
    return json(route, 404, { detail: `No mock for ${method} ${pathName}` });
}

function portInUse(port) {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.once("error", () => resolve(true));
        server.once("listening", () => server.close(() => resolve(false)));
        server.listen(port, "127.0.0.1");
    });
}

const NEXT_BIN = path.join(ROOT, "node_modules", "next", "dist", "bin", "next");

function run(args, extraEnv = {}) {
    return spawn(process.execPath, [NEXT_BIN, ...args], {
        cwd: ROOT,
        detached: true,
        stdio: "inherit",
        env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", ...extraEnv },
    });
}

function stop(child) {
    if (!child || child.killed || child.pid == null) return;
    try {
        process.kill(-child.pid, "SIGTERM");
    } catch {
        child.kill("SIGTERM");
    }
}

async function waitForServer(child) {
    const deadline = Date.now() + 30_000;
    while (Date.now() < deadline) {
        if (child.exitCode != null) {
            throw new Error(`next start exited early (${child.exitCode})`);
        }
        try {
            const response = await fetch(BASE, { redirect: "manual" });
            if (response.status < 500) return;
        } catch {
            // Server still booting.
        }
        await new Promise((resolve) => setTimeout(resolve, 250));
    }
    throw new Error(`Server did not start on ${BASE}`);
}

async function settle(page) {
    await page.evaluate(async () => {
        if (document.fonts?.ready) await document.fonts.ready;
    });
    await page.waitForTimeout(200);
}

async function shoot(page, name) {
    await page.mouse.move(0, 0);
    await page.evaluate(() => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    });
    await settle(page);
    const file = path.join(OUT_DIR, name);
    await page.screenshot({ path: file, animations: "disabled", caret: "hide" });
    const bytes = await readFile(file);
    const width = bytes.readUInt32BE(16);
    const height = bytes.readUInt32BE(20);
    console.log(`  saved ${path.relative(ROOT, file)} (${width}x${height})`);
}

function attachSocketLog(page) {
    page.on("pageerror", (error) => console.error(`  page error: ${error.message}`));
    page.on("console", (message) => {
        if (message.type() === "error") console.error(`  console: ${message.text()}`);
    });
}

function watchInterviewSocket(context) {
    let activeSocket = null;
    const receivedAnswers = [];

    const ready = context.routeWebSocket(/\/api\/ws\/interview\//, (ws) => {
        activeSocket = ws;
        console.log("  ws open");
        ws.onMessage((message) => {
            const text = typeof message === "string" ? message : message.toString();
            const data = JSON.parse(text);
            if (data.type !== "answer") {
                console.log(`  ws <- ${data.type}`);
                return;
            }
            receivedAnswers.push(data.answer);
            const nextIndex = receivedAnswers.length;
            const next =
                nextIndex < QUESTIONS.length
                    ? questionMessage(QUESTIONS[nextIndex], nextIndex + 1)
                    : EVALUATION;
            ws.send(JSON.stringify(next));
            console.log(`  ws -> ${next.type}${next.question ? ` ${next.question.question_type}` : ""}`);
        });
    });

    return {
        ready,
        answers: receivedAnswers,
        send(payload) {
            if (!activeSocket) throw new Error("Interview WebSocket was not connected");
            activeSocket.send(JSON.stringify(payload));
            console.log(`  ws -> ${payload.type}`);
        },
        async waitForOpen() {
            const deadline = Date.now() + 8_000;
            while (!activeSocket) {
                if (Date.now() > deadline) throw new Error("Interview WebSocket was not opened");
                await new Promise((resolve) => setTimeout(resolve, 50));
            }
        },
    };
}

async function sendAnswer(page, text) {
    const box = page.getByPlaceholder("Enter your answer here");
    await box.fill(text);
    await page.getByRole("button", { name: "Send", exact: true }).click();
}

async function capture(browser) {
    const desktop = {
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 2,
        colorScheme: "dark",
        reducedMotion: "reduce",
        locale: "en-US",
        timezoneId: "UTC",
    };

    const anon = await browser.newContext(desktop);
    await anon.route(`${API_ORIGIN}/**`, mockApi);
    const login = await anon.newPage();
    attachSocketLog(login);
    await login.goto(`${BASE}/login`, { waitUntil: "networkidle" });
    await login.getByRole("heading", { name: "Welcome Back" }).waitFor();
    await login.getByText("Login to your Intelliprep").waitFor();
    await shoot(login, "login.png");
    await anon.close();

    const authed = await browser.newContext(desktop);
    await authed.route(`${API_ORIGIN}/**`, mockApi);
    const interviewSocket = watchInterviewSocket(authed);
    await interviewSocket.ready;
    await authed.addCookies([{ name: "token", value: "mock-access-token", url: BASE }]);

    const app = await authed.newPage();
    attachSocketLog(app);

    await app.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
    await app.getByRole("heading", { name: "Dashboard" }).waitFor();
    await app.getByText("79.25").waitFor();
    await app.getByText("Alex Okonkwo").waitFor();
    await app.locator(".recharts-surface").first().waitFor();
    await app.getByText("Interview Performance Trend").waitFor();
    // The status chart starts below a 900px viewport. Hide that block so the
    // frame ends on the performance chart instead of a sliced heading.
    await app.evaluate(() => {
        const heading = [...document.querySelectorAll("h2")].find(
            (element) => element.textContent?.trim() === "Application Status",
        );
        if (heading?.parentElement) heading.parentElement.style.visibility = "hidden";
    });
    await shoot(app, "dashboard.png");

    await app.goto(`${BASE}/applications/${GENAI_APP_ID}`, { waitUntil: "networkidle" });
    await app.getByText("Northwind Labs").waitFor();
    await app.getByRole("heading", { name: "Interview Sessions" }).waitFor();
    await app.getByText("Technical Interview").waitFor();
    await app.getByText("RAG pipelines").waitFor();
    await app.getByText("Fit Score: 86").waitFor();
    await shoot(app, "application.png");

    await app.goto(`${BASE}/interview/${PENDING_SESSION_ID}`, { waitUntil: "networkidle" });
    await app.getByRole("heading", { name: "Interview Session" }).waitFor();
    await app.getByRole("button", { name: "Start Interview" }).waitFor();
    await app.getByText("4 Questions").waitFor();
    await app.getByText("Senior").waitFor();
    await shoot(app, "interview-start.png");

    await app.goto(`${BASE}/interview/${PENDING_SESSION_ID}/start`, { waitUntil: "networkidle" });
    await app.getByRole("button", { name: "I Understand, Let's Begin" }).click();
    await app.getByText("Analyzing your resume and job description").waitFor();
    await interviewSocket.waitForOpen();
    interviewSocket.send(FIT_SCORE);
    interviewSocket.send(questionMessage(QUESTIONS[0], 1));
    await app.getByText(QUESTIONS[0].question_text).waitFor();
    await app.getByText("Question: 1 of 4").waitFor();
    await app.getByText("86", { exact: true }).waitFor();

    await sendAnswer(app, ANSWERS[0]);
    await app.getByText(QUESTIONS[1].question_text).waitFor();
    await app.getByText("Follow-up").waitFor();
    await app.getByText("Total Questions Asked: 2").waitFor();
    await shoot(app, "interview.png");

    for (let index = 1; index < ANSWERS.length; index += 1) {
        await sendAnswer(app, ANSWERS[index]);
        const nextQuestion = QUESTIONS[index + 1];
        if (nextQuestion) await app.getByText(nextQuestion.question_text).waitFor();
    }
    await app.getByRole("heading", { name: "Evaluation Summary" }).waitFor();
    await app.getByText("Improvement Tips").waitFor();
    await app.getByText(EVALUATION.final_evaluation.improvement_tips[0]).waitFor();
    if (interviewSocket.answers.length !== ANSWERS.length) {
        throw new Error(`Expected ${ANSWERS.length} answers on the socket, got ${interviewSocket.answers.length}`);
    }
    await app.evaluate(() => {
        const main = document.querySelector("main");
        const heading = [...document.querySelectorAll("h2")].find(
            (element) => element.textContent?.trim() === "Evaluation Summary",
        );
        if (!main || !heading) return;
        const delta = heading.getBoundingClientRect().top - main.getBoundingClientRect().top;
        main.scrollTop += delta - 16;
        // Pull the fit-breakdown labels back into frame. The results card still fits.
        main.scrollTop = Math.max(0, main.scrollTop - 36);
    });
    await shoot(app, "evaluation.png");
    await authed.close();

    const phone = await browser.newContext({
        ...desktop,
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
    });
    await phone.route(`${API_ORIGIN}/**`, mockApi);
    const mobileLogin = await phone.newPage();
    attachSocketLog(mobileLogin);
    await mobileLogin.goto(`${BASE}/login`, { waitUntil: "networkidle" });
    await mobileLogin.getByRole("heading", { name: "Welcome Back" }).waitFor();
    await mobileLogin.getByText("Login to your Intelliprep").waitFor();
    await shoot(mobileLogin, "login-mobile.png");
    await phone.close();
}

let serverProcess;

process.on("SIGINT", () => {
    stop(serverProcess);
    process.exit(130);
});
process.on("SIGTERM", () => {
    stop(serverProcess);
    process.exit(143);
});

async function main() {
    if (await portInUse(PORT)) {
        throw new Error(`Port ${PORT} is already in use. Stop that process and re-run.`);
    }

    await mkdir(OUT_DIR, { recursive: true });

    console.log("Building production app…");
    const build = run(["build"], {
        NEXT_PUBLIC_API_URL: API_ORIGIN,
        NEXT_PUBLIC_WS_URL: WS_ORIGIN,
    });
    const buildCode = await new Promise((resolve) => build.on("exit", resolve));
    if (buildCode !== 0) throw new Error(`build failed (${buildCode})`);

    console.log(`Starting server on ${BASE}…`);
    serverProcess = run(["start", "-H", "127.0.0.1", "-p", String(PORT)]);
    try {
        await waitForServer(serverProcess);
        const browser = await chromium.launch({
            channel: "chrome",
            headless: true,
            args: ["--disable-dev-shm-usage", "--no-sandbox"],
        });
        try {
            await capture(browser);
        } finally {
            await browser.close();
        }
    } finally {
        stop(serverProcess);
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
