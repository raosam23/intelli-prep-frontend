import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
const InterviewFeedbackandFocusAreaDialog = ({
    title,
    content,
    isDialogOpen,
    setIsDialogOpen,
}: {
    title: "feedback" | "focus area";
    content: string;
    isDialogOpen: boolean;
    setIsDialogOpen: (isOpen: boolean) => void;
}) => {
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-zinc-900 border-zinc-800 [&>button]:text-white [&>button]:hover:text-zinc-500 [&>button]:cursor-pointer">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {title === "feedback" ? "Interviewer Feedback" : "Focus Area"}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 p-4 border border-zinc-800 rounded-lg">
                    <p className="text-sm text-left text-zinc-400 whitespace-pre-wrap">{content}</p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InterviewFeedbackandFocusAreaDialog;
