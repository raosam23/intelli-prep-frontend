import { create } from "zustand";
import axios from "@/lib/axios";
import Cookies from "js-cookie";
import { User } from "@/types";
import { isAxiosError } from "axios";
import { APIError } from "@/lib/error";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (name: string, email: string, password: string) => Promise<void>;
    setUser: (user: User | null) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await axios.post("/api/auth/login", { email, password });
            const { access_token } = response.data;
            Cookies.set("token", access_token, { expires: 10 });
            const profileResponse = await axios.get("/api/auth/me");
            set({ isAuthenticated: true, user: profileResponse.data });
        }
        catch (error: unknown) {
            if (isAxiosError(error)) {
                throw new APIError(
                    error.response?.data?.detail || "Login failed",
                    error.response?.status,
                    error.response?.data?.detail
                )
            }
            throw new APIError("Login failed");
        }
        finally {
            set({ isLoading: false });
        }
    },
    logout: () => {
        Cookies.remove("token");
        set({ user: null, isAuthenticated: false });
    },
    register: async (name, email, password) => {
        set({ isLoading: true });
        try {
            await axios.post("/api/auth/register", { name, email, password });
            await useAuthStore.getState().login(email, password);
        }
        catch (error: unknown) {
            if (isAxiosError(error)) {
                throw new APIError(
                    error.response?.data?.detail || "Registration failed",
                    error.response?.status,
                    error.response?.data?.detail
                )
            }
            throw new APIError("Registration failed");
        }
        finally {
            set({ isLoading: false });
        }
    },
    setUser: (user) => set({ user }),
    setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
}));