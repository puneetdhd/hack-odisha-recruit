"use client"
import React, { useContext, useEffect, useState } from 'react'
import { Clock, Info, Loader2Icon, Mic, Video } from 'lucide-react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { supabase } from '@/services/supabaseClient'
import { InterviewDataContext } from '@/context/InterviewDataContext'
import { useRouter } from 'next/navigation'
import QuestionList from '@/app/(main)/dashboard/create-interview/_components/QuestionList'

function Interview() {

    const router = useRouter();

    const { interview_id } = useParams();
    console.log(interview_id)

    const [interviewData, setInterviewData] = useState();

    const [userName, setUserName] = useState();
    const [loading, setLoading] = useState(false)

    const {InterviewInfo,setInterviewInfo}=useContext(InterviewDataContext)

    

    useEffect(() => {
        interview_id && GetInterviewDetails();
    }, [interview_id])

    const GetInterviewDetails = async () => {
        setLoading(true)
        try {
            let { data: interviews, error } = await supabase
                .from('interviews')
                .select("jobPosition,jobDescription,duration,type")
                .eq('interview_id', interview_id)
            setInterviewData(interviews[0])
            setLoading(false)
            if (interviews?.length == 0) {
                toast('Incorrect Interview Link')
                return;
            }

        }
        catch (e) {
            setLoading(false)
            toast('Incorrect Interview Link')
        }
    }

    const onJoinInterview = async() => {
        setLoading(true)
        let { data: interviews, error } = await supabase
            .from('interviews')
            .select('*')
            .eq('interview_id',interview_id);

        console.log(interviews[0]);
        setInterviewInfo({
            userName: userName,
            interviewData: interviews[0]
        });
        router.push('/interview/' + interview_id + '/start')
        setLoading(false)
    }

    return (
        <div className="px-6 md:px-12 lg:px-32 xl:px-48 mt-12">
            <div className="flex flex-col items-center justify-center border rounded-2xl bg-white p-6 md:p-10 max-w-2xl mx-auto shadow-lg">

                {/* Logo/Icon */}
                <div className="bg-blue-500 rounded-full p-3 mb-2">
                    <Mic className="w-5 h-5 text-white" />
                </div>

                {/* Branding */}
                <h1 className="text-2xl font-bold text-gray-800 text-center">
                    <span className="text-blue-500">Hire</span>
                    <span className="text-gray-700">Vox</span>
                </h1>

                {/* Subtitle */}
                <h2 className="mt-2 font-semibold text-lg text-center">
                    AI-Powered Interview Platform
                </h2>

                {/* Image */}
                <Image
                    src="/interview.png"
                    alt="interview"
                    width={500}
                    height={500}
                    className="w-[250px] sm:w-[300px] md:w-[350px] my-6"
                />

                {/* Interview Title */}
                <h2 className="font-bold text-lg md:text-xl mt-2 text-center">
                    {interviewData?.jobPosition}
                </h2>

                {/* Time Info */}
                <h2 className="flex gap-2 items-center text-gray-500 mt-2 text-sm md:text-base">
                    <Clock className="h-4 w-4" /> {interviewData?.duration}
                </h2>

                {/* Input Section */}
                <div className="w-full mt-4">
                    <h2 className="mb-1 text-sm md:text-base">Enter your full name</h2>
                    <Input placeholder="e.g., Smith Jones" className="w-full" onChange={(event) => setUserName(event.target.value)} />
                </div>

                {/* Info Section */}
                <div className="p-4 bg-blue-100 flex gap-3 rounded-lg mt-8 w-full">
                    <Info className="text-primary shrink-0 mt-1" />
                    <div>
                        <h2 className="font-bold text-base md:text-lg">Before you begin</h2>
                        <ul className="mt-1 space-y-1 list-disc pl-5">
                            <li className="text-sm text-primary">
                                Ensure you have a stable internet connection
                            </li>
                            <li className="text-sm text-primary">
                                Test your camera and microphone
                            </li>
                            <li className="text-sm text-primary">
                                Find a quiet place for the interview
                            </li>
                        </ul>
                    </div>
                </div>

                {/* CTA Button */}
                <Button className="mt-5 w-full font-bold flex gap-2 items-center justify-center"
                    disabled={loading || !userName}
                    onClick={() => onJoinInterview()}
                >
                    <Video className="h-4 w-4" />
                    {loading && <Loader2Icon/>}
                    Join Interview
                </Button>
            </div>
        </div>

    )
}

export default Interview