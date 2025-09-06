"use client"
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import React, { useState } from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function LatestInterviewsList() {
  const [InterviewList, setInterviewList] = useState([]);
  return (
    <div className='my-5'>
      <h2 className='font-bold text-2xl'>Previously Created Interviews</h2>
      {InterviewList?.length == 0 &&
        <div className='p-5 flex flex-col gap-3 items-center mt-5'>
          <Video className='h-10 w-10 text-primary' />
          <h2>You don't have any interview created!</h2>
          <Link href="/dashboard/create-interview"><Button>+ Create New Interview</Button></Link>
        </div>
      }
    </div>
  )
}

export default LatestInterviewsList