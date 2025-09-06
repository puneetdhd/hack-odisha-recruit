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

Job Description: {{jobDescription}}

Interview Duration: {{duration}}

Interview Type: {{type}}

📝 Your task:

- Analyze the job description to identify key responsibilities, required skills, and expected experience.
- Generate a list of interview questions appropriate for the given interview duration.
- Adjust the number and depth of questions to match the interview duration.
- Ensure the questions match the tone and structure of a real-life {{type}} interview.

🧩 Output format:

Return ONLY valid JSON (no explanations, no markdown).  
The JSON must follow this schema exactly:

{
  "interviewQuestions": [
    {
      "question": "string",
      "type": "Technical | Behavioral | Experience | Problem Solving | Leadership"
    }
  ]
}

🎯 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.`







export const FEEDBACK_PROMPT = `{{conversation}}

Based on the interview conversation between assistant and user, evaluate the candidate and provide feedback.

👉 Scoring Guidelines (each category is out of 10):
- 0–2 = No answers given, irrelevant responses, or very poor performance
- 3–4 = Very weak (poor answers / no relevant knowledge shown)
- 5–6 = Moderate (basic understanding but lacks depth / partial answers)
- 7–8 = Strong (clear, confident, technically correct, good communication)
- 9–10 = Excellent (very confident, in-depth, precise, outstanding clarity)

❗ Important: If the user gave no answers or only irrelevant responses, 
assign very low scores (0–2 in all categories) and clearly state this in the summary.

Rate the candidate in these categories:
- Technical Skills
- Communication
- Problem Solving
- Experience
- Overall rating

Then provide:
- A **3-line summary** about the interview performance
- A clear **recommendation** ("Recommended" or "Not recommended")
- A **one-line recommendation message**

Respond only in valid **JSON** with this structure:

{
  "feedback": {
    "rating": {
      "technicalSkills": <number out of 10>,
      "communication": <number out of 10>,
      "problemSolving": <number out of 10>,
      "experience": <number out of 10>,
      "totalRating": <number out of 10>,
    },
    "summary": "<3 line summary>",
    "recommendation": "<Recommended | Not recommended>",
    "recommendationMsg": "<one line message>"
  }
}
`

