"use client";
import React, { useContext, useEffect, useState } from "react";
import { Clock, Info, Loader2Icon, Mic, Video, Upload } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import axios from "axios";

// 🔹 Helper: Request fullscreen
const enterFullscreen = async () => {
  try {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      await elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      await elem.webkitRequestFullscreen(); // Safari
    } else if (elem.msRequestFullscreen) {
      await elem.msRequestFullscreen(); // IE11
    }
    return true;
  } catch (err) {
    console.error("Fullscreen request failed", err);
    return false;
  }
};

function Interview() {
  const router = useRouter();
  const { interview_id } = useParams();

  const [interviewData, setInterviewData] = useState();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [parsedResume, setParsedResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setInterviewInfo } = useContext(InterviewDataContext);

  useEffect(() => {
    interview_id && GetInterviewDetails();
  }, [interview_id]);

  const GetInterviewDetails = async () => {
    setLoading(true);
    try {
      let { data: interviews, error } = await supabase
        .from("interviews")
        .select("jobPosition,jobDescription,duration,type,questionList")
        .eq("interview_id", interview_id);

      setInterviewData(interviews[0]);
      setLoading(false);

      if (interviews?.length == 0) {
        toast("Incorrect Interview Link");
        return;
      }
    } catch (e) {
      setLoading(false);
      toast("Incorrect Interview Link");
    }
  };

  // 🔹 Upload and parse resume immediately when file selected
  const handleResumeUpload = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await axios.post(
        "http://localhost:8000/api/v1/resume/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log(res.data);
      setParsedResume(res.data); // store parsed resume
    } catch (err) {
      console.error("Resume upload failed", err);
      toast("Resume upload failed");
    } finally {
      setLoading(false);
    }
  };

  const onJoinInterview = async () => {
    if (!parsedResume) {
      toast("Please upload and parse your resume first");
      return;
    }

    setLoading(true);

    try {
      // 🔹 Ask for fullscreen first
      const fullscreenGranted = await enterFullscreen();
      if (!fullscreenGranted) {
        toast("You must allow fullscreen to join the interview");
        setLoading(false);
        return;
      }

      // 🔹 Generate personalized questions from AI
      const aiRes = await axios.post("/api/ai-model-2", {
        parsedResume,
      });

      let personalizedQuestions = aiRes.data.questions || [];
      console.log("Raw AI response:", personalizedQuestions);

      // 🔹 Parse if string
      if (typeof personalizedQuestions === "string") {
        try {
          personalizedQuestions = JSON.parse(personalizedQuestions);
        } catch (parseError) {
          console.error("Failed to parse AI response as JSON:", parseError);
          toast("Failed to generate personalized questions");
          return;
        }
      }

      // Convert to standard format {question, type}
      const formattedPersonalizedQuestions = personalizedQuestions.map((q) => {
        if (typeof q === "object" && q.question && q.type) {
          return q;
        }
        if (typeof q === "string") {
          let questionType = "Experience";
          const lowerQ = q.toLowerCase();
          if (
            lowerQ.includes("technical") ||
            lowerQ.includes("code") ||
            lowerQ.includes("algorithm") ||
            lowerQ.includes("system")
          ) {
            questionType = "Technical";
          } else if (
            lowerQ.includes("team") ||
            lowerQ.includes("collaborate") ||
            lowerQ.includes("conflict") ||
            lowerQ.includes("challenge")
          ) {
            questionType = "Behavioral";
          } else if (
            lowerQ.includes("problem") ||
            lowerQ.includes("solve") ||
            lowerQ.includes("approach")
          ) {
            questionType = "Problem Solving";
          } else if (
            lowerQ.includes("lead") ||
            lowerQ.includes("manage") ||
            lowerQ.includes("mentor")
          ) {
            questionType = "Leadership";
          }
          return { question: q, type: questionType };
        }
        return { question: q.toString(), type: "Experience" };
      });

      // Merge with existing questions
      const existingQuestions = interviewData?.questionList || [];
      const combinedQuestions = [
        ...existingQuestions,
        ...formattedPersonalizedQuestions,
      ];
      console.log("Combined questions:", combinedQuestions);

      // Save to context
      setInterviewInfo({
        userName,
        userEmail,
        resumeFile,
        interviewData: {
          ...interviewData,
          questionList: combinedQuestions,
        },
      });

      // Redirect to start
      router.push(`/interview/${interview_id}/start`);
    } catch (err) {
      console.error("Error during interview setup", err);
      toast("Failed to setup interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 md:px-12 lg:px-32 xl:px-48 mt-12">
      <div className="flex flex-col items-center justify-center border rounded-2xl bg-white p-6 md:p-10 max-w-2xl mx-auto shadow-lg">
        {/* Logo/Icon */}
        <div className="bg-blue-500 rounded-full p-3 mb-2">
          <Mic className="w-5 h-5 text-white" />
        </div>

        {/* Branding */}
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          <span className="text-blue-500">Hire</span>
          <span className="text-gray-700">Vox</span>
        </h1>

        <h2 className="mt-2 font-semibold text-lg text-center">
          AI-Powered Interview Platform
        </h2>

        <Image
          src="/interview.png"
          alt="interview"
          width={500}
          height={500}
          className="w-[250px] sm:w-[300px] md:w-[350px] my-6"
        />

        <h2 className="font-bold text-lg md:text-xl mt-2 text-center">
          {interviewData?.jobPosition}
        </h2>

        <h2 className="flex gap-2 items-center text-gray-500 mt-2 text-sm md:text-base">
          <Clock className="h-4 w-4" /> {interviewData?.duration}
        </h2>

        {/* Input Section */}
        <div className="w-full mt-4">
          <h2 className="mb-1 text-sm md:text-base">Enter your full name</h2>
          <Input
            placeholder="e.g., Smith Jones"
            className="w-full"
            onChange={(event) => setUserName(event.target.value)}
          />
        </div>

        <div className="w-full mt-4">
          <h2 className="mb-1 text-sm md:text-base">Enter your Email</h2>
          <Input
            placeholder="e.g., smith@gmail.com"
            className="w-full"
            onChange={(event) => setUserEmail(event.target.value)}
          />
        </div>

        {/* Resume Upload */}
        <div className="w-full mt-4">
          <h2 className="mb-1 text-sm md:text-base">
            Upload your Resume (PDF or DOC)
          </h2>
          <label className="flex items-center justify-between gap-3 w-full px-4 py-3 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
            <div className="flex items-center gap-2 text-gray-600">
              <Upload className="h-4 w-4" />
              <span className="text-sm">
                {resumeFile ? resumeFile.name : "Choose a file"}
              </span>
            </div>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setResumeFile(file);
                  handleResumeUpload(file);
                }
              }}
            />
          </label>
        </div>

        {/* Info Section */}
        <div className="p-4 bg-blue-100 flex gap-3 rounded-lg mt-8 w-full">
          <Info className="text-primary shrink-0 mt-1" />
          <div>
            <h2 className="font-bold text-base md:text-lg">Before you begin</h2>
            <ul className="mt-1 space-y-1 list-disc pl-5">
              <li className="text-sm text-primary">
                Ensure you have a stable internet connection
              </li>
              <li className="text-sm text-primary">
                Test your camera and microphone
              </li>
              <li className="text-sm text-primary">
                Find a quiet place for the interview
              </li>
              <li className="text-sm text-primary">
                The interview will run in fullscreen. Please allow fullscreen when prompted.
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          className="mt-5 w-full font-bold flex gap-2 items-center justify-center"
          disabled={loading || !userName}
          onClick={() => onJoinInterview()}
        >
          <Video className="h-4 w-4" />
          {loading && <Loader2Icon />}
          Join Interview
        </Button>
      </div>
    </div>
  );
}

export default Interview;
