"use client";
import { Award, Gauge, MessageCircleCheck, Puzzle } from "lucide-react";
import { getVerdictTextColor } from "@/lib/utils";
import { EvaluationVerdict } from "@/types";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const EvaluationCard = ({ evaluation }: { evaluation: Record<string, unknown> }) => {
    const router = useRouter();
    const getDisplayValue = (value: unknown): string | number => {
        if (typeof value === "number" || typeof value === "string") {
            return value;
        }
        return "N/A";
    };
    const evaluationTips = evaluation.improvement_tips as string[] | undefined;
    return (
        <div className="flex flex-col p-6 space-y-4 items-center justify-center bg-zinc-900 border-zinc-800 rounded-3xl">
            <h2 className="font-heading text-2xl text-zinc-100">Evaluation Summary</h2>
            <div className="flex items-stretch p-4 border border-zinc-500 rounded-lg w-full max-w-full gap-4">
                <div className="p-4 w-full md:w-3/4 border border-zinc-600 rounded-lg space-y-4">
                    <h2 className="font-heading text-xl text-zinc-100">Key Performance indicators</h2>
                    <div className="m-4 grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-zinc-800 p-px md:grid-cols-2">
                        <div className="space-y-2 bg-zinc-900 p-8">
                            <p className="text-lg font-medium text-zinc-400">Communication Score: </p>
                            <p className="flex items-center gap-2">
                                <MessageCircleCheck className="text-white shrink-0 h-5 w-5" />
                                <span className="leading-none text-zinc-100">
                                    {getDisplayValue(evaluation.communication_score)}
                                </span>
                            </p>
                        </div>
                        <div className="space-y-2 bg-zinc-900 p-8">
                            <p className="text-lg font-medium text-zinc-400">Problem Solving Score: </p>
                            <p className="flex items-center gap-2">
                                <Puzzle className="text-white shrink-0 h-5 w-5" />
                                <span className="leading-none text-zinc-100">
                                    {getDisplayValue(evaluation.problem_solving_score)}
                                </span>
                            </p>
                        </div>
                        <div className="space-y-2 bg-zinc-900 p-8">
                            <p className="text-lg font-medium text-zinc-400">Technical Score: </p>
                            <p className="flex items-center gap-2">
                                <Gauge className="text-white shrink-0 h-5 w-5" />
                                <span className="leading-none text-zinc-100">
                                    {getDisplayValue(evaluation.technical_score)}
                                </span>
                            </p>
                        </div>
                        <div className="space-y-2 bg-zinc-900 p-8">
                            <p className="text-lg font-medium text-zinc-400">Overall Score: </p>
                            <p className="flex items-center gap-2">
                                <Award className="text-white shrink-0 h-5 w-5" />
                                <span className="leading-none text-zinc-100">
                                    {getDisplayValue(evaluation.overall_score)}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-4 w-full md:w-1/4 border border-zinc-600 rounded-lg space-y-4">
                    <h2 className="font-heading text-xl text-zinc-100">Application Verdict</h2>
                    <div className="border border-zinc-800 rounded-lg p-4 space-y-2">
                        <p
                            className={`capitalize text-3xl font-bold ${getVerdictTextColor(evaluation.verdict as EvaluationVerdict)}`}
                        >
                            {getDisplayValue(evaluation.verdict).toLocaleString().replace(/_/g, " ")}
                        </p>
                        <p className="text-sm text-zinc-400">Recommendation based on current evaluation</p>
                    </div>
                </div>
            </div>
            <div className="w-full space-y-2 border border-zinc-500 rounded-lg p-4">
                <h2 className="font-heading text-xl text-zinc-100">Improvement Tips</h2>
                <div className="p-4 border border-zinc-600 rounded-lg space-y-4">
                    {evaluationTips && evaluationTips.length > 0 ? (
                        <ul className="list-inside list-disc space-y-2">
                            {evaluationTips.map((tip, index) => (
                                <li key={index} className="text-zinc-400">
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-zinc-400">No specific improvement tips available.</p>
                    )}
                </div>
                <div className="flex w-full justify-end mt-4">
                    <Button
                        className="w-fit border border-zinc-600 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 cursor-pointer"
                        onClick={() => router.push("/applications")}
                    >
                        Back to Applications
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EvaluationCard;
