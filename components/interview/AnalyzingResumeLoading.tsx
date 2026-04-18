import { LoaderCircle } from "lucide-react";

const AnalyzingResumeLoading = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
            <LoaderCircle className="animate-spin text-white" size={32} />
            <p className="text-sm text-zinc-400">
                Analyzing your resume and job description and generating interview questions...
            </p>
        </div>
    );
};

export default AnalyzingResumeLoading;
