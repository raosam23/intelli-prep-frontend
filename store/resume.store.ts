import { create } from "zustand";
import axios from "@/lib/axios";
import { Resume } from "@/types";
import { isAxiosError } from "axios";
import { APIError } from "@/lib/error";

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
            if (isAxiosError(error)) {
                throw new APIError(
                    error.response?.data?.detail || "Failed to fetch resumes",
                    error.response?.status,
                    error.response?.data?.detail
                )
            }
        } finally {
            set({ isLoading: false });
        }
    },
    uploadResume: async (file) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            formData.append("file", file);
            await axios.post("/api/resumes/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            await useResumeStore.getState().fetchResumes();
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                throw new APIError(
                    error.response?.data?.detail || "Failed to upload resume",
                    error.response?.status,
                    error.response?.data?.detail
                )
            }
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
            if (isAxiosError(error)) {
                throw new APIError(
                    error.response?.data?.detail || "Failed to delete resume",
                    error.response?.status,
                    error.response?.data?.detail
                )
            }
        } finally {
            set({ isLoading: false });
        }
    },
    updateResume: async (id, file) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            formData.append("new_file", file);
            await axios.put(`/api/resumes/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            await useResumeStore.getState().fetchResumes();
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                throw new APIError(
                    error.response?.data?.detail || "Failed to update resume",
                    error.response?.status,
                    error.response?.data?.detail
                )
            }
        } finally {
            set({ isLoading: false });
        }
    },
}
));