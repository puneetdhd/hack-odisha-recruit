import { Button } from '@/components/ui/button'
import { ArrowRight, Copy, Send } from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'

function InterviewCard({ interview, sendLink=false }) {
    const url = process.env.NEXT_PUBLIC_HOST_URL + '/' + interview?.interview_id
    const copyLink = () => {
        navigator.clipboard.writeText(url);
        toast('Copied')
    }

    const onSend = () => {
        const subject = encodeURIComponent("HireVox Interview Link");
        const body = encodeURIComponent("Here is your interview link: " + url);
        window.location.href = `mailto:${interview.userEmail}?subject=${subject}&body=${body}`;
    }

    return (
        <div className="p-6 bg-white rounded-xl border shadow-sm hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-2">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">{interview?.jobPosition?.[0] || '?'}</span>
                </div>
                <span className="text-xs text-gray-400 font-medium">{moment(interview?.created_at).format('DD MMM yyyy')}</span>
            </div>
            <h2 className="mt-2 font-semibold text-lg text-gray-900 truncate">{interview?.jobPosition}</h2>
            <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                <span>{interview?.duration}</span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">{interview['interview-feedback']?.length} Candidates</span>
            </div>
            {sendLink && (
                <div className="flex items-center justify-center gap-3 w-full mt-6">
                    <Button variant="outline" className="w-1/2 border-gray-300 hover:border-blue-500 transition-colors" onClick={copyLink}>
                        <Copy className="mr-1 w-4 h-4" />Copy Link
                    </Button>
                    <Button className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white transition-colors" onClick={onSend}>
                        <Send className="mr-1 w-4 h-4" />Send
                    </Button>
                </div>
            )}
            <Link href={'/scheduled-interview/'+interview?.interview_id+'/details'}>
                <Button className="mt-6 w-full border-gray-300 hover:border-blue-500 transition-colors flex items-center justify-center gap-2" variant="outline">
                    View Details <ArrowRight className="w-4 h-4"/>
                </Button>
            </Link>
        </div>
    )
}

export default InterviewCard
