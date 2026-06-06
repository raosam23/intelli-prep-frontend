import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
const InterviewInterruptedDialog = ({
    isInterruptDialogOpen,
    setIsInterruptDialogOpen,
    onConfirm,
}: {
    isInterruptDialogOpen: boolean;
    setIsInterruptDialogOpen: (open: boolean) => void;
    onConfirm: (quit: boolean) => void;
}) => {
    return (
        <Dialog open={isInterruptDialogOpen} onOpenChange={setIsInterruptDialogOpen}>
            <DialogContent className="bg-zinc-900 border-zinc-800 [&>button]:hidden w-full max-w-[calc(100vw-2rem)] sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white">Interview Session Interrupted</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 w-full">
                    <p className="text-sm text-zinc-400 wrap-break-word whitespace-normal w-full">
                        Do you really want to exit the interview session? If you exit, your session cannot be resumed or
                        restarted. Your progress will be lost and the interview will be marked as incomplete
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        <Button
                            type="button"
                            className="w-full min-w-0 flex items-center justify-center text-center px-4 py-2 min-h-10 leading-tight border-red-900 bg-red-950 text-red-400 hover:text-red-200 hover:bg-red-900 cursor-pointer"
                            onClick={() => {
                                setIsInterruptDialogOpen(false);
                                onConfirm(true);
                            }}
                        >
                            Quit Interview Session
                        </Button>
                        <Button
                            type="button"
                            className="w-full min-w-0 flex items-center justify-center text-center px-4 py-2 min-h-10 leading-tight border-zinc-600 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 cursor-pointer"
                            onClick={() => {
                                setIsInterruptDialogOpen(false);
                                onConfirm(false);
                            }}
                        >
                            Continue Interview Session
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InterviewInterruptedDialog;
