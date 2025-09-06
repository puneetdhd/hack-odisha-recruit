import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { parsedResume } = await req.json();

    if (!parsedResume) {
      return NextResponse.json(
        { error: "parsedResume is required" },
        { status: 400 }
      );
    }

    const FINAL_PROMPT = `
You are an interview assistant.
Given the parsed resume below, generate exactly 3 personalized interview questions.
They must be focused on the candidate's background, skills, and experiences.
Return ONLY a valid JSON array of strings, with no extra text, no numbering.

🧩 Output format:

Return ONLY valid JSON (no explanations, no markdown).  
The JSON must follow this schema exactly:
  [
    {
      "question": "string",
      "type": "Technical | Behavioral | Experience | Problem Solving | Leadership"
    }
  ]

Resume:
${JSON.stringify(parsedResume, null, 2)}
`;


    const client = axios.create({
      baseURL: "https://chatapi.akash.network/api/v1",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AKASH_API_KEY}`,
      },
    });

    const response = await client.post("/chat/completions", {
      model: "Meta-Llama-3-1-8B-Instruct-FP8",
      messages: [{ role: "user", content: FINAL_PROMPT }],
    });

    const aiMessage = response.data?.choices?.[0]?.message?.content || "";

    return NextResponse.json({ questions: aiMessage });
  } catch (e) {
    console.error("AI model error:", e?.response?.data || e);
    return NextResponse.json(
      { error: "AI model failed" },
      { status: 500 }
    );
  }
}
