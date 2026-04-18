import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ApplicationStatus, InterviewStatus, EvaluationVerdict } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getStatusColor = (status: ApplicationStatus): string => {
  switch (status) {
    case "applied":
      return "bg-blue-500";
    case "interviewing":
      return "bg-yellow-500";
    case "approved":
      return "bg-green-500";
    case "rejected":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const getSessionStatusColor = (status: InterviewStatus): string => {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "in_progress":
      return "bg-blue-500";
    case "completed":
      return "bg-green-500";
    case "incomplete":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export type InterviewRouteParams = {
  session_id: string;
}


export const getFitScoreColor = (fit_score: number): string => {
  if (fit_score >= 90) {
    return "text-emerald-600";
  } else if (fit_score >= 80) {
    return "text-green-500";
  } else if (fit_score >= 70) {
    return "text-lime-500";
  } else if (fit_score >= 60) {
    return "text-yellow-500";
  } else if (fit_score >= 50) {
    return "text-amber-500";
  } else if (fit_score >= 40) {
    return "text-orange-500";
  } else if (fit_score >= 30) {
    return "text-orange-600";
  } else {
    return "text-red-500";
  }
};

export const getVerdictTextColor = (verdict: EvaluationVerdict): string => {
  switch (verdict) {
    case "strong_hire":
      return "text-emerald-600";
    case "hire":
      return "text-green-500";
    case "no_decision":
      return "text-yellow-500";
    case "no_hire":
      return "text-orange-500";
    case "strong_no_hire":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}