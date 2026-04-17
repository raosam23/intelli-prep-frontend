"use client";
import { useRouter } from "next/navigation";
import { Card } from "../ui/card";
import { Interview, InterviewStatus } from "@/types";
import { Badge } from "../ui/badge";
import { getSessionStatusColor } from "@/lib/utils";

const SessionCard = ({ session }: { session: Interview }) => {
    const router = useRouter();
    return (
        <Card
            className="cursor-pointer p-5 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 transition-all space-y-4"
            onClick={() => router.push(`/interview/${session.id}`)}
        >
            <div className="flex items-center justify-between">
                <Badge className={`${getSessionStatusColor(session.status)} text-black capitalize w-fit`}>
                    {session.status.replace("_", " ")}
                </Badge>
                <p className="text-zinc-500 text-xs">{new Date(session.created_at).toLocaleDateString()}</p>
            </div>

            <div className="space-y-1">
                <p className="text-white font-semibold capitalize text-lg">{session.interview_type} Interview</p>
                <p className="text-zinc-400 text-sm capitalize">{session.difficulty} Level</p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                <p className="text-zinc-400 text-sm">{session.num_questions} Questions</p>
                {session.focus_area && <p className="text-zinc-500 text-xs">· Focus: {session.focus_area}</p>}
            </div>
        </Card>
    );
};

export default SessionCard;
