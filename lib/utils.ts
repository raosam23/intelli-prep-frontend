import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ApplicationStatus, InterviewStatus } from "@/types";

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