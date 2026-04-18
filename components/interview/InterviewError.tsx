import React from "react";

const InterviewError = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold text-red-500 mb-4">An error occurred</h1>
            <p className="text-zinc-400">
                There was an issue connecting to the interview session. Please try again later.
            </p>
        </div>
    );
};

export default InterviewError;
