"use client"
import React from 'react'
import { Mic } from 'lucide-react'

function InterviewHeader() {
    return (
        <div className='w-full shadow-sm'>
            <div className="text-left">
                <div className="flex items-center mb-4 p-4 shadow-md">
                    <div className="bg-blue-500 rounded-full p-3 mr-3">
                        <Mic className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800">
                        <span className="text-blue-500">Hire</span>
                        <span className="text-gray-700">Vox</span>
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default InterviewHeader