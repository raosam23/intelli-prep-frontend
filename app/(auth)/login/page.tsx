"use client";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { APIError } from "@/lib/error";

const Login = () => {
    const router = useRouter();
    const { isLoading, login } = useAuthStore();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const handleOnSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await login(email, password);
            toast.success("Login successful!");
            router.push("/dashboard");
        } catch (error: unknown) {
            if (error instanceof APIError) {
                console.error("Login error:", error);
                toast.error(error.message);
            } else {
                toast.error("An unknown error occurred during login.");
            }
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950">
            <Card className="w-full max-w-md p-8 space-y-6 shadow-lg border border-zinc-800 bg-zinc-900">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h1>
                    <p className="text-zinc-400 text-sm">Login to your Intelliprep</p>
                </div>
                <form onSubmit={handleOnSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-zinc-300" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="email@domain.com"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-zinc-300" htmlFor="password">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            minLength={7}
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full cursor-pointer bg-white text-black hover:text-zinc-500
                        hover:bg-zinc-300
                        focus:border-zinc-500"
                    >
                        {isLoading ? <LoaderCircle className="animate-spin" /> : "Login"}
                    </Button>
                </form>
                <p className="text-center text-sm text-zinc-400">
                    Don't have an account?{" "}
                    <Link className="text-white font-medium hover:underline" href="/register">
                        Register
                    </Link>
                </p>
            </Card>
        </div>
    );
};

export default Login;
