import { create } from "zustand";
import axios from "@/lib/axios";
import Cookies from "js-cookie";
import { User } from "@/types";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (name: string, email: string, password: string) => Promise<void>;
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
            set({ isAuthenticated: true });
        }
        catch (error: unknown) {
            console.error("Login failed", error);
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
        catch (err: unknown) {
            console.error("Registration failed", err);
        }
        finally {
            set({ isLoading: false });
        }
    }
}));