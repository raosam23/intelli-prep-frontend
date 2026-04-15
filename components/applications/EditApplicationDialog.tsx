"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { APIError } from "@/lib/error";
import { toast } from "sonner";
import { ApplicationStatus } from "@/types";
import { useApplicationStore } from "@/store/application.store";

const EditApplicationDialog = ({
    isDialogOpen,
    setIsDialogOpen,
    applicationId,
    applicationStatus,
    applicationJdRawText,
    onSubmitStart,
}: {
    isDialogOpen: boolean;
    setIsDialogOpen: (isOpen: boolean) => void;
    applicationId: string;
    applicationStatus: ApplicationStatus;
    applicationJdRawText: string;
    onSubmitStart?: () => void;
}) => {
    const { updateApplication, isLoading, fetchApplicationById } = useApplicationStore();
    const [status, setStatus] = useState<ApplicationStatus>(applicationStatus);
    const [jdRawText, setJdRawText] = useState<string>(applicationJdRawText);
    const handleOnSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmitStart?.();
        try {
            await updateApplication(applicationId, status, jdRawText);
            await fetchApplicationById(applicationId);
            toast.success("Application updated successfully");
        } catch (error: unknown) {
            if (error instanceof APIError) {
                console.error("Error in updating application: ", error.message);
                toast.error(error.message);
            } else {
                toast.error("Unknown error occurred while updating application");
            }
        } finally {
            setIsDialogOpen(false);
        }
    };

    useEffect(() => {
        setStatus(applicationStatus);
        setJdRawText(applicationJdRawText);
    }, [applicationStatus, applicationJdRawText, isDialogOpen]);

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-zinc-900 border-zinc-800 [&>button]:text-white [&>button]:hover:text-zinc-500 [&>button]:cursor-pointer">
                <DialogHeader>
                    <DialogTitle className="text-white">Edit Application</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={handleOnSubmit}
                    className="space-y-4 text-white text-sm font-medium border border-zinc-800 rounded-lg p-4"
                >
                    <div className="flex items-center justify-between space-x-2">
                        <Label className="text-md font-medium">Status</Label>
                        <Select onValueChange={(value) => setStatus(value as ApplicationStatus)} value={status}>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white w-fit">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                <SelectItem className="text-white hover:bg-zinc-700" value={"applied"}>
                                    Applied
                                </SelectItem>
                                <SelectItem className="text-white hover:bg-zinc-700" value={"interviewing"}>
                                    Interviewing
                                </SelectItem>
                                <SelectItem className="text-white hover:bg-zinc-700" value={"approved"}>
                                    Approved
                                </SelectItem>
                                <SelectItem className="text-white hover:bg-zinc-700" value={"rejected"}>
                                    Rejected
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-md font-medium">Job Description</Label>
                        <Textarea
                            value={jdRawText}
                            onChange={(e) => setJdRawText(e.target.value)}
                            rows={8}
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 min-h-32 resize-y"
                        />
                    </div>
                    <Button
                        variant="outline"
                        type="submit"
                        disabled={isLoading}
                        className="w-full border-zinc-600 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 cursor-pointer"
                    >
                        {isLoading ? "Updating..." : "Save Changes"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditApplicationDialog;
