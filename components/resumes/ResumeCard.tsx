"use client";
import { useResumeStore } from "@/store/resume.store";
import { Resume } from "@/types";
import { useRef } from "react";
import { Card } from "../ui/card";
import { toast } from "sonner";
import { APIError } from "@/lib/error";
import { Button } from "../ui/button";
import { Trash2, RefreshCw, FileText } from "lucide-react";
import { isAxiosError } from "axios";

const ResumeCard = ({ resume }: { resume: Resume }) => {
    const updateInputRef = useRef<HTMLInputElement>(null);
    const { updateResume, deleteResume } = useResumeStore();
    const handleUpdate = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            toast.error("Please select a file to update.");
            return;
        }
        try {
            await updateResume(resume.id, file);
            toast.success("Resume updated successfully!");
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                console.error("Axios error in updating resume:", error.response?.data);
                toast.error(error.response?.data?.detail || "Failed to update resume.");
            }
            if (error instanceof APIError) {
                console.error("Error in updating resume:", error.message);
                toast.error(error.message);
            } else {
                console.error("Unknown error in updating resume:", String(error));
                toast.error("An unknown error occurred while updating the resume.");
            }
        } finally {
            event.target.value = ""; // Reset the file input
        }
    };
    const handleDelete = async () => {
        try {
            await deleteResume(resume.id);
            toast.success("Resume deleted successfully!");
        } catch (error: unknown) {
            if (error instanceof APIError) {
                toast.error(error.message);
                console.error("Error in deleting resume: ", error.message);
            } else {
                toast.error("An unknown error occurred while deleting the resume.");
                console.error("Unknown error in deleting resume: ", error);
            }
        }
    };

    return (
        <Card className="p-4 bg-zinc-900 border-zinc-800 space-y-4">
            <div className="flex items-center gap-3">
                <FileText className="text-zinc-400" size={24} />
                <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{resume.file_name}</p>
                    <p className="text-zinc-500 text-xs">{new Date(resume.created_at).toLocaleDateString()}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <input type="file" accept=".pdf" ref={updateInputRef} className="hidden" onChange={handleUpdate} />
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-zinc-600 bg-zinc-800 text-white hover:bg-zinc-700 cursor-pointer"
                    onClick={() => updateInputRef.current?.click()}
                >
                    <RefreshCw className="mr-2" />
                    Update
                </Button>
                <Button variant="destructive" size="sm" className="flex-1 cursor-pointer" onClick={handleDelete}>
                    <Trash2 className="mr-2" />
                    Delete
                </Button>
            </div>
        </Card>
    );
};

export default ResumeCard;
