import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const InterviewPerformanceLineChart = ({
    performanceData,
}: {
    performanceData: {
        label: string;
        communication: number;
        technical: number;
        problem_solving: number;
        overall: number;
    }[];
}) => {
    const PERF_LINES = [
        { key: "communication", color: "#60a5fa" },
        { key: "technical", color: "#34d399" },
        { key: "problem_solving", color: "#f59e0b" },
        { key: "overall", color: "#f472b6" },
    ];
    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis dataKey="label" stroke="#71717a" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                <YAxis domain={[0, 100]} stroke="#71717a" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                <Tooltip
                    contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }}
                    labelStyle={{ color: "#e4e4e7", fontWeight: 600 }}
                    cursor={{ stroke: "#3f3f46", strokeWidth: 1 }}
                />
                <Legend wrapperStyle={{ color: "#a1a1aa", fontSize: 12 }} />
                {PERF_LINES.map(({ key, color }) => (
                    <Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={{ r: 3 }} />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default InterviewPerformanceLineChart;
