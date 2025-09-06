import { BriefcaseBusiness, BriefcaseBusinessIcon, Calendar, Code2Icon, LayoutDashboard, List, Puzzle, Settings, User2Icon, Users, WalletCards } from "lucide-react"

export const SideBarOptions = [
    {
        name:'Dashboard',
        icon:LayoutDashboard,
        path:'/dashboard'
    },
    {
        name:'Scheduled Interview',
        icon:Calendar,
        path:'/scheduled-interview'
    },
    {
        name:'All Interview',
        icon:List,
        path:'/all-interview'
    },
    {
        name:'Billing',
        icon:WalletCards,
        path:'/billing'
    },
    {
        name:'Settings',
        icon:Settings,
        path:'/settings'
    }
]
export const InterviewType = [
    {
        title: 'Technical',
        icon: Code2Icon
    },
    {
        title: 'Behavioral',
        icon: User2Icon
    },
    {
        title: 'Experience',
        icon: BriefcaseBusinessIcon
    },
    {
        title: 'Problem Solving',
        icon: Puzzle
    },
    {
        title: 'Leadership',
        icon: Users
    },
    
]

export const QUESTION_PROMPT = `You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions:

Job Title: {{jobTitle}}

Job Description:{{jobDescription}}

Interview Duration: {{duration}}

Interview Type: {{type}}

📝 Your task:

Analyze the job description to identify key responsibilities, required skills, and expected experience.

Generate a list of interview questions depends on interview duration

Adjust the number and depth of questions to match the interview duration.

Ensure the questions match the tone and structure of a real-life {{type}} interview.

🧩 Format your response in JSON format with array list of questions.
format: interviewQuestions=[
{
 question:'',
 type:'Technical/Behavioral/Experince/Problem Solving/Leadership'
},{
...
}]

🎯 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.`

// export const QUESTION_PROMPT = `You are an AI that generates interview questions.

// Job Title: {{jobTitle}}
// Job Description: {{jobDescription}}
// Duration: {{duration}}
// Interview Type: {{type}}

// Generate 5–10 interview questions.

// ⚠️ Important:
// - Output ONLY valid JSON.
// - Do not include explanations, markdown, or extra text.
// - The JSON format must be:

// {
//   "interviewQuestions": [
//     { "question": "string", "type": "string" },
//     { "question": "string", "type": "string" }
//   ]
// }`

