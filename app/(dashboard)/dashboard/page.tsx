"use client";
import { useEffect } from "react";
import { useAnalyticsStore } from "@/store/analytics.store";
import { APIError } from "@/lib/error";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import OverallStatCard from "@/components/dashboard/OverallStatCard";
import FitScoreLineChart from "@/components/dashboard/FitScoreLineChart";
import InterviewPerformanceLineChart from "@/components/dashboard/InterviewPerformanceLineChart";
import ApplicationStatusBarChart from "@/components/dashboard/ApplicationStatusBarChart";
import AverageScoreCards from "@/components/dashboard/AverageScoreCards";

const DashboardPage = () => {
    const { dashboard, isLoading, fetchDashboard } = useAnalyticsStore();
    useEffect(() => {
        const loadDashboard = async () => {
            try {
                await fetchDashboard();
            } catch (error: unknown) {
                if (error instanceof APIError) {
                    toast.error(`Error fetching dashboard analytics: ${error.message}`);
                    console.error("Error fetching dashboard analytics: ", error.details);
                } else {
                    toast.error("An unexpected error occurred while fetching dashboard analytics.");
                    console.error("Unexpected error fetching dashboard analytics: ", error);
                }
            }
        };
        loadDashboard();
    }, []);
    const stats = dashboard?.overall_stats;
    let message: string | null = null;
    if (stats?.total_applications === 0 && stats?.total_interviews_completed === 0) {
        message =
            "You haven't created any applications and haven't completed any interviews yet. Create a job application and start an interview to see your performance analytics here.";
    }
    if (stats?.total_applications && stats.total_applications > 0 && stats?.total_interviews_completed === 0) {
        message =
            "You haven't completed any interviews yet. Start an interview to see your performance analytics here.";
    }
    const fitScoreData = dashboard?.fit_score_trend.map((entry) => ({
        label: new Date(entry.created_at).toLocaleDateString(),
        fit_score: entry.fit_score,
        status: entry.status,
    }));
    const performanceData = dashboard?.interview_performance_trend.map((entry, index) => ({
        label: `Session ${index + 1}`,
        communication: entry.communication_score,
        technical: entry.technical_score,
        problem_solving: entry.problem_solving_score,
        overall: entry.overall_score,
    }));
    const statusData = Object.entries(dashboard?.application_by_status || {}).map(([key, value]) => ({
        status: key.charAt(0).toUpperCase() + key.slice(1),
        count: value,
    }));

    const statCards = [
        { label: "Total Applications", value: dashboard?.overall_stats.total_applications ?? "N/A" },
        { label: "Interviews Completed", value: dashboard?.overall_stats.total_interviews_completed ?? "N/A" },
        { label: "Average Fit Score", value: dashboard?.overall_stats.average_fit_score ?? "N/A" },
        { label: "Average Overall Score", value: dashboard?.overall_stats.average_overall_score ?? "N/A" },
    ];

    const scoreCards = [
        { label: "Communication", value: dashboard?.average_scores.communication_score ?? 0, color: "text-blue-400" },
        { label: "Technical", value: dashboard?.average_scores.technical_score ?? 0, color: "text-green-400" },
        {
            label: "Problem Solving",
            value: dashboard?.average_scores.problem_solving_score ?? 0,
            color: "text-amber-400",
        },
    ];

    if (message) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6">
                <p className="text-sm text-zinc-400">{message}</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoaderCircle className="animate-spin text-white" size={32} />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-white text-2xl font-bold">Dashboard</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-6">
                {statCards.map((stat) => (
                    <OverallStatCard key={stat.label} label={stat.label} value={stat.value} />
                ))}
            </div>
            <div className="mt-4">
                <h2 className="text-white text-xl font-semibold mb-4">Fit Score Trend</h2>
                <div className="h-64">
                    <FitScoreLineChart fitScoreData={fitScoreData ?? []} />
                </div>
            </div>
            <div className="mt-4">
                <h2 className="text-white text-xl font-semibold mb-4">Interview Performance Trend</h2>
                <div className="h-64">
                    <InterviewPerformanceLineChart performanceData={performanceData ?? []} />
                </div>
            </div>
            <div className="mt-4">
                <h2 className="text-white text-xl font-semibold mb-4">Application Status</h2>
                <div className="h-64">
                    <ApplicationStatusBarChart statusData={statusData ?? []} />
                </div>
            </div>
            <div className="mt-4">
                <h2 className="text-white text-xl font-semibold mb-4">Average Score Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {scoreCards.map((score) => (
                        <AverageScoreCards key={score.label} scoreCard={score} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
