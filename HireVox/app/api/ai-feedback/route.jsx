import { FEEDBACK_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
    const { conversation } = await req.json();

    console.log(conversation)

    const candidateAnswers = conversation
        .filter(msg => msg.role === "user")
        .map(msg => msg.content)
        .join("\n");
    const FINAL_PROMPT = FEEDBACK_PROMPT.replace("{{conversation}}", candidateAnswers || "NO ANSWERS GIVEN");



    console.log(FINAL_PROMPT)


    try {
        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
        })
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are an evaluator of interview transcripts. Respond only in JSON as per format." },
                { role: "user", content: FINAL_PROMPT }
            ],
        })



        return NextResponse.json(completion.choices[0].message)
    } catch (e) {
        console.log(e)
        return NextResponse.json(e)
    }

}


