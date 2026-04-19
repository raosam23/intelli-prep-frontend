import { create } from 'zustand';
import axios from '@/lib/axios';
import { isAxiosError } from 'axios';
import { APIError } from '@/lib/error';
import { DashboardResponse } from '@/types';

interface AnalyticsState {
    dashboard: DashboardResponse | null;
    isLoading: boolean;

    fetchDashboard: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
    dashboard: null,
    isLoading: false,
    fetchDashboard: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get("/api/analytics/dashboard");
            set({ dashboard: response.data });
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                throw new APIError(
                    error.response?.data?.detail || "Failed to fetch dashboard analytics",
                    error.response?.status,
                    error.response?.data
                )
            }
            throw new APIError("Failed to fetch dashboard analytics");
        }
        finally {
            set({ isLoading: false });
        }
    },
}));