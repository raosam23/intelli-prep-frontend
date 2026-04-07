import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
    variable: "--font-plus-jakarta-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "IntelliPrep",
    description:
        "AI-powered interview preparation platform that helps job seekers practice and improve their interview skills through realistic simulations and personalized feedback.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full antialiased">
            <body className={`${plusJakartaSans.variable} ${plusJakartaSans.className} min-h-full flex flex-col`}>
                {children}
                <Toaster position="top-right" duration={5000} richColors closeButton theme="dark" />
            </body>
        </html>
    );
}
