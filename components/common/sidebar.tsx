"use client";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { LayoutDashboard, FileText, Briefcase, LogOut } from "lucide-react";
import { useInterviewStore } from "@/store/interview.store";
import { toast } from "sonner";
const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { isInterviewActive } = useInterviewStore();
    const checkIfDisabled = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (isInterviewActive) {
            event.preventDefault();
            event.stopPropagation();
            toast.info("Please complete or end the ongoing interview before navigating to another page.");
        }
    };
    const handleOnClick = () => {
        if (isInterviewActive) {
            toast.info("Please complete or end the ongoing interview before logging out.");
            return;
        }
        logout();
        router.push("/login");
    };
    return (
        <div className="flex flex-col h-screen w-64 bg-zinc-900 border-r border-zinc-800">
            <div className="flex items-center gap-3 px-4 py-5 border-b border-zinc-800">
                <Image src="/logo.png" alt="Logo" width={64} height={64} loading="eager" />
                <span className="text-white font-bold text-lg">IntelliPrep</span>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
                <Link
                    href="/dashboard"
                    className={`flex items-center gap-3 px-4 py-2 ${pathname === "/dashboard" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"} ${isInterviewActive && " opacity-50 cursor-not-allowed"}`}
                    aria-disabled={isInterviewActive}
                    tabIndex={isInterviewActive ? -1 : 0}
                    onClick={checkIfDisabled}
                >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                </Link>
                <Link
                    href="/resumes"
                    className={`flex items-center gap-3 px-4 py-2 ${pathname === "/resumes" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"} ${isInterviewActive && " opacity-50 cursor-not-allowed"}`}
                    aria-disabled={isInterviewActive}
                    tabIndex={isInterviewActive ? -1 : 0}
                    onClick={checkIfDisabled}
                >
                    <FileText size={18} />
                    <span>Resumes</span>
                </Link>
                <Link
                    href="/applications"
                    className={`flex items-center gap-3 px-4 py-2 ${pathname.startsWith("/applications") || pathname.startsWith("/interview") ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"} ${isInterviewActive && " opacity-50 cursor-not-allowed"}`}
                    aria-disabled={isInterviewActive}
                    tabIndex={isInterviewActive ? -1 : 0}
                    onClick={checkIfDisabled}
                >
                    <Briefcase size={18} />
                    <span>Applications</span>
                </Link>
            </nav>
            <div className="mt-auto p-4 border-t border-zinc-800">
                <div className="mb-3">
                    <p className="text-white text-sm font-medium">{user?.name || "Guest"}</p>
                    <p className="text-zinc-400 text-sm truncate">{user?.email || ""}</p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleOnClick}
                    className={`w-full border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center gap-2 cursor-pointer ${isInterviewActive && " opacity-50 cursor-not-allowed"}`}
                    aria-disabled={isInterviewActive}
                    tabIndex={isInterviewActive ? -1 : 0}
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
