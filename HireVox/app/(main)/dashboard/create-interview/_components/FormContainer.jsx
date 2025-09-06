// import React, { useEffect, useState } from 'react'
// import { Input } from '@/components/ui/input'
// import { Textarea } from "@/components/ui/textarea"
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import { InterviewType } from '@/services/Constants'
// import { ArrowRight } from 'lucide-react'
// import { Button } from '@/components/ui/button'

// function FormContainer({onHandleInputChange}) {

//     const [interviewType,setInterviewType] = useState([]);

//     useEffect(()=>{
//         if (interviewType){
//             onHandleInputChange('type',interviewType)
//         }
//     },[interviewType])

//     return (
//         <div className='p-5 bg-white rounded-xl'>
//             <div>
//                 <h2 className='text-sm font-medium'>Job Position</h2>
//                 <Input placeholder="e.g. Full Stack Developer"
//                     className="mt-2"
//                     onChange={(event) => onHandleInputChange('jobPosition',event.target.value)} 
//                 />
//             </div>
//             <div className='mt-5'>
//                 <h2 className='text-sm font-medium'>Job Description</h2>
//                 <Textarea placeholder="Enter detail job description" 
//                     className='h-[200px] mt-2'
//                     onChange={(event) => onHandleInputChange('jobDescription',event.target.value)} 
//                 />
//             </div>
//             <div className='mt-5'>
//                 <h2 className='text-sm font-medium'>Interview Duration</h2>
//                 <Select onValueChange={(value)=>onHandleInputChange('duration',value)}>
//                     <SelectTrigger className="w-full mt-2">
//                         <SelectValue placeholder="Select Duration" />
//                     </SelectTrigger>
//                     <SelectContent>
//                         <SelectItem value="5 Min">5 Min</SelectItem>
//                         <SelectItem value="15 Min">15 Min</SelectItem>
//                         <SelectItem value="30 Min">30 Min</SelectItem>
//                         <SelectItem value="45 Min">45 Min</SelectItem>
//                         <SelectItem value="60 Min">60 Min</SelectItem>
//                     </SelectContent>
//                 </Select>
//             </div>
//             <div className='mt-5'>
//                 <h2 className='text-sm font-medium'>Interview Type</h2>
//                 <div className='flex gap-3 flex-wrap mt-2'>
//                     {InterviewType.map((type,index)=>(
//                         <div key={index} className='flex items-center cursor-pointer gap-3 p-1 px-2 bg-white border border-gray-300 rounded-2xl hover:bg-secondary' onChange={()=>setInterviewType(prev=>[...prev,type.title])}>
//                             <type.icon />
//                             <span>{type.title}</span>
//                         </div>
//                     ))}
//                 </div>
                
//             </div>
//             <div className='mt-7 flex justify-end'>
//                 <Button>Generate Question <ArrowRight /></Button>
//             </div>
//         </div>
//     )
// }

// export default FormContainer

"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import useDebounce from '@/hooks/useDebounce';
import { z } from 'zod';
import { Sparkles } from 'lucide-react';
import axios from "axios";

import { InterviewType } from "@/services/Constants";

function FormContainer({ onHandleInputChange , GoToNext}) {
  const [interviewType, setInterviewType] = useState([]);
  const [jobPosition, setJobPosition] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const debouncedJobPosition = useDebounce(jobPosition, 400);
  const debouncedJobDescription = useDebounce(jobDescription, 400);

  // Zod schema for field validation
  const jobPositionSchema = z.string().min(2, 'Job position required');
  const jobDescriptionSchema = z.string().min(10, 'Job description required');

  useEffect(() => {
    onHandleInputChange("type", interviewType);
  }, [interviewType]);

  useEffect(() => {
    onHandleInputChange('jobPosition', debouncedJobPosition);
  }, [debouncedJobPosition]);

  useEffect(() => {
    onHandleInputChange('jobDescription', debouncedJobDescription);
  }, [debouncedJobDescription]);

  // Validate on change
  const handleJobPositionChange = (e) => {
    const value = e.target.value;
    setJobPosition(value);
    const result = jobPositionSchema.safeParse(value);
    if (!result.success) {
      // Optionally show error (e.g. toast(result.error.errors[0].message))
    }
  };

  const handleJobDescriptionChange = (e) => {
    const value = e.target.value;
    setJobDescription(value);
    const result = jobDescriptionSchema.safeParse(value);
    if (!result.success) {
      // Optionally show error (e.g. toast(result.error.errors[0].message))
    }
  };

  // Handler for auto-generating job description
  const [loadingAutoGen, setLoadingAutoGen] = useState(false);

  const handleAutoGenerate = async () => {
    try {
      setLoadingAutoGen(true);
      const param = jobDescription ? jobDescription : jobPosition;
      const response = await axios.post('/api/ai-model-3', { jobDescription: param });
      const structuredDescription = response.data.structuredJobDescription;
      setJobDescription(structuredDescription);
      onHandleInputChange('jobDescription', structuredDescription);
    } catch (error) {
      // Optionally show error (e.g. toast('Failed to auto-generate job description'))
    } finally {
      setLoadingAutoGen(false);
    }
  };

  return (
    <div className="p-5 bg-white rounded-xl">
      <div>
        <h2 className="text-sm font-medium">Job Position</h2>
        <Input
          placeholder="e.g. Full Stack Developer"
          className="mt-2"
          value={jobPosition}
          onChange={handleJobPositionChange}
        />
      </div>

      <div className="mt-5 flex items-start gap-2">
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium">Job Description</h2>
            <button
              type="button"
              onClick={handleAutoGenerate}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-2 py-1 rounded-md shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-60"
              disabled={loadingAutoGen}
            >
              <Sparkles className={`w-4 h-4 ${loadingAutoGen ? 'animate-spin' : 'animate-pulse'}`} />
              {loadingAutoGen ? 'Generating...' : 'Auto-Generate'}
            </button>
          </div>
          <Textarea
            placeholder="Enter detail job description"
            className="h-[200px] mt-2"
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            disabled={loadingAutoGen}
          />
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Duration</h2>
        <Select
          onValueChange={(value) => onHandleInputChange("duration", value)}
        >
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5 Min">5 Min</SelectItem>
            <SelectItem value="15 Min">15 Min</SelectItem>
            <SelectItem value="30 Min">30 Min</SelectItem>
            <SelectItem value="45 Min">45 Min</SelectItem>
            <SelectItem value="60 Min">60 Min</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Type</h2>
        <div className="flex gap-3 flex-wrap mt-2">
          {InterviewType.map((type, index) => (
            <div
              key={index}
              className={`flex items-center cursor-pointer gap-3 p-1 px-2 bg-white border border-gray-300 rounded-2xl hover:bg-secondary ${interviewType.includes(type.title) && 'bg-blue-50 text-primary'}`}
              onClick={() =>
                setInterviewType((prev) =>
                  prev.includes(type.title)
                    ? prev.filter((t) => t !== type.title) // toggle selection
                    : [...prev, type.title]
                )
              }
            >
              <type.icon />
              <span>{type.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7 flex justify-end" onClick={()=>GoToNext()}>
        <Button>
          Generate Question <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

export default FormContainer;
