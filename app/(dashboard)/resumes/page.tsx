"use client";
import { useResumeStore } from "@/store/resume.store";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, LoaderCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import { APIError } from "@/lib/error";
import { Resume } from "@/types";
import ResumeCard from "@/components/resumes/ResumeCard";

const Resumes = () => {
    const { resumes, fetchResumes, uploadResume, isLoading } = useResumeStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const getAllResumes = async () => {
            try {
                await fetchResumes();
            } catch (error: unknown) {
                if (error instanceof APIError) {
                    console.error("Error in fetching resumes:", String(error));
                    toast.error(error.message);
                } else {
                    toast.error("An unknown error occurred while fetching resumes.");
                }
            }
        };
        getAllResumes();
    }, []);
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            toast.error("Please select a file to upload.");
            return;
        }
        try {
            await uploadResume(file);
            toast.success("Resume uploaded successfully!");
        } catch (error: unknown) {
            if (error instanceof APIError) {
                console.error("Error in uploading resume:", error.message);
                toast.error(error.message);
            } else {
                console.error("Unknown error in uploading resume:", String(error));
                toast.error("An unknown error occurred while uploading the resume.");
            }
        } finally {
            event.target.value = ""; // Reset the file input
        }
    };
    return (
        <div className="min-h-screen w-full p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">My Resumes</h1>
                <div>
                    <input type="file" className="hidden" ref={fileInputRef} onChange={handleUpload} />
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className="cursor-pointer"
                    >
                        {isLoading ? <LoaderCircle className="animate-spin" /> : <Upload size={16} className="mr-2" />}{" "}
                        Upload Resume
                    </Button>
                </div>
            </div>
            {resumes.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <FileText size={48} className="text-zinc-600 mb-4" />
                    <p className="text-zinc-400">No resumes uploaded yet.</p>
                    <p className="text-zinc-400 text-sm">Upload your first resume to get started.</p>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resumes.map((resume: Resume) => (
                    <ResumeCard key={resume.id} resume={resume} />
                ))}
            </div>
        </div>
    );
};

export default Resumes;
