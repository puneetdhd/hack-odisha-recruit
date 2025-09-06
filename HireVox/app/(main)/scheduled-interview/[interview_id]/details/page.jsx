"use client"
import { useUser } from '@/app/provider';
import { supabase } from '@/services/supabaseClient';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import InterviewDetailContainer from './_components/InterviewDetailContainer';
import CandidatesList from './_components/CandidatesList';

function InterviewDetail() {

    const { interview_id } = useParams();
    const {user} = useUser()
    const [interviewDetail,setInterviewDetail] = useState()

    useEffect(()=>{
        user && GetInterviewDetail()
    },[user])

    const GetInterviewDetail = async () => {
        const result = await supabase.from('interviews')
            .select(`jobPosition,jobDescription,type,questionList,duration,interview_id,created_at,
                interview-feedback(userEmail,userName,feedback,created_at)`)
            .eq('userEmail', user?.email)
            .eq('interview_id',interview_id)

            setInterviewDetail(result?.data[0])

        console.log(result)
    }

    return (
        <div>
            <h2 className='font-bold text-2xl mt-5'>Interview Details</h2>
            <InterviewDetailContainer interviewDetail={interviewDetail}  />
            <CandidatesList candidateList={interviewDetail?.['interview-feedback']} />
        </div>
    )
}

export default InterviewDetail