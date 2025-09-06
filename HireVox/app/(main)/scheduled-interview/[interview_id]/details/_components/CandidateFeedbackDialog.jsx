import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

function CandidateFeedbackDialog({ candidate }) {

    const url = process.env.NEXT_PUBLIC_HOST_URL + '/' + candidate?.interview_id

    const onSend = () => {
        const subject = encodeURIComponent("HireVox Interview Result");
        const body = candidate?.feedback?.feedback?.recommendationMsg
        window.location.href = `mailto:${candidate?.userEmail}?subject=${subject}&body=${body}`;
    }

    return (
        <Dialog>

            <DialogTrigger asChild className='cursor-pointer'>
                <Button className='text-primary' variant={'outline'}>View Report</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Feedback</DialogTitle>
                    <DialogDescription asChild>
                        <div className='mt-5'>
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-5'>
                                    <h2 className="bg-primary p-3 px-4.5 font-bold text-white rounded-full">{candidate.userName[0]}</h2>
                                    <div>
                                        <h2 className='font-bold'>{candidate?.userName}</h2>
                                        <h2 className='text-sm text-gray-500'>{candidate?.userEmail}</h2>
                                    </div>
                                </div>
                                <div className='flex gap-3 items-center'>
                                    <h2 className='font-bold text-primary text-2xl'>{candidate?.feedback?.feedback?.rating?.totalRating}/10</h2>
                                </div>
                            </div>
                            <div className='mt-5'>
                                <h2 className='font-bold text-2xl'>Skills Assessment</h2>
                                <div className='mt-3 grid grid-cols-2 gap-8'>
                                    <div>
                                        <h2 className='flex justify-between'>Technical Skills <span>{candidate?.feedback?.feedback?.rating?.technicalSkills}/10</span></h2>
                                        <Progress className='mt-3' value={candidate?.feedback?.feedback?.rating?.technicalSkills * 10} />
                                    </div>
                                    <div>
                                        <h2 className='flex justify-between'>Communication Skills <span>{candidate?.feedback?.feedback?.rating?.communication}/10</span></h2>
                                        <Progress className='mt-3' value={candidate?.feedback?.feedback?.rating?.communication * 10} />
                                    </div>
                                    <div>
                                        <h2 className='flex justify-between'>Problem-Solving Skills <span>{candidate?.feedback?.feedback?.rating?.problemSolving}/10</span></h2>
                                        <Progress className='mt-3' value={candidate?.feedback?.feedback?.rating?.problemSolving * 10} />
                                    </div>
                                    <div>
                                        <h2 className='flex justify-between'>Problem-Solving Skills <span>{candidate?.feedback?.feedback?.rating?.experience}/10</span></h2>
                                        <Progress className='mt-3' value={candidate?.feedback?.feedback?.rating?.experience * 10} />
                                    </div>
                                </div>
                            </div>
                            <div className='mt-5'>
                                <h2 className='font-bold text-2xl'>Performance Summary</h2>
                                <p className='mt-3 leading-6 bg-gray-200 p-3 rounded-lg text-gray-600'>{candidate?.feedback?.feedback?.summary}</p>
                            </div>
                            <div className='mt-5'>
                                <h2 className='font-bold text-2xl'>Recommendation Message</h2>
                                <div className={`p-5 rounded-md mt-3 flex items-center justify-between gap-4 ${candidate?.feedback?.feedback?.recommendation == 'Not recommended' ? 'bg-red-100' : 'bg-green-100'}`}>
                                    <p className={`w-full ${candidate?.feedback?.feedback?.recommendation == 'Not recommended' ? 'text-red-800' : 'text-green-800'}`}>{candidate?.feedback?.feedback?.recommendationMsg}</p>
                                    <Button className={`bg-red-800 hover:bg-red-700 w-1/3 ${candidate?.feedback?.feedback?.recommendation == 'Not recommended' ? 'bg-red-800' : 'bg-green-800'}`} onClick={onSend}><Send />Send</Button>
                                </div>
                                
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default CandidateFeedbackDialog