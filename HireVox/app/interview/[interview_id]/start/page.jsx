"use client";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { Loader2Icon, PhoneCall, Timer } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Mic } from "lucide-react";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import TimerCounter from "./_components/TimerCounter";

function StartInterview() {
  const { interviewInfo } = useContext(InterviewDataContext);
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState();
  const router = useRouter();
  const [loading, setLoading] = useState();

  // 🔹 New states for blur + tab switch tracking
  const [isBlurred, setIsBlurred] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  const hasFeedbackSaved = useRef(false);
  const conversationRef = useRef();
  const { interview_id } = useParams();

  useEffect(() => {
    interviewInfo && startCall();
  }, [interviewInfo]);

  const startCall = () => {
    let questionList;
    interviewInfo?.interviewData?.questionList.forEach((item) => {
      questionList = item?.question + "," + questionList;
    });

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage:
        "Hi " +
        interviewInfo?.userName +
        ", how are you? Ready for your interview on " +
        interviewInfo?.interviewData?.jobPosition +
        "?",
      transcriber: { provider: "deepgram", model: "nova-2", language: "en-US" },
      voice: { provider: "11labs", voiceId: "21m00Tcm4TlvDq8ikWAM" },
      model: {
        provider: "openai",
        model: "gpt-4o",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `
    You are an AI voice assistant conducting interviews.
    Ask one question at a time, assess answers, encourage politely.
    Wrap up smoothly after 5–7 questions.
    Keep responses short, natural, and engaging.
    Questions: ${questionList}
    `.trim(),
          },
        ],
      },
    };

    vapi.start(assistantOptions);
  };

  const endInterview = async (reasonMessage) => {
    if (hasFeedbackSaved.current) return;
    hasFeedbackSaved.current = true;

    try {
      setLoading(true);
      if (vapi) {
        try {
          await vapi.stop();
        } catch (err) {
          console.log("Error stopping Vapi:", err);
        }
      }

      await GenerateFeedback();

      if (reasonMessage) {
        toast.error(reasonMessage);
      }

      router.replace(`/interview/${interview_id}/completed`);
    } catch (err) {
      console.log("Error ending interview:", err);
      toast.error("Something went wrong ending the interview");
    } finally {
      setLoading(false);
    }
  };

  // Vapi event handling
  vapi.on("message", (message) => {
    if (message?.conversation) {
      setConversation(message.conversation);
      conversationRef.current = message.conversation;
    }
  });

  useEffect(() => {
    const handleMessage = (message) => {
      if (message?.conversation) {
        setConversation(JSON.stringify(message.conversation));
        conversationRef.current = message.conversation;
      }
    };

    const handleCallStart = () => toast("Call connected...");
    const handleSpeechStart = () => setActiveUser(false);
    const handleSpeechEnd = () => setActiveUser(true);

    const handleCallEnd = () => {
      if (!hasFeedbackSaved.current) {
        toast("Interview ended");
        endInterview();
      }
    };

    const handleError = (err) => {
      console.error("Vapi error:", err);
      const message = err?.errorMsg || err?.message || "";
      if (message.includes("Meeting has ended") || message.includes("ejection")) {
        return;
      }
      if (!hasFeedbackSaved.current) {
        toast.error("Interview ended due to error");
        endInterview();
      }
    };

    vapi.on("message", handleMessage);
    vapi.on("call-start", handleCallStart);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("call-end", handleCallEnd);
    vapi.on("error", handleError);

    return () => {
      vapi.off("message", handleMessage);
      vapi.off("call-start", handleCallStart);
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("call-end", handleCallEnd);
      vapi.off("error", handleError);
    };
  }, []);

  // ✅ Tab Change Detection + Blur logic
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User left tab
        setIsBlurred(true);
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;

          if (newCount > 2) {
            // End interview after more than 2 switches
            endInterview("Interview ended: You switched tabs too many times.");
          } else {
            toast.error("⚠️ Please stay on this tab during the interview!");
          }

          return newCount;
        });
      } else {
        // User returned to tab
        setTimeout(() => {
          setIsBlurred(false);
        }, 1000); // remove blur after 1 second
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const GenerateFeedback = async () => {
    try {
      const currentConversation = conversationRef.current;
      const result = await axios.post("/api/ai-feedback", {
        conversation: currentConversation,
      });

      const Content = result.data.content;
      const FINAL_CONTENT = Content.replace("```json", "").replace("```", "");

      const { data, error } = await supabase
        .from("interview-feedback")
        .insert([
          {
            userName: interviewInfo?.userName,
            userEmail: interviewInfo?.userEmail,
            interview_id: interview_id,
            feedback: JSON.parse(FINAL_CONTENT),
            recommended: JSON.parse(FINAL_CONTENT).recommendation,
          },
        ])
        .select();

      console.log("Feedback saved:", data);
    } catch (err) {
      console.error("Error generating feedback:", err);
    }
  };

  const parseDurationToSeconds = (durationStr) => {
    if (!durationStr) return 0;
    const lower = durationStr.toLowerCase();
    if (lower.includes("hr")) return (parseInt(lower, 10) || 0) * 3600;
    if (lower.includes("min")) return (parseInt(lower, 10) || 0) * 60;
    if (lower.includes("sec")) return parseInt(lower, 10) || 0;
    return parseInt(lower, 10) || 0;
  };

  return (
    <div className="relative">
      {/* Overlay Blur */}
      {isBlurred && (
        <div className="absolute inset-0 backdrop-blur-md bg-black/40 z-40 flex items-center justify-center">
          <h2 className="text-white text-2xl font-bold bg-red-600 px-6 py-3 rounded-lg z-50">
            ⚠️ Please stay on the interview tab!
          </h2>
        </div>
      )}

      {/* Main Interview UI */}
      <div className={`p-20 lg:px-48 xl:px-56 ${isBlurred ? "blur-md" : ""}`}>
        <h2 className="font-bold text-xl flex items-center justify-between">
          AI Interview Session
          <span className="flex gap-2 items-center">
            <Timer />
            <TimerCounter
              duration={parseDurationToSeconds(
                interviewInfo?.interviewData?.duration
              )}
              onEnd={endInterview}
            />
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
          {/* AI Recruiter */}
          <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
            <div className="relative">
              {!activeUser && (
                <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping"></span>
              )}
              <Image
                src={"/ai.png"}
                alt="ai"
                width={100}
                height={100}
                className="w-[60px] h-[60px] rounded-full object-cover"
              />
            </div>
            <h2>AI Recruiter</h2>
          </div>

          {/* User */}
          <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
            <div className="relative">
              {activeUser && (
                <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping"></span>
              )}
              <h2 className="text-2xl bg-primary text-white p-3 rounded-full px-4">
                {interviewInfo?.userName[0]}
              </h2>
            </div>
            <h2>{interviewInfo?.userName}</h2>
          </div>
        </div>

        <div className="flex items-center gap-5 justify-center mt-7">
          <Mic className="h-12 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer" />
          {!loading ? (
            <PhoneCall
              className="h-12 w-12 p-3 bg-red-500 rounded-full cursor-pointer"
              onClick={() => endInterview("Interview ended manually.")}
            />
          ) : (
            <Loader2Icon className="animate-spin" />
          )}
        </div>
        <h2 className="text-sm text-gray-400 text-center mt-5">
          Interview in progress.........
        </h2>
      </div>
    </div>
  );
}

export default StartInterview;
