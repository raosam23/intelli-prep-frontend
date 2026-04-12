"use client";
import { useRouter } from 'next/navigation';
import { Card } from '../ui/card'
import { ApplicationStatus, JobApplication } from '@/types';
import { Badge } from '../ui/badge';

const ApplicationCard = ({ application }: { application: JobApplication }) => {
    const getStatusColor = (status: ApplicationStatus): string => {
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
    }
    const router = useRouter();
    return (
        <Card
            className="cursor-pointer p-4 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 transition space-y-3"
            onClick={() => router.push(`/applications/${application.id}`)}>
            <Badge className={`${getStatusColor(application.status)} text-white`}>{application.status}</Badge>
            <p className='text-white font-medium'>Fit Score: {application.fit_score ?? "Not analyzed yet"}</p>
            <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">{application.jd_raw_text.length > 100 ? application.jd_raw_text.substring(0, 100) + "..." : application.jd_raw_text}</p>
                <p className="text-sm text-zinc-400">{new Date(application.created_at).toLocaleDateString()}</p>
            </div>
        </Card>
    )
}

export default ApplicationCard