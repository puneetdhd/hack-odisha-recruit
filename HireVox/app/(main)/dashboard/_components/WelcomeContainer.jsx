"use client"
import { useUser } from '@/app/provider'
import React from 'react'
import Image from 'next/image'

function WelcomeContainer() {
    const {user} = useUser()
    return (
        <div className='bg-white p-3 rounded-xl w-full flex justify-between align-items'>
            <div>
                <h2 className='text-lg font-bold'> Welcome back, {user?.name} </h2>
                <h2 className='text-gray-500'> AI driven Interviews, Hassel-Free Hiring</h2>
            </div>
            {user && <Image src={user?.picture} alt="user avatar" 
                width={50} height={50}
                className='rounded-full'
            />}
        </div>
    )
}

export default WelcomeContainer