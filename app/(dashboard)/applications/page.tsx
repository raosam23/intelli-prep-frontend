"use client";
import { useApplicationStore } from "@/store/application.store";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { APIError } from "@/lib/error";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/applications/EmptyState";
import { JobApplication } from "@/types";
import ApplicationCard from "@/components/applications/ApplicationCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useResumeStore } from "@/store/resume.store";
import ResumeSelector from "@/components/applications/ResumeSelector";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
const Applications = () => {
    const { applications, fetchApplications, isLoading, createApplication } = useApplicationStore();
    const { resumes, fetchResumes } = useResumeStore();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [selectedResumeId, setSelectedResumeId] = useState<string>("");
    const [jdRawText, setJdRawText] = useState<string>("");
    useEffect(() => {
        const getAllApplications = async () => {
            try {
                await fetchApplications();
            } catch (error: unknown) {
                if (error instanceof APIError) {
                    console.error("Error in fetching applications:", error.message);
                    toast.error(error.message);
                } else {
                    toast.error("An unknown error occurred while fetching applications.");
                }
            }
        }
        getAllApplications();
        fetchResumes();
    }, []);

    const handleCreate = async (event: React.SyntheticEvent<HTMLFormElement>, resumeId: string, jdRawText: string) => {
        event.preventDefault();
        try {
            await createApplication(resumeId, jdRawText);
            toast.success("Application created successfully!");
        } catch (error: unknown) {
            if (error instanceof APIError) {
                console.error("Error in creating application:", error.message);
                toast.error(error.message);
            } else {
                console.error("Unknown error in creating application:", String(error));
                toast.error("An unknown error occurred while creating the application.");
            }
        } finally {
            setIsDialogOpen(false);
            setSelectedResumeId("");
            setJdRawText("");
        }
    }
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoaderCircle className="animate-spin text-white" />
            </div>
        )
    }
    return (
        <div className="min-h-screen w-full p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">My Applications</h1>
                <Button className="cursor-pointer" disabled={isLoading} onClick={() => setIsDialogOpen(true)}>New Application</Button>
            </div>
            {applications.length === 0 && <EmptyState resumes={resumes} />}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {applications.map((applications: JobApplication) => <ApplicationCard key={applications.id} application={applications} />)}
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-zinc-900 border-zinc-800 [&>button]:text-white [&>button]:hover:text-zinc-500 [&>button]:cursor-pointer">
                    <DialogHeader>
                        <DialogTitle className="text-white">New application</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(event) => handleCreate(event, selectedResumeId, jdRawText)} className="space-y-4 text-white text-sm font-medium border border-zinc-800 rounded-lg p-4">
                        <ResumeSelector resumes={resumes} selectedResumeId={selectedResumeId} setSelectedResumeId={setSelectedResumeId} />
                        <Textarea
                            placeholder="Paste the job description here"
                            value={jdRawText}
                            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setJdRawText(event.target.value)}
                            rows={10}
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                        />
                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1 border-zinc-600 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 cursor-pointer">Submit</Button>
                            <Button type="button" variant="destructive" className="flex-1 cursor-pointer" onClick={() => {
                                setIsDialogOpen(false);
                                setSelectedResumeId("");
                                setJdRawText("");
                            }}>Cancel</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )

}
export default Applications;