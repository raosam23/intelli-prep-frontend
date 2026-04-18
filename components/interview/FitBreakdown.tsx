import { getFitScoreColor } from "@/lib/utils";

const FitBreakdown = ({ label, value }: { label: string; value: number }) => {
    const safeValue = Math.max(0, Math.min(100, value));
    const degrees = (safeValue / 100) * 360;

    return (
        <div className="flex w-full flex-col items-center gap-4">
            <p className="text-lg font-medium text-zinc-400">{label}</p>
            <div
                className={`relative h-24 w-24 rounded-full ${getFitScoreColor(safeValue)}`}
                style={{
                    background: `conic-gradient(from -90deg, currentColor ${degrees}deg, #272a33 ${degrees}deg)`,
                }}
            >
                <div className="absolute inset-2 rounded-full bg-zinc-950" />
                <div className="absolute inset-0 flex items-center justify-center text-3xl font-semibold text-zinc-100">
                    {safeValue}
                </div>
            </div>
        </div>
    );
};

export default FitBreakdown;
