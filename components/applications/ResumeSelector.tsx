import { Resume } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const ResumeSelector = ({ resumes, selectedResumeId, setSelectedResumeId }: { resumes: Resume[], selectedResumeId: string, setSelectedResumeId: (resumeId: string) => void }) => {
  return (
    <Select onValueChange={setSelectedResumeId} value={selectedResumeId}>
      <SelectTrigger className='bg-zinc-800 border-zinc-700 text-white cursor-pointer'>
        <SelectValue placeholder="Select a resume" />
      </SelectTrigger>
      <SelectContent className='bg-zinc-800 border-zinc-700'>
        {resumes.map((resume: Resume) => (
          <SelectItem key={resume.id} value={resume.id} className='text-white cursor-pointer hover:bg-zinc-700'>
            {resume.file_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default ResumeSelector