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

function StartInterview() {
  const { interviewInfo } = useContext(InterviewDataContext);
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
  const router = useRouter();
  const { interview_id } = useParams();

  const [activeUser, setActiveUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blurred, setBlurred] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  const hasFeedbackSaved = useRef(false);

  // ✅ Helper: End interview
  const endInterview = async () => {
    if (hasFeedbackSaved.current) return;
    hasFeedbackSaved.current = true;
    setLoading(true);

    try {
      if (vapi) {
        try {
          await vapi.stop();
        } catch (err) {
          console.log("Error stopping Vapi:", err);
        }
      }

      // Save feedback
      await GenerateFeedback();
      router.replace(`/interview/${interview_id}/completed`);
    } catch (err) {
      console.error("Error ending interview:", err);
      toast.error("Something went wrong ending the interview");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Feedback generator (unchanged)
  const GenerateFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from("interview-feedback")
        .insert([
          {
            userName: interviewInfo?.userName,
            userEmail: interviewInfo?.userEmail,
            interview_id,
            feedback: { result: "Sample feedback" }, // Replace with actual
          },
        ])
        .select();
      console.log("Feedback saved:", data);
    } catch (err) {
      console.error("Error generating feedback:", err);
    }
  };

  // ✅ Tab + fullscreen monitoring
  useEffect(() => {
    const handleBlurOrExit = () => {
      setBlurred(true);
      setTabSwitchCount((prev) => {
        const newCount = prev + 1;

        if (newCount >= 2) {
          toast.error("Interview ended due to multiple tab/app switches.");
          endInterview();
        } else {
          toast("⚠️ Please stay on the interview tab & fullscreen.");
        }

        return newCount;
      });
    };

    const handleFocusReturn = () => {
      if (document.fullscreenElement) {
        setTimeout(() => setBlurred(false), 1000);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        handleBlurOrExit();
      }
    };

    window.addEventListener("blur", handleBlurOrExit);
    window.addEventListener("focus", handleFocusReturn);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) handleBlurOrExit();
    });
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("blur", handleBlurOrExit);
      window.removeEventListener("focus", handleFocusReturn);
      document.removeEventListener("visibilitychange", () => {
        if (document.hidden) handleBlurOrExit();
      });
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className="relative p-20 lg:px-48 xl:px-56 min-h-screen">
      {/* Blur overlay */}
      {blurred && (
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-lg z-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-xl shadow-xl">
            <h2 className="text-xl font-bold">⚠️ Stay on this tab</h2>
            <p className="mt-2 text-sm">
              Please remain in fullscreen and on the interview tab. Leaving will end your session.
            </p>
          </div>
        </div>
      )}

      <h2 className="font-bold text-xl flex items-center justify-between">
        AI Interview Session
        <span className="flex gap-2 items-center">
          <Timer />
          <TimerCounter
            duration={1800}
            onEnd={endInterview}
          />
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
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
            onClick={endInterview}
          />
        ) : (
          <Loader2Icon className="animate-spin" />
        )}
      </div>
      <h2 className="text-sm text-gray-400 text-center mt-5">
        Interview in progress...
      </h2>
    </div>
  );
}

export default StartInterview;
