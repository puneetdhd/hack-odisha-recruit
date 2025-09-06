import React from 'react'
import { ArrowLeft, Check, Clock, Copy, Mail, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { List } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

function InterviewLink({ interview_id, formData }) {

    const url = process.env.NEXT_PUBLIC_HOST_URL + '/' + interview_id

    const GetInterviewUrl = () => {
        return url
    }

    const onCopyLink = async() => {
        await navigator.clipboard.writeText(url);
        toast('Link Copied')
    }

    return (
        <div className="flex flex-col items-center min-h-screen p-6">
            <div className="text-center max-w-md">
                {/* Success Icon */}
                <div className="mb-8">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <Check className="w-10 h-10 text-white stroke-[3]" />
                    </div>
                </div>

                {/* Main Heading */}
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Your AI Interview is Ready!
                </h1>

                {/* Subtitle */}
                <p className="text-gray-600 text-lg leading-relaxed">
                    Share this link with your candidates to start the interview process
                </p>
            </div>
            <div className='w-full bg-white p-6 rounded-lg shadow-sm mt-8'>
                <div className='flex justify-between items-center'>
                    <h2 className='font-bold'>Interview link</h2>
                    <h2 className='p-1 px-2 text-primary bg-blue-50 rounded'>Valid for 30 Days</h2>
                </div>
                <div className='mt-3 flex gap-3 items-center'>
                    <Input defaultValue={GetInterviewUrl()} disabled={true} />
                    <Button onClick={()=>onCopyLink()}><Copy /> Copy Link </Button>
                </div>
                <hr className='my-5' />

                <div className='flex gap-5'>
                    <h2 className='text-sm text-gray-500 flex gap-2 items-center'><Clock className='h-4 w-4' />{formData?.duration}</h2>
                    <h2 className='text-sm text-gray-500 flex gap-2 items-center'><List className='h-4 w-4' />10 questions</h2>
                    {/* <h2 className='text-sm text-gray-500 flex gap-2 items-center'><Clock className='h-4 w-4'/>{formData.duration}</h2> */}
                </div>

            </div>
            <div className='mt-7 bg-white p-5 rounded-lg w-full'>
                <h2 className='font-bold'>Share Via</h2>
                <div className='flex justify-between items-center gap-5 mt-2'>
                    <Button variant={'outline'} className=''><Mail />Email</Button>
                    <Button variant={'outline'} className=''><Mail />Slack</Button>
                    <Button variant={'outline'} className=''><Mail />WhatsApp</Button>
                </div>
            </div>
            <div className='flex w-full gap-5 justify-between mt-6'>
                <Link href={'/dashboard'}>
                    <Button variant={'outline'}><ArrowLeft />Back to Dashboard</Button>
                </Link>
                <Link href={'/dashboard/create-interview'}>
                    <Button><Plus />Create New Interview</Button>
                </Link>
            </div>
        </div>
    )
}

export default InterviewLink