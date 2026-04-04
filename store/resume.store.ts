import { create } from "zustand";
import axios from "@/lib/axios";

interface Resume {
    id: string;
    user_id: string;
    file_name: string;
    parsed_json: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
}

interface ResumeState {
    resumes: Resume[];
    isLoading: boolean;

    fetchResumes: () => Promise<void>;
    uploadResume: (file: File) => Promise<void>;
    deleteResume: (id: string) => Promise<void>;
    updateResume: (id: string, file: File) => Promise<void>;
}

export const useResumeStore = create<ResumeState>((set) => ({
    resumes: [],
    isLoading: false,
    fetchResumes: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get("/api/resumes");
            set({ resumes: response.data.resumes });
        } catch (error: unknown) {
            console.error("Failed to fetch resumes", error);
        } finally {
            set({ isLoading: false });
        }
    },
    uploadResume: async (file) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            formData.append("file", file);
            await axios.post("/api/resumes/upload", formData);
            await useResumeStore.getState().fetchResumes();
        } catch (error: unknown) {
            console.error("Failed to upload resume", error);
        } finally {
            set({ isLoading: false });
        }
    },
    deleteResume: async (id) => {
        set({ isLoading: true });
        try {
            await axios.delete(`/api/resumes/${id}`);
            await useResumeStore.getState().fetchResumes();
        } catch (error: unknown) {
            console.error("Failed to delete resume", error);
        } finally {
            set({ isLoading: false });
        }
    },
    updateResume: async (id, file) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            formData.append("file", file);
            await axios.put(`/api/resumes/${id}`, formData);
            await useResumeStore.getState().fetchResumes();
        } catch (error: unknown) {
            console.error("Failed to update resume", error);
        } finally {
            set({ isLoading: false });
        }
    },
}
));