import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DontCloseWarningDialog = ({
    isWarningDialogOpen,
    setIsWarningDialogOpen,
    onConfirm,
}: {
    isWarningDialogOpen: boolean;
    setIsWarningDialogOpen: (open: boolean) => void;
    onConfirm: () => void;
}) => {
    return (
        <Dialog open={isWarningDialogOpen} onOpenChange={setIsWarningDialogOpen}>
            <DialogContent className="bg-zinc-900 border-zinc-800 [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle className="text-white">Interview Session Warning</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-sm text-zinc-400">
                        Your interview session is now live. Please do not close this tab, refresh the page, or navigate
                        away during the session.
                    </p>
                    <p className="text-sm text-zinc-400">
                        If you exit for any reason, your session cannot be resumed or restarted. Your progress will be
                        lost and the interview will be marked as incomplete
                    </p>
                    <Button
                        type="button"
                        className="flex-1 border-zinc-600 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 cursor-pointer w-full"
                        onClick={() => {
                            setIsWarningDialogOpen(false);
                            onConfirm();
                        }}
                    >
                        I Understand, Let's Begin
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DontCloseWarningDialog;
