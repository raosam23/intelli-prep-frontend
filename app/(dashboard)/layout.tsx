"use client";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "@/lib/axios";
import Sidebar from "@/components/common/sidebar";
import { LoaderCircle } from "lucide-react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { isAuthenticated, setIsAuthenticated, setUser } = useAuthStore();
    const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsCheckingAuth(true);
                const token = Cookies.get("token");
                if (!token) {
                    router.push("/login");
                    return;
                }
                if (token && !isAuthenticated) {
                    const response = await axios.get("/api/auth/me");
                    if (response.status === 200) {
                        setIsAuthenticated(true);
                        setUser(response.data);
                    } else {
                        Cookies.remove("token");
                        router.push("/login");
                        return;
                    }
                }
            } catch (error: unknown) {
                console.error("Error checking authentication", error);
                Cookies.remove("token");
                router.push("/login");
            } finally {
                setIsCheckingAuth(false);
            }
        };
        checkAuth();
    }, [router, isAuthenticated, setIsAuthenticated, setUser]);
    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <LoaderCircle className="animate-spin text-white" />
            </div>
        );
    }
    return (
        <div className="flex h-screen bg-zinc-950">
            <Sidebar />
            <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
        </div>
    );
};

export default DashboardLayout;
