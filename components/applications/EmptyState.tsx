import { Resume } from "@/types";
const EmptyState = ({ resumes }: { resumes: Resume[] }) => {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <p className="text-zinc-400">No job applications yet.</p>
            {resumes.length === 0 && <p className="text-zinc-400 text-sm">Upload your first resume to get started.</p>}
        </div>
    );
};

export default EmptyState;
