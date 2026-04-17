"use client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import { useApplicationStore } from "@/store/application.store";
import { useInterviewStore } from "@/store/interview.store";
import { toast } from "sonner";
import { APIError } from "@/lib/error";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApplicationStatus, Interview } from "@/types";
import SessionCard from "@/components/Sessions/SessionCard";
import CreateSessionDialog from "@/components/Sessions/CreateSessionDialog";
import { getStatusColor } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import EditApplicationDialog from "@/components/applications/EditApplicationDialog";

const JobApplicationDetails = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { currentApplication, fetchApplicationById, isLoading, deleteApplication } = useApplicationStore();
    const { sessions, fetchSessionsByApplication, isLoading: isSessionsLoading } = useInterviewStore();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const hasEditSubmittedRef = useRef(false);
    const hasInterviewCreatedRef = useRef(false);

    useEffect(() => {
        if (!isLoading && hasEditSubmittedRef.current) {
            setIsEditDialogOpen(false);
            hasEditSubmittedRef.current = false;
        }
    }, [isLoading]);

    useEffect(() => {
        if (!isSessionsLoading && hasInterviewCreatedRef.current) {
            setIsDialogOpen(false);
            hasInterviewCreatedRef.current = false;
        }
    }, [isSessionsLoading]);

    useEffect(() => {
        const getApplicationById = async (applicationId: string) => {
            setIsPageLoading(true);
            try {
                await Promise.all([fetchApplicationById(applicationId), fetchSessionsByApplication(applicationId)]);
            } catch (error: unknown) {
                if (error instanceof APIError) {
                    console.error("Error in fetching interview sessions: ", error.message);
                    toast.error(error.message);
                } else {
                    toast.error("Unknown error occurred while fetching interview sessions");
                }
            } finally {
                setIsPageLoading(false);
            }
        };
        getApplicationById(id);
    }, [id]);
    if (isPageLoading || isLoading || isSessionsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoaderCircle className="animate-spin text-white" size={32} />
            </div>
        );
    }
    return (
        <div className="min-h-screen w-full p-8 space-y-6">
            <div className="flex justify-between">
                <Button
                    className="cursor-pointer border-zinc-700 text-zinc-400 hover:text-white"
                    onClick={() => router.back()}
                >
                    Back
                </Button>
                <div className="flex gap-2">
                    <Button
                        className="cursor-pointer border-zinc-700 text-zinc-400 hover:text-white"
                        onClick={() => setIsEditDialogOpen(true)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={async () => {
                            try {
                                await deleteApplication(id);
                                router.push("/applications");
                            } catch (error: unknown) {
                                if (error instanceof APIError) {
                                    toast.error(error.message);
                                } else {
                                    toast.error("Unknown error occurred while deleting application");
                                }
                            }
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
                <Badge
                    className={`${getStatusColor(currentApplication?.status as ApplicationStatus)} text-black capitalize w-fit`}
                >
                    {currentApplication?.status}
                </Badge>
                <p className="text-zinc-400 text-sm font-medium">
                    Fit Score: {currentApplication?.fit_score ?? "Not analyzed yet"}
                </p>
                <p className="text-zinc-300 text-sm leading-relaxed">{currentApplication?.jd_raw_text}</p>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Interview Sessions</h2>
                    <Button className="cursor-pointer" onClick={() => setIsDialogOpen(true)}>
                        New Session
                    </Button>
                </div>
                {sessions.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                        <p className="text-zinc-400">No interview sessions yet.</p>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sessions.map((session: Interview) => (
                        <SessionCard key={session.id} session={session} />
                    ))}
                </div>
                <CreateSessionDialog
                    isDialogOpen={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                    jobApplicationId={id}
                    onSubmitStart={() => {
                        hasInterviewCreatedRef.current = true;
                    }}
                />
            </div>
            <EditApplicationDialog
                isDialogOpen={isEditDialogOpen}
                setIsDialogOpen={setIsEditDialogOpen}
                applicationId={id}
                applicationStatus={currentApplication?.status as ApplicationStatus}
                applicationJdRawText={currentApplication?.jd_raw_text ?? ""}
                onSubmitStart={() => {
                    hasEditSubmittedRef.current = true;
                }}
            />
        </div>
    );
};

export default JobApplicationDetails;
