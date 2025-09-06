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

import { InterviewType } from "@/services/Constants";

function FormContainer({ onHandleInputChange , GoToNext}) {
  const [interviewType, setInterviewType] = useState([]);

  useEffect(() => {
    onHandleInputChange("type", interviewType);
  }, [interviewType]);

  return (
    <div className="p-5 bg-white rounded-xl">
      <div>
        <h2 className="text-sm font-medium">Job Position</h2>
        <Input
          placeholder="e.g. Full Stack Developer"
          className="mt-2"
          onChange={(event) =>
            onHandleInputChange("jobPosition", event.target.value)
          }
        />
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Job Description</h2>
        <Textarea
          placeholder="Enter detail job description"
          className="h-[200px] mt-2"
          onChange={(event) =>
            onHandleInputChange("jobDescription", event.target.value)
          }
        />
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
