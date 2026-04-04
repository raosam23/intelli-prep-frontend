import { create } from "zustand";
import axios from "@/lib/axios";

interface Interview {
    id: string;
    job_application_id: string;
    num_questions: number;
    difficulty: string;
    interview_type: string;
    focus_area: string | null;
    status: string;
    feedback: string | null;
    created_at: string;
    updated_at: string;
}

interface CreateSessionData {
    job_application_id: string;
    num_questions: number;
    difficulty: string;
    interview_type: string;
    focus_area?: string;
}

interface InterviewState {
    sessions: Interview[];
    currentSession: Interview | null;
    isLoading: boolean;

    fetchSessionsByApplication(jobApplicationId: string): Promise<void>;
    fetchSessionById(id: string): Promise<void>;
    createSession(data: CreateSessionData): Promise<void>;
    deleteSession(id: string): Promise<void>;
}

export const useInterviewStore = create<InterviewState>((set) => ({
    sessions: [],
    currentSession: null,
    isLoading: false,
    fetchSessionsByApplication: async (jobApplicationId) => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`/api/interview-sessions/job-application/${jobApplicationId}`)
            set({ sessions: response.data.interview_sessions });
        } catch (error: unknown) {
            console.error("Failed to fetch interview sessions", error);
        } finally {
            set({ isLoading: false });
        }
    },
    fetchSessionById: async (id) => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`/api/interview-sessions/${id}`);
            set({ currentSession: response.data });
        } catch (error: unknown) {
            console.error("Failed to fetch interview session", error);
        } finally {
            set({ isLoading: false });
        }
    },
    createSession: async (data) => {
        set({ isLoading: true });
        try {
            await axios.post("/api/interview-sessions", data);
        } catch (error: unknown) {
            console.error("Failed to create interview session", error);
        } finally {
            set({ isLoading: false });
        }
    },
    deleteSession: async (id) => {
        set({ isLoading: true });
        try {
            await axios.delete(`/api/interview-sessions/${id}`);
        } catch (error: unknown) {
            console.error("Failed to delete interview session", error);
        } finally {
            set({ isLoading: false });
        }
    }
}));