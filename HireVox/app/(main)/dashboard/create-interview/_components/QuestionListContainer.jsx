import React from 'react'

function QuestionListContainer({ questionList }) {
    return (
        <div>
            <h2 className='font-bold text-lg mb-5'>Generated Interview Questions:</h2>
            <div className='p-5 border border-gray-300 rounded-xl space-y-3 bg-white'>
                {questionList.map((item, index) => (
                    <div key={index} className='p-3 border border-gray-200 rounded-xl mb-3'>
                        <h2 className='font-bold'>{item.question}</h2>
                        <p className='text-sm font-medium text-primary'>Type: {item?.type}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default QuestionListContainer