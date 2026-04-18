"use client";
import { getSessionStatusColor, InterviewRouteParams } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useInterviewStore } from "@/store/interview.store";
import { APIError } from "@/lib/error";
import { LoaderCircle, ArrowBigRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import InterviewFeedbackandFocusAreaDialog from "@/components/interview/InterviewFeedbackandFocusAreaDialog";

const InterviewPage = () => {
    const router = useRouter();
    const { session_id } = useParams<InterviewRouteParams>();
    const { isLoading, currentSession, fetchSessionById, deleteSession } = useInterviewStore();
    const isDeletingRef = useRef(false);
    const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState<boolean>(false);
    const [isFocusAreaDialogOpen, setIsFocusAreaDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!isLoading && isDeletingRef.current) {
            isDeletingRef.current = false;
            toast.success("Interview session deleted successfully");
            router.back();
        }
    }, [isLoading, router]);

    useEffect(() => {
        const getSessionById = async () => {
            try {
                await fetchSessionById(session_id);
            } catch (error: unknown) {
                if (error instanceof APIError) {
                    console.error("Error in fetching interview session: ", error.message);
                    toast.error(error.message);
                } else {
                    toast.error("Unknown error occurred while fetching interview session");
                }
                router.back();
            }
        };
        getSessionById();
    }, [session_id, fetchSessionById, router]);
    if (isLoading || !currentSession) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoaderCircle className="animate-spin text-white" size={32} />
            </div>
        );
    }
    const handleDeleteButton = async () => {
        isDeletingRef.current = true;
        try {
            await deleteSession(session_id);
        } catch (error: unknown) {
            isDeletingRef.current = false;
            if (error instanceof APIError) {
                console.error("Error in deleting interview session: ", error.message);
                toast.error(error.message);
            } else {
                toast.error("Unknown error occurred while deleting interview session");
            }
        }
    };
    return (
        <div className="min-h-screen w-full p-6 flex flex-col gap-4 max-w-2xl mx-auto items-center justify-center">
            <div className="flex items-center">
                <h1 className="text-3xl font-bold text-white">Interview Session</h1>
            </div>

            <Card className="rounded-2xl border border-zinc-700 bg-zinc-900 p-8 shadow-xl flex flex-col gap-6 w-full">
                <div className="flex items-center justify-between">
                    <Badge className={`${getSessionStatusColor(currentSession.status)} text-black capitalize w-fit`}>
                        {currentSession.status.replaceAll("_", " ")}
                    </Badge>
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            size="sm"
                            className="w-full border-zinc-600 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 cursor-pointer"
                            onClick={() => router.back()}
                        >
                            Back
                        </Button>
                        <Button
                            size="sm"
                            className="w-full border-red-900 bg-red-950 text-red-400 hover:text-red-200 hover:bg-red-900 cursor-pointer"
                            onClick={handleDeleteButton}
                        >
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl border border-zinc-700 overflow-hidden divide-y divide-zinc-700">
                    <div className="grid grid-cols-2 divide-x divide-zinc-700">
                        <div className="p-5 flex flex-col gap-1">
                            <span className="text-sm text-zinc-500">Created at</span>
                            <span className="text-lg font-semibold text-zinc-100">
                                {new Date(currentSession.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="p-5 flex flex-col gap-1">
                            <span className="text-sm text-zinc-500">Difficulty</span>
                            <span className="text-lg font-semibold text-zinc-100 capitalize">
                                {currentSession.difficulty}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 divide-x divide-zinc-700">
                        <div className="p-5 flex flex-col gap-1">
                            <span className="text-sm text-zinc-500">Number of questions</span>
                            <span className="text-lg font-semibold text-zinc-100">
                                {currentSession.num_questions} Questions
                            </span>
                        </div>
                        <div className="p-5 flex flex-col gap-1">
                            <span className="text-sm text-zinc-500">Interview Type</span>
                            <span className="text-lg font-semibold text-zinc-100 capitalize">
                                {currentSession.interview_type.replaceAll("_", " ")}
                            </span>
                        </div>
                    </div>
                    {(currentSession.feedback || currentSession.focus_area) && (
                        <div className="grid grid-cols-2 divide-x divide-zinc-700">
                            <div
                                className={`p-5 flex flex-col gap-1 ${currentSession.feedback && currentSession.feedback.length > 20 && "cursor-pointer"}`}
                                onClick={() =>
                                    currentSession.feedback &&
                                    currentSession.feedback.length > 20 &&
                                    setIsFeedbackDialogOpen(true)
                                }
                            >
                                <span className="text-sm text-zinc-500">Feedback</span>
                                <span className="text-lg font-semibold text-zinc-100">
                                    {currentSession.feedback
                                        ? `${currentSession.feedback.length > 20 ? `${currentSession.feedback.substring(0, 20)}...` : currentSession.feedback}`
                                        : "No feedback available"}
                                </span>
                            </div>
                            <div
                                className={`p-5 flex flex-col gap-1 ${currentSession.focus_area && currentSession.focus_area.length > 20 && "cursor-pointer"}`}
                                onClick={() =>
                                    currentSession.focus_area &&
                                    currentSession.focus_area.length > 20 &&
                                    setIsFocusAreaDialogOpen(true)
                                }
                            >
                                <span className="text-sm text-zinc-500">Focus Area</span>
                                <span className="text-lg font-semibold text-zinc-100 capitalize">
                                    {currentSession.focus_area
                                        ? `${currentSession.focus_area.length > 20 ? `${currentSession.focus_area.substring(0, 20)}...` : currentSession.focus_area}`
                                        : "No focus area available"}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <Button
                    className="w-full border-zinc-600 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 cursor-pointer"
                    disabled={currentSession.status !== "pending" || isLoading}
                    onClick={() => router.push(`/interview/${session_id}/start`)}
                >
                    Start Interview <ArrowBigRight className="ml-2" />
                </Button>
            </Card>
            <InterviewFeedbackandFocusAreaDialog
                title="feedback"
                isDialogOpen={isFeedbackDialogOpen}
                setIsDialogOpen={setIsFeedbackDialogOpen}
                content={currentSession.feedback ?? "No feedback available"}
            />
            <InterviewFeedbackandFocusAreaDialog
                title="focus area"
                isDialogOpen={isFocusAreaDialogOpen}
                setIsDialogOpen={setIsFocusAreaDialogOpen}
                content={currentSession.focus_area ?? "No focus area available"}
            />
        </div>
    );
};

export default InterviewPage;
