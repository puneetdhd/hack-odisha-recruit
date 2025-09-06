"use client"
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Progress } from '@/components/ui/progress'
import FormContainer from './_components/FormContainer'
import QuestionList from './_components/QuestionList'
import { toast } from 'sonner'
import InterviewLink from './_components/InterviewLink'
import { useUser } from '@/app/provider'
import { z } from 'zod';

function CreateInterview() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState();
  const [interviewId,setInterviewId] = useState();
  const {user} = useUser()

  // Zod schema for validation
  const interviewSchema = z.object({
    jobPosition: z.string().min(2, 'Job position required'),
    jobDescription: z.string().min(10, 'Job description required'),
    duration: z.string().min(1, 'Duration required'),
    type: z.array(z.string()).min(1, 'Select at least one interview type'),
  });

  const onHandleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    console.log("formData: ", formData)

  }

  const onGoToNext = () => {
    if (user?.credits<=0){
      toast('please add credits')
      return 
    }
    // Zod validation
    const result = interviewSchema.safeParse(formData);
    if (!result.success) {
      toast(result.error.errors[0].message);
      return;
    }
    setStep(step + 1)
  }
  const onCreateLink=(interview_id)=>{
    setInterviewId(interview_id)
    setStep(step+1)
  }

  return (
    <div className='mt-10 px-10 md:px-24 lg:px-44 xl:px-56'>
      <div className='flex gap-5 items-center'>
        <ArrowLeft onClick={() => router.back()} className='cursor-pointer' />
        <h2 className='font-bold text-2xl'>Create New Interview</h2>
      </div>
      <Progress value={step * 33.33} className='my-5' />
      {step == 1 ? <FormContainer onHandleInputChange={onHandleInputChange} GoToNext={() => onGoToNext()} />
        : step == 2 ? <QuestionList formData={formData} onCreateLink={(interview_id)=>onCreateLink(interview_id)} /> : 
        step==3?<InterviewLink interview_id={interviewId} formData={formData} />:null}
    </div>
  )
}

export default CreateInterview
