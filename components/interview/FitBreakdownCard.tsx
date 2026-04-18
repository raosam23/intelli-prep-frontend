import { getFitScoreColor } from "@/lib/utils";
import FitBreakdown from "./FitBreakdown";
import { Card } from "../ui/card";

const FitBreakdownCard = ({ fitScore, fitBreakdown }: { fitScore?: number; fitBreakdown?: Record<string, number> }) => {
    return (
        <Card className="flex flex-col space-y-1 items-center justify-center bg-zinc-950 border-zinc-800">
            <div className="p-4 bg-zinc-900 border border-zinc-800 w-full max-w-full flex flex-col items-center justify-center rounded-lg">
                <h2 className="font-heading text-2xl text-zinc-100">Fit Score</h2>
                <p className={`font-bold text-7xl ${getFitScoreColor(fitScore ?? 0)}`}>{fitScore ?? "N/A"}</p>
            </div>
            <h2 className="font-heading text-lg text-zinc-100">Fit Breakdown</h2>
            <ul className="grid w-full list-none grid-cols-1 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-0 md:grid-cols-3">
                {Object.entries(fitBreakdown || {}).map(([key, value], index, arr) => (
                    <li
                        key={key}
                        className={`flex justify-center px-8 py-3 text-zinc-400 border-zinc-800 ${index < arr.length - 1 ? "border-b md:border-b-0 md:border-r" : ""}`}
                    >
                        <FitBreakdown label={key.replace(/_/g, " ")} value={value} />
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default FitBreakdownCard;
