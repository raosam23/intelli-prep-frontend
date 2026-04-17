"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { APIError } from "@/lib/error";
import { toast } from "sonner";
import { useInterviewStore } from "@/store/interview.store";
import { DifficultyLevel, InterviewType } from "@/types";

const CreateSessionDialog = ({
    isDialogOpen,
    setIsDialogOpen,
    jobApplicationId,
    onSubmitStart,
}: {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    jobApplicationId: string;
    onSubmitStart?: () => void;
}) => {
    const { fetchSessionsByApplication, createSession, isLoading } = useInterviewStore();
    const [numQuestions, setNumQuestions] = useState<number | null>(5);
    const [difficulty, setDifficulty] = useState<DifficultyLevel | "">("");
    const [interviewType, setInterviewType] = useState<InterviewType | "">("");
    const [focusArea, setFocusArea] = useState<string>("");
    const handleCreateSession = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmitStart?.();

        if (difficulty === "" || interviewType === "") {
            toast.error("Please select a difficulty and interview type before creating a session.");
            return;
        }
        if (!numQuestions || numQuestions < 1) {
            toast.error("Please enter a valid number of questions (minimum 1).");
            return;
        }
        try {
            await createSession({
                job_application_id: jobApplicationId,
                num_questions: numQuestions,
                difficulty,
                interview_type: interviewType,
                focus_area: focusArea || undefined,
            });
            toast.success("Interview session created successfully!");
            await fetchSessionsByApplication(jobApplicationId);
        } catch (error: unknown) {
            if (error instanceof APIError) {
                console.error("Error in creating interview session: ", error.message);
                toast.error(error.message);
            } else {
                console.error("Unknown error in creating interview session: ", String(error));
                toast.error("An unknown error occurred while creating the interview session.");
            }
        } finally {
            setIsDialogOpen(false);
            setNumQuestions(5);
            setDifficulty("");
            setInterviewType("");
            setFocusArea("");
        }
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-zinc-900 border-zinc-800 [&>button]:text-white [&>button]:hover:text-zinc-500 [&>button]:cursor-pointer">
                <DialogHeader>
                    <DialogTitle className="text-white">Create Interview Session</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={handleCreateSession}
                    className="space-y-4 text-white text-sm font-medium border border-zinc-800 rounded-lg p-4"
                >
                    <div className="space-x-2 flex items-center justify-between">
                        <label htmlFor="numQuestions" className="text-sm font-medium">
                            Number of Questions
                        </label>
                        <Input
                            id="numQuestions"
                            type="number"
                            value={numQuestions ?? ""}
                            name="numQuestions"
                            min={1}
                            step={1}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                const value = event.target.value;
                                if (value === "") {
                                    setNumQuestions(null);
                                    return;
                                }
                                const numericValue = parseInt(value, 10);
                                if (!isNaN(numericValue) && numericValue > 0) {
                                    setNumQuestions(numericValue);
                                }
                            }}
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 w-fit p-1 rounded-lg active:border-zinc-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>
                    <div className="space-x-2 flex items-center justify-between">
                        <Label htmlFor="difficulty" className="text-sm font-medium">
                            Difficulty
                        </Label>
                        <Select onValueChange={(value) => setDifficulty(value as DifficultyLevel)} value={difficulty}>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                                <SelectItem className="text-white hover:bg-zinc-700" value="junior">
                                    Junior
                                </SelectItem>
                                <SelectItem className="text-white hover:bg-zinc-700" value="mid">
                                    Mid
                                </SelectItem>
                                <SelectItem className="text-white hover:bg-zinc-700" value="senior">
                                    Senior
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-x-2 flex items-center justify-between">
                        <Label htmlFor="interviewType" className="text-sm font-medium">
                            Interview Type
                        </Label>
                        <Select
                            onValueChange={(value) => setInterviewType(value as InterviewType)}
                            value={interviewType}
                        >
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                <SelectValue placeholder="Select interview type" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                                <SelectItem className="text-white hover:bg-zinc-700" value="technical">
                                    Technical
                                </SelectItem>
                                <SelectItem className="text-white hover:bg-zinc-700" value="behavioral">
                                    Behavioral
                                </SelectItem>
                                <SelectItem className="text-white hover:bg-zinc-700" value="managerial">
                                    Managerial
                                </SelectItem>
                                <SelectItem className="text-white hover:bg-zinc-700" value="mixed">
                                    Mixed
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-x-2 flex items-center justify-between">
                        <Label htmlFor="focusArea" className="text-sm font-medium">
                            Focus Area
                        </Label>
                        <Input
                            id="focusArea"
                            type="text"
                            value={focusArea}
                            name="focusArea"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setFocusArea(event.target.value);
                            }}
                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 w-fit p-1 rounded-lg active:border-zinc-300"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full border-zinc-600 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 cursor-pointer"
                    >
                        Create Session
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateSessionDialog;
