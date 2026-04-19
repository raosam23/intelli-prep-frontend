import { BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const STATUS_COLORS: Record<string, string> = {
    Applied: "#60a5fa",
    Interviewing: "#f59e0b",
    Approved: "#34d399",
    Rejected: "#f87171",
};

const ApplicationStatusBarChart = ({ statusData }: { statusData: { status: string; count: number }[] }) => {
    return (
        <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusData} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                <XAxis dataKey="status" stroke="#71717a" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                <YAxis allowDecimals={false} stroke="#71717a" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                <Tooltip
                    contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }}
                    labelStyle={{ color: "#e4e4e7", fontWeight: 600 }}
                    itemStyle={{ color: "#a1a1aa" }}
                    cursor={false}
                />
                <Bar
                    dataKey="count"
                    activeBar={false}
                    shape={({
                        x,
                        y,
                        width,
                        height,
                        status,
                    }: {
                        x?: number;
                        y?: number;
                        width?: number;
                        height?: number;
                        status?: string;
                    }) => (
                        <rect
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            fill={STATUS_COLORS[status ?? ""] ?? "#a1a1aa"}
                            rx={6}
                            ry={6}
                        />
                    )}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default ApplicationStatusBarChart;
