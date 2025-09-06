"use client";
import { useEffect, useState, useContext, useRef } from "react";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { Timer } from "lucide-react";
import TimerCounter from "./_components/TimerCounter";
import Image from "next/image";
import { Mic, PhoneCall, Loader2Icon } from "lucide-react";
import Vapi from "@vapi-ai/web";
import { supabase } from "@/services/supabaseClient";
import axios from "axios";


function StartInterview() {
  const { interviewInfo } = useContext(InterviewDataContext);
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
  const router = useRouter();
  const { interview_id } = useParams();

  const [activeUser, setActiveUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState();
  const [blurred, setBlurred] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  const hasFeedbackSaved = useRef(false);
  const conversationRef = useRef();

  //  Start the interview when interviewInfo is available 
  useEffect(() => {
    if (interviewInfo) {
      startCall();
    }
  }, [interviewInfo]);

  //  Start Vapi call with assistant configuration
  const startCall = () => {
    let questionList = "";
    interviewInfo?.interviewData?.questionList.forEach((item) => {
      questionList = item?.question + "," + questionList;
    });
    console.log("questionList: " + questionList);

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage:
        "Hi " +
        interviewInfo?.userName +
        ", how are you? Ready for your interview on " +
        interviewInfo?.interviewData?.jobPosition +
        "?",
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "11labs",
        voiceId: "21m00Tcm4TlvDq8ikWAM",
      },
      model: {
        provider: "openai",
        model: "gpt-4o",
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

  // End interview
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
      console.error("Error ending interview:", err);
      toast.error("Something went wrong ending the interview");
    } finally {
      setLoading(false);
    }
  };

  //  Generate and save feedback
  const GenerateFeedback = async () => {
    try {
      const currentConversation = conversationRef.current;
      console.log("Current conversation:", currentConversation);

      if (!currentConversation) {
        console.warn("No conversation data available for feedback generation");
        return;
      }

      const result = await axios.post("/api/ai-feedback", {
        conversation: currentConversation,
      });

      const Content = result.data.content;
      console.log("AI feedback content:", Content);

      // Clean up the content by removing markdown code blocks
      const FINAL_CONTENT = Content.replace(/```json/g, '').replace(/```/g, '').trim();
      console.log("Cleaned feedback content:", FINAL_CONTENT);

      // Parse the JSON feedback
      let parsedFeedback;
      try {
        parsedFeedback = JSON.parse(FINAL_CONTENT);
      } catch (parseError) {
        console.error("Error parsing feedback JSON:", parseError);
        console.log("Raw content that failed to parse:", FINAL_CONTENT);
        // Fallback feedback if parsing fails
        parsedFeedback = {
          overall_rating: "Unable to generate rating",
          feedback: "Interview completed but feedback generation encountered an error.",
          recommendation: "Please review the interview manually."
        };
      }

      // Save to database
      const { data, error } = await supabase
        .from('interview-feedback')
        .insert([
          {
            userName: interviewInfo?.userName,
            userEmail: interviewInfo?.userEmail,
            interview_id: interview_id,
            feedback: parsedFeedback,
            recommended: parsedFeedback.recommendation || parsedFeedback.overall_rating
          },
        ])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Feedback successfully saved:", data);
    } catch (err) {
      console.error("Error generating feedback:", err);
      toast.error("Failed to generate feedback, but interview data is saved");
    }
  };

  //  Vapi event handling
  useEffect(() => {
    const handleMessage = (message) => {
      console.log(message);
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
        console.log("Call has ended.");
        toast("Interview ended");
        endInterview();
      }
    };

    const handleError = (err) => {
      console.error("Vapi error:", err);

      const message = err?.errorMsg || err?.message || "";
      if (message.includes("Meeting has ended") || message.includes("ejection")) {
        console.log("Ignoring meeting end error from Daily");
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

  // Tab + visibility monitoring
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setBlurred(true);
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;

          if (newCount > 2) {
            endInterview("Interview ended: You switched tabs too many times.");
          } else {
            toast.error("⚠️ Please stay on this tab during the interview!");
          }

          return newCount;
        });
      } else {
        setTimeout(() => {
          setBlurred(false);
        }, 1000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Parse duration helper
  const parseDurationToSeconds = (durationStr) => {
    if (!durationStr) return 0;
    const lower = durationStr.toLowerCase();
    if (lower.includes("hr")) return (parseInt(lower, 10) || 0) * 3600;
    if (lower.includes("min")) return (parseInt(lower, 10) || 0) * 60;
    if (lower.includes("sec")) return parseInt(lower, 10) || 0;
    return parseInt(lower, 10) || 0;
  };


  return (
    <div className="relative p-20 lg:px-48 xl:px-56 min-h-screen">
      {/* Blur overlay */}
      {blurred && (
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-lg z-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-xl shadow-xl">
            <h2 className="text-xl font-bold">⚠️ Stay on this tab</h2>
            <p className="mt-2 text-sm">
              Please remain on the interview tab. Switching tabs multiple times will end your session.
            </p>
          </div>
        </div>
      )}

      <h2 className="font-bold text-xl flex items-center justify-between">
        AI Interview Session
        <span className="flex gap-2 items-center">
          <Timer />
          <TimerCounter
            duration={parseDurationToSeconds(interviewInfo?.interviewData?.duration)}
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
            <h2
              className="text-white bg-primary flex items-center justify-center rounded-full w-12 h-12 text-lg md:w-16 md:h-16 md:text-xl"
            >
              {interviewInfo?.userName?.[0]}
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
  );
}

export default StartInterview;







