import { Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import QuestionListContainer from './QuestionListContainer';
import { supabase } from '@/services/supabaseClient';
import { useUser } from '@/app/provider';
import { v4 as uuidv4 } from 'uuid';

function QuestionList({ formData, onCreateLink}) {

    const [loading, setLoading] = useState(true)
    const [questionList, setQuestionList] = useState();
    const { user } = useUser();
    const [saveLoading,setSaveLoading] = useState(false)

    useEffect(() => {
        if (formData) {
            GenerateQuestionList();
        }
    }, [formData])



    // const GenerateQuestionList = async () => {
    //     setLoading(true)
    //     try {
    //         const result = await axios.post('/api/ai-model', {
    //             ...formData
    //         })
    //         console.log(result.data.content)
    //         const Content = JSON.parse(result.data.content)
    //         const FINAL_CONTENT = Content.replace('```json', '').replace('```', '')
    //         setQuestionList(JSON.parse(FINAL_CONTENT?.interviewQuestions))
    //         setLoading(false)
    //     } catch (e) {
    //         toast('server error, Try Again')
    //         setLoading(false)
    //     }
    // }

    const GenerateQuestionList = async () => {
        setLoading(true);
        try {
            const result = await axios.post('/api/ai-model', { ...formData });
            console.log(result.data.content);

            // clean out code block fences before parsing
            let content = result.data.content.replace(/```json/g, "").replace(/```/g, "").trim();

            const parsed = JSON.parse(content); // now it's a JS object
            setQuestionList(parsed.interviewQuestions || []);

            setLoading(false);
        } catch (e) {
            console.error(e);
            toast('server error, Try Again');
            setLoading(false);
        }
    };

    const onFinish = async () => {
        setSaveLoading(true)
        const interview_id = uuidv4();
        const { data, error } = await supabase
            .from('interviews')
            .insert([
                {
                    ...formData,
                    questionList: questionList,
                    userEmail: user?.email,
                    interview_id: interview_id
                },
            ])
            .select()

            setSaveLoading(false)

            onCreateLink(interview_id)

        console.log(data)

    }

    return (
        <div>
            {loading &&
                <div className='p-5 bg-blue-50 rounded-xl border border-primary flex gap-5 items-center'>
                    <Loader2Icon className='animate-spin' />
                    <div>
                        <h2 className='font-medium'>Generating Interview Questions</h2>
                        <p className='text-primary'>Our AI is grafting personalised questions based on your job description</p>
                    </div>


                </div>
            }

            {questionList?.length > 0 &&
                <div>
                    <QuestionListContainer questionList={questionList} />
                </div>

            }

            <div className='flex justify-end mt-10'>
                <Button onClick={() => onFinish()} disabled={saveLoading}>
                    {saveLoading && <Loader2Icon className='animate-apin'/>} 
                    Create Interview Link & Finish
                </Button>
            </div>

        </div>
    )
}

export default QuestionList