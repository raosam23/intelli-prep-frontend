import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const FitScoreLineChart = ({
    fitScoreData,
}: {
    fitScoreData: { label: string; fit_score: number; status: string }[];
}) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fitScoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis dataKey="label" stroke="#71717a" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                <YAxis domain={[0, 100]} stroke="#7171a" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                <Tooltip
                    contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }}
                    labelStyle={{ color: "#e4e4e7" }}
                    itemStyle={{ color: "#a78bfa" }}
                />
                <Line
                    type="monotone"
                    dataKey="fit_score"
                    stroke="#a78bfa"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#a78bfa" }}
                ></Line>
            </LineChart>
        </ResponsiveContainer>
    );
};

export default FitScoreLineChart;
