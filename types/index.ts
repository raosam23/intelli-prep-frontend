export type ApplicationStatus = "applied" | "interviewing" | "approved" | "rejected";
export type InterviewStatus = "pending" | "in_progress" | "completed" | "incomplete";
export type DifficultyLevel = "junior" | "mid" | "senior";
export type InterviewType = "technical" | "managerial" | "behavioral" | "mixed";
export type InterviewPageStatusType = "warning" | "connecting" | "fit_score" | "interview" | "completed" | "error";
export type InterviewMessagesType = { role: "ai" | "user", content: string }
export type EvaluationVerdict = "strong_hire" | "hire" | "no_decision" | "no_hire" | "strong_no_hire";

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

export interface Resume {
    id: string;
    user_id: string;
    file_name: string;
    parsed_json: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
}

export interface JobApplication {
    id: string;
    user_id: string;
    resume_id: string;
    jd_raw_text: string;
    fit_score: number | null;
    fit_breakdown_score: string | null;
    status: ApplicationStatus;
    created_at: string;
    updated_at: string;
}

export interface Interview {
    id: string;
    job_application_id: string;
    num_questions: number;
    difficulty: DifficultyLevel;
    interview_type: InterviewType;
    focus_area: string | null;
    status: InterviewStatus;
    feedback: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateSessionData {
    job_application_id: string;
    num_questions: number;
    difficulty: DifficultyLevel;
    interview_type: InterviewType;
    focus_area?: string;
}