"use client";
import { InterviewRouteParams } from "@/lib/utils";
import { InterviewMessagesType, InterviewPageStatusType } from "@/types";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import DontCloseWarningDialog from "@/components/interview/DontCloseWarningDialog";
import AnalyzingResumeLoading from "@/components/interview/AnalyzingResumeLoading";
import FitBreakdownCard from "@/components/interview/FitBreakdownCard";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import EvaluationCard from "@/components/interview/EvaluationCard";
import InterviewError from "@/components/interview/InterviewError";
import { useInterviewStore } from "@/store/interview.store";

const InterviewPage = () => {
    const { session_id } = useParams<InterviewRouteParams>();
    const [isWarningDialogOpen, setIsWarningDialogOpen] = useState<boolean>(true);
    const [pageStatus, setPageStatus] = useState<InterviewPageStatusType>("warning");
    const [fitScore, setFitScore] = useState<number | null>(null);
    const [fitBreakdown, setFitBreakdown] = useState<Record<string, number> | null>(null);
    const [messages, setMessages] = useState<InterviewMessagesType[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<string>("");
    const [questionNumber, setQuestionNumber] = useState<number>(0);
    const [totalQuestions, setTotalQuestions] = useState<number>(0);
    const [totalQuestionsAsked, setTotalQuestionsAsked] = useState<number>(0);
    const [questionType, setQuestionType] = useState<string | null>(null);
    const [answer, setAnswer] = useState<string>("");
    const [evaluation, setEvaluation] = useState<Record<string, unknown> | null>(null);
    const [isWaitingForAI, setIsWaitingForAI] = useState<boolean>(false);
    const wsRef = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const { startInterview, endInterview } = useInterviewStore();

    useEffect(() => {
        if (pageStatus !== "interview") {
            return;
        }

        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        });
    }, [pageStatus, messages]);
    const shouldRenderFitBreakdown = fitScore !== null && fitBreakdown !== null;
    const fitBreakdownSection = shouldRenderFitBreakdown && (
        <FitBreakdownCard fitScore={fitScore ?? undefined} fitBreakdown={fitBreakdown ?? undefined} />
    );

    useEffect(() => {
        return () => {
            endInterview();
            wsRef.current?.close();
        };
    }, []);

    const sendAnswer = () => {
        if (!answer.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || isWaitingForAI) {
            return;
        }
        setMessages((prevMessages: InterviewMessagesType[]) => [
            ...prevMessages,
            {
                role: "user",
                content: answer,
            },
        ]);
        wsRef.current.send(JSON.stringify({ type: "answer", answer }));
        setAnswer("");
        setIsWaitingForAI(true);
    };

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendAnswer();
    };
    const connectToWebSocket = () => {
        setPageStatus("connecting");
        const token = Cookies.get("token");
        if (!token) {
            setPageStatus("error");
            return;
        }
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/api/ws/interview/${session_id}?token=${token}`);
        wsRef.current = ws;
        ws.onopen = () => {
            console.log("WebSocket connection established");
            startInterview();
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received WebSocket message: ", data);

            if (data.type === "fit_score") {
                setFitScore(data.fit_score);
                setFitBreakdown(data.fit_breakdown);
                setPageStatus("fit_score");
            }

            if (data.type === "question") {
                setCurrentQuestion(data.question);
                setQuestionNumber(Math.floor(data.question.order_index));
                setTotalQuestions(data.total_questions);
                setTotalQuestionsAsked(data.question_number);
                setQuestionType(data.question.question_type);
                setMessages((prevMessages: InterviewMessagesType[]) => [
                    ...prevMessages,
                    {
                        role: "ai",
                        content: data.question.question_text,
                    },
                ]);
                setPageStatus("interview");
                setIsWaitingForAI(false);
            }

            if (data.type === "evaluation") {
                setEvaluation(data.final_evaluation);
                setPageStatus("completed");
                setIsWaitingForAI(false);
                endInterview();
                ws.close();
            }

            if (data.type === "error") {
                setPageStatus("error");
                setIsWaitingForAI(false);
                endInterview();
                ws.close();
            }
        };

        ws.onerror = () => {
            setPageStatus("error");
            setIsWaitingForAI(false);
            endInterview();
            ws.close();
        };
        ws.onclose = () => console.log("WebSocket connection closed");
    };

    if (pageStatus === "warning") {
        return (
            <DontCloseWarningDialog
                isWarningDialogOpen={isWarningDialogOpen}
                setIsWarningDialogOpen={setIsWarningDialogOpen}
                onConfirm={connectToWebSocket}
            />
        );
    }

    if (pageStatus === "connecting") {
        return <AnalyzingResumeLoading />;
    }

    if (pageStatus === "fit_score") {
        return <div className="p-6">{fitBreakdownSection}</div>;
    }

    if (pageStatus === "error") {
        return <InterviewError />;
    }
    if (pageStatus === "interview") {
        return (
            <div className="flex h-screen flex-col gap-4 p-4">
                {fitBreakdownSection}
                <div className="flex flex-row items-center justify-between mb-3">
                    <div className="text-white">
                        Question: {questionNumber} of {totalQuestions}
                    </div>
                    <div>
                        <div className="text-white capitalize">
                            Question Type:{" "}
                            {questionType
                                ? questionType === "followup"
                                    ? "Follow-up"
                                    : questionType.replace(/_/g, " ")
                                : "N/A"}
                        </div>
                        <div className="text-white">Total Questions Asked: {totalQuestionsAsked}</div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto text-white">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`mb-4 wrap-break-word p-4 ${message.role === "ai" ? "text-left bg-blue-800 rounded-l-2xl rounded-tr-2xl w-fit max-w-[50%]" : "text-left bg-green-700 rounded-r-2xl rounded-tl-2xl w-fit max-w-[50%] ml-auto"}`}
                        >
                            {message.content}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="flex w-full items-center gap-2 text-white">
                    <Textarea
                        value={answer}
                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setAnswer(event.target.value)}
                        disabled={isWaitingForAI}
                        onKeyDown={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
                            if (event.key === "Enter" && !event.shiftKey) {
                                event.preventDefault();
                                sendAnswer();
                            }
                        }}
                        rows={1}
                        className="h-11 min-h-0 resize-none"
                        placeholder="Enter your answer here"
                    />
                    <Button
                        type="submit"
                        className="w-fit border-zinc-600 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 cursor-pointer"
                        disabled={isWaitingForAI || !answer.trim()}
                    >
                        Send
                    </Button>
                </form>
            </div>
        );
    }
    if (pageStatus === "completed") {
        if (!evaluation) {
            return <AnalyzingResumeLoading />;
        }

        return (
            <div className="flex min-h-screen flex-col gap-4 p-4">
                {fitBreakdownSection}
                <EvaluationCard evaluation={evaluation} />
            </div>
        );
    }

    return null;
};

export default InterviewPage;
