import { create } from "zustand";
import axios from "@/lib/axios";
import { JobApplication } from "@/types";

interface ApplicationState {
    applications: JobApplication[];
    currentApplication: JobApplication | null;
    isLoading: boolean;

    fetchApplications: () => Promise<void>;
    fetchApplicationById: (id: string) => Promise<void>;
    createApplication: (resumeId: string, jdRawText: string) => Promise<void>;
    updateApplication: (id: string, status?: string, jdRawText?: string) => Promise<void>;
    deleteApplication: (id: string) => Promise<void>;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
    applications: [],
    currentApplication: null,
    isLoading: false,
    fetchApplications: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get('/api/job-applications');
            set({ applications: response.data.job_applications });
        } catch (error: unknown) {
            console.error("Failed to fetch applications", error);
        } finally {
            set({ isLoading: false });
        }
    },
    fetchApplicationById: async (id) => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`/api/job-applications/${id}`);
            set({ currentApplication: response.data })
        } catch (error: unknown) {
            console.error("Failed to fetch application", error);
        } finally {
            set({ isLoading: false });
        }
    },
    createApplication: async (resumeId, jdRawText) => {
        set({ isLoading: true });
        try {
            await axios.post('/api/job-applications', { resume_id: resumeId, jd_raw_text: jdRawText });
            await useApplicationStore.getState().fetchApplications();
        } catch (error: unknown) {
            console.error("Failed to create job application", error);
        } finally {
            set({ isLoading: false });
        }
    },
    updateApplication: async (id, status, jdRawText) => {
        set({ isLoading: true });
        try {
            await axios.put(`/api/job-applications/${id}`, { status, jd_raw_text: jdRawText });
            await useApplicationStore.getState().fetchApplications();
        } catch (error: unknown) {
            console.error("Failed to update job application", error);
        } finally {
            set({ isLoading: false });
        }
    },
    deleteApplication: async (id) => {
        set({ isLoading: true });
        try {
            await axios.delete(`/api/job-applications/${id}`);
            await useApplicationStore.getState().fetchApplications();
        } catch (error: unknown) {
            console.error("Failed to delete job application", error);
        } finally {
            set({ isLoading: false });
        }
    }
}));