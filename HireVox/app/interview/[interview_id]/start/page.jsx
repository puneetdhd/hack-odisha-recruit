// "use client";
// import { InterviewDataContext } from "@/context/InterviewDataContext";
// import { Phone, Timer } from "lucide-react";
// import React, { useContext, useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { Mic } from "lucide-react";
// import Vapi from "@vapi-ai/web";
// import AlertConfirmation from "./_components/AlertConfirmation";
// import { toast } from "sonner";
// import axios from "axios";

// function StartInterview() {

//   const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
//   const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
//   const [activeUser, setActiveUser] = useState(false)
//   const [conversation, setConversation] = useState()

//   useEffect(() => {
//     interviewInfo && startCall();
//   }, [interviewInfo]);

//   const startCall = () => {
//     let questionList;
//     interviewInfo?.interviewData?.questionList.forEach((item, index) => {
//       questionList = item?.question + "," + questionList;
//     });
//     console.log("questionList: " + questionList);
//     const assistantOptions = {
//       name: "AI Recruiter",
//       firstMessage:
//         "Hi" +
//         interviewInfo?.userName +
//         ", how are you? Ready for your interview on " +
//         interviewInfo?.interviewData?.jobPosition +
//         "?",
//       transcriber: {
//         provider: "deepgram",
//         model: "nova-2",
//         language: "en-US",
//       },

//       voice: {
//         provider: "11labs",
//         voiceId: "21m00Tcm4TlvDq8ikWAM",
//       },

//       model: {
//         provider: "openai",
//         model: "gpt-4o",
//         temperature: 0.7,
//         messages: [
//           {
//             role: "system",
//             content:
//               `
//     You are an AI voice assistant conducting interviews.
//   Your job is to ask candidates provided interview questions, assess their responses.
//   Begin the conversation with a friendly introduction, setting a relaxed yet professional tone.Example:
//     "Hey there! Welcome to your ` +
//               interviewInfo?.interviewData?.jobPosition +
//               `interview. Let’s get started with a few questions!"
//   Ask one question at a time and wait for the candidate’s response before proceeding.Keep the questions clear and concise.Below Are the questions ask one by one:
//     Questions: ` +
//               questionList +
//               `
//   If the candidate struggles, offer hints or rephrase the question without giving away the answer.Example:
//     "Need a hint? Think about how React tracks component updates!"
//   Provide brief, encouraging feedback after each answer.Example:
//     "Nice! That’s a solid answer."
//     "Hmm, not quite! Want to try again?"
//   Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let’s tackle a tricky one!"
//   After 5 - 7 questions, wrap up the interview smoothly by summarizing their performance.Example:
//     "That was great! You handled some tough questions well. Keep sharpening your skills!"
//   End on a positive note:
//     "Thanks for chatting! Hope to see you crushing projects soon!"
//   Key Guidelines:
//   ✅ Be friendly, engaging, and witty 🎤
//   ✅ Keep responses short and natural, like a real conversation
//   ✅ Adapt based on the candidate’s confidence level
//   ✅ Ensure the interview remains focused on React
//       `.trim(),
//           },
//         ],
//       },
//     };
//     vapi.start(assistantOptions);
//   };

//   const stopInterview = () => {
//     vapi.stop();
//     toast("Interview ended")
//   };


//   vapi.on('call-start', () => {
//     console.log('Call started')
//     toast('Call connected.....')
//   });

//   vapi.on('speech-start', () => {
//     console.log('Assistant speech has started.')
//     setActiveUser(false)

//   });

//   vapi.on('speech-end', () => {
//     console.log('Assistant speech has ended.')
//     setActiveUser(true)
//   });



//   vapi.on('call-end', () => {
//     console.log('Call has ended.')
//     toast('Interview ended')
//     GenerateFeedback(conversation);
//   });

//   vapi.on('message', (message) => {
//     console.log(message)
//     setConversation(message?.conversation)
//   });

//   // vapi.on("message", (message) => {
//   //   console.log("Vapi message:", message);


//   //   if (message?.type === "conversation-update") {
//   //     console.log("conversation: ", message?.conversation)
//   //     setConversation(message?.conversation); // <-- full transcript here
//   //   }
//   // });


//   const GenerateFeedback = async (currentConversation) => {
//     console.log(currentConversation)
//     // const result = await axios.post('/api/ai-feedback', {
//     //   conversation: conversation
//     // });


//     const result = await axios.post("/api/ai-feedback", {
//       conversation: currentConversation,
//     });






//     const Content = result.data.content;
//     console.log("content: " + Content)
//     const FINAL_CONTENT = Content.replace('```json', '').replace('```', '')
//     console.log("final content: " + FINAL_CONTENT)
//     // save to database


//   }

















//   console.log(conversation)
//   return (
//     <div className="p-20 lg:px-48 xl:px-56">
//       <h2 className="font-bold text-xl flex items-center justify-between">
//         AI Interview Session
//         <span className="flex gap-2 items-center">
//           <Timer />
//           00:00:00
//         </span>
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
//         <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
//           <div className="relative">
//             {!activeUser && <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping"></span>}
//             <Image
//               src={"/ai.png"}
//               alt="ai"
//               width={100}
//               height={100}
//               className="w-[60px] h-[60px] rounded-full object-cover"
//             />
//           </div>
//           <h2>AI Recruiter</h2>
//         </div>
//         <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
//           <div className="relative">
//             {activeUser && <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping"></span>}
//             <h2 className="text-2xl bg-primary text-white p-3 rounded-full px-4">
//               {interviewInfo?.userName[0]}
//             </h2>
//           </div>
//           <h2>{interviewInfo?.userName}</h2>
//         </div>
//       </div>

//       <div className="flex items-center gap-5 justify-center mt-7">
//         <Mic className="h-12 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer" />
//         <AlertConfirmation stopInterview={() => stopInterview()} />
//       </div>
//       <h2 className="text-sm text-gray-400 text-center mt-5">
//         Interview in progress.........
//       </h2>
//     </div>
//   );
// }

// export default StartInterview;

"use client";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { Loader2Icon, Phone, PhoneCall, Timer } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Mic } from "lucide-react";
import Vapi from "@vapi-ai/web";
import AlertConfirmation from "./_components/AlertConfirmation";
import { toast } from "sonner";
import axios from "axios";
import { useParams } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { useRouter } from "next/navigation";
import TimerCounter from "./_components/TimerCounter";


function StartInterview() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState();
  const router = useRouter()
  const [loading, setLoading] = useState()

  const hasFeedbackSaved = useRef(false); // NEW: prevent duplicate DB inserts

  // Ref to always store latest conversation
  const conversationRef = useRef();

  const { interview_id } = useParams()

  useEffect(() => {
    interviewInfo && startCall();
  }, [interviewInfo]);

  // const startCall = () => {
  //   let questionList;
  //   interviewInfo?.interviewData?.questionList.forEach((item, index) => {
  //     questionList = item?.question + "," + questionList;
  //   });
  //   console.log("questionList: " + questionList);
  //   const assistantOptions = {
  //     name: "AI Recruiter",
  //     firstMessage:
  //       "Hi" +
  //       interviewInfo?.userName +
  //       ", how are you? Ready for your interview on " +
  //       interviewInfo?.interviewData?.jobPosition +
  //       "?",
  //     transcriber: {
  //       provider: "deepgram",
  //       model: "nova-2",
  //       language: "en-US",
  //     },

  //     voice: {
  //       provider: "11labs",
  //       voiceId: "21m00Tcm4TlvDq8ikWAM",
  //     },

  //     model: {
  //       provider: "openai",
  //       model: "gpt-4o",
  //       temperature: 0.7,
  //       messages: [
  //         {
  //           role: "system",
  //           content: `
  //   You are an AI voice assistant conducting interviews.
  // Your job is to ask candidates provided interview questions, assess their responses.
  // Begin the conversation with a friendly introduction, setting a relaxed yet professional tone.Example:
  //   "Hey there! Welcome to your ` +
  //             interviewInfo?.interviewData?.jobPosition +
  //             `interview. Let’s get started with a few questions!"
  // Ask one question at a time and wait for the candidate’s response before proceeding.Keep the questions clear and concise.Below Are the questions ask one by one:
  //   Questions: ` +
  //             questionList +
  //             `
  // If the candidate struggles, offer hints or rephrase the question without giving away the answer.Example:
  //   "Need a hint? Think about how React tracks component updates!"
  // Provide brief, encouraging feedback after each answer.Example:
  //   "Nice! That’s a solid answer."
  //   "Hmm, not quite! Want to try again?"
  // Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let’s tackle a tricky one!"
  // After 5 - 7 questions, wrap up the interview smoothly by summarizing their performance.Example:
  //   "That was great! You handled some tough questions well. Keep sharpening your skills!"
  // End on a positive note:
  //   "Thanks for chatting! Hope to see you crushing projects soon!"
  // Key Guidelines:
  // ✅ Be friendly, engaging, and witty 🎤
  // ✅ Keep responses short and natural, like a real conversation
  // ✅ Adapt based on the candidate’s confidence level
  // ✅ Ensure the interview remains focused on React
  //     `.trim(),
  //         },
  //       ],
  //     },
  //   };
  //   vapi.start(assistantOptions);
  // };

  const startCall = () => {
    let questionList;
    interviewInfo?.interviewData?.questionList.forEach((item, index) => {
      questionList = item?.question + "," + questionList;
    });
    console.log("questionList: " + questionList);
    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage:
        "Hi" +
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
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `
    You are an AI voice assistant conducting interviews.
  Your job is to ask candidates provided interview questions, assess their responses.
  Begin the conversation with a friendly introduction, setting a relaxed yet professional tone.Example:
    "Hey there! Welcome to your ` +
              interviewInfo?.interviewData?.jobPosition +
              `interview. Let’s get started with a few questions!"
  Ask one question at a time and wait for the candidate’s response before proceeding.Keep the questions clear and concise.Below Are the questions ask one by one:
    Questions: ` +
              questionList +
              `
  If the candidate struggles, offer hints or rephrase the question without giving away the answer.Example:
    "Need a hint? Think about how React tracks component updates!"
  Provide brief, encouraging feedback after each answer.Example:
    "Nice! That’s a solid answer."
    "Hmm, not quite! Want to try again?"
  Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let’s tackle a tricky one!"
  After 5 - 7 questions, wrap up the interview smoothly by summarizing their performance.Example:
    "That was great! You handled some tough questions well. Keep sharpening your skills!"
  End on a positive note:
    "Thanks for chatting! Hope to see you crushing projects soon!"
  Key Guidelines:
  ✅ Be friendly, engaging, and witty 🎤
  ✅ Keep responses short and natural, like a real conversation
  ✅ Adapt based on the candidate’s confidence level
  ✅ Ensure the interview remains focused on React
      `.trim(),
          },
        ],
      },
    };
    vapi.start(assistantOptions);
  };

  const endInterview = async () => {

    if (hasFeedbackSaved.current) return; // stop duplicates
    hasFeedbackSaved.current = true;

    try {
      setLoading(true);

      // Safely stop Vapi session
      if (vapi) {
        try {
          await vapi.stop(); // no .catch here
        } catch (err) {
          console.log("Error stopping Vapi:", err);
        }
      }

      // Generate feedback & save
      await GenerateFeedback();

      // Redirect directly
      router.replace(`/interview/${interview_id}/completed`);
    } catch (err) {
      console.log("Error ending interview:", err);
      toast.error("Something went wrong ending the interview");
    } finally {
      setLoading(false);
    }
  };



  // vapi.on("call-start", () => {
  //   console.log("Call started");
  //   toast("Call connected.....");
  // });

  // vapi.on("speech-start", () => {
  //   console.log("Assistant speech has started.");
  //   setActiveUser(false);
  // });

  // vapi.on("speech-end", () => {
  //   console.log("Assistant speech has ended.");
  //   setActiveUser(true);
  // });

  // vapi.on("call-end", () => {
  //   console.log("Call has ended.");
  //   toast("Interview ended");
  //   GenerateFeedback();
  // });

  vapi.on("message", (message) => {
    console.log(message);
    if (message?.conversation) {
      setConversation(message.conversation);
      conversationRef.current = message.conversation; // Update ref with latest conversation
    }
  });

  // useEffect(() => {
  //   const handleMessage = (message) => {
  //     console.log('Message:', message);
  //     if (message?.conversation) {
  //       const convoString = JSON.stringify(message.conversation);
  //       console.log('conversation string:', convoString);
  //       setConversation(convoString)
  //     }
  //   };

  //   vapi.on("message", handleMessage);
  //   vapi.on("call-start", () => {
  //     console.log("Call started");
  //     toast("Call connected.....");
  //   });

  //   vapi.on("speech-start", () => {
  //     console.log("Assistant speech has started.");
  //     setActiveUser(false);
  //   });

  //   vapi.on("speech-end", () => {
  //     console.log("Assistant speech has ended.");
  //     setActiveUser(true);
  //   });

  //   vapi.on("call-end", () => {
  //     console.log("Call has ended.");
  //     toast("Interview ended");
  //     GenerateFeedback();
  //   });


  //   return () => {
  //     vapi.off("message", handleMessage)
  //     vapi.off('call-start', () => console.log("END"));
  //     vapi.off('speech-start', () => console.log("END"));
  //     vapi.off('speech-end', () => console.log("END"));
  //     vapi.off('call-end', () => console.log("END"));
  //   };
  // }, [])

  // useEffect(() => {
  //   const handleMessage = (message) => {
  //     console.log("Message:", message);
  //     if (message?.conversation) {
  //       const convoString = JSON.stringify(message.conversation);
  //       setConversation(convoString);
  //       conversationRef.current = message.conversation;
  //     }
  //   };

  //   const handleCallStart = () => {
  //     console.log("Call started");
  //     toast("Call connected...");
  //   };

  //   const handleSpeechStart = () => {
  //     console.log("Assistant speech has started.");
  //     setActiveUser(false);
  //   };

  //   const handleSpeechEnd = () => {
  //     console.log("Assistant speech has ended.");
  //     setActiveUser(true);
  //   };

  //   const handleCallEnd = () => {
  //     console.log("Call has ended.");
  //     toast("Interview ended");
  //     endInterview();
  //   };

  //   const handleError = (err) => {
  //     console.error("Vapi error:", err);
  //     toast.error("Interview error, ending session");
  //     endInterview();
  //   };

  //   // ✅ attach listeners
  //   vapi.on("message", handleMessage);
  //   vapi.on("call-start", handleCallStart);
  //   vapi.on("speech-start", handleSpeechStart);
  //   vapi.on("speech-end", handleSpeechEnd);
  //   vapi.on("call-end", handleCallEnd);
  //   vapi.on("error", handleError);

  //   // ✅ cleanup correctly with same references
  //   return () => {
  //     vapi.off("message", handleMessage);
  //     vapi.off("call-start", handleCallStart);
  //     vapi.off("speech-start", handleSpeechStart);
  //     vapi.off("speech-end", handleSpeechEnd);
  //     vapi.off("call-end", handleCallEnd);
  //     vapi.off("error", handleError);
  //   };
  // }, []);

  useEffect(() => {
    const handleMessage = (message) => {
      if (message?.conversation) {
        const convoString = JSON.stringify(message.conversation);
        setConversation(convoString);
        conversationRef.current = message.conversation;
      }
    };

    const handleCallStart = () => {
      toast("Call connected...");
    };

    const handleSpeechStart = () => setActiveUser(false);
    const handleSpeechEnd = () => setActiveUser(true);

    const handleCallEnd = () => {
      console.log("Call has ended.");
      toast("Interview ended");
      endInterview(); // use same flow as End Call button
    };

    const handleError = (err) => {
      console.error("Vapi error:", err);
      toast.error("Interview ended due to error");
      endInterview();
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




  const GenerateFeedback = async () => {
    setLoading(true)
    const currentConversation = conversationRef.current;
    console.log(currentConversation);

    const result = await axios.post("/api/ai-feedback", {
      conversation: currentConversation,
    });


    const Content = result.data.content;
    console.log("content: " + Content)
    const FINAL_CONTENT = Content.replace('```json', '').replace('```', '')
    console.log("final content: " + FINAL_CONTENT)
    // save to database


    const { data, error } = await supabase
      .from('interview-feedback')
      .insert([
        {
          userName: interviewInfo?.userName,
          userEmail: interviewInfo?.userEmail,
          interview_id: interview_id,
          feedback: JSON.parse(FINAL_CONTENT),
          recommended: JSON.parse(FINAL_CONTENT).recommendation
        },
      ])
      .select()
    console.log(data)
    router.replace('/interview/' + interview_id + '/completed')
    setLoading(false)
  };

  console.log(conversation);

  // Converts "15 mins" or "30 min" or "1 hr" into seconds
  const parseDurationToSeconds = (durationStr) => {
    if (!durationStr) return 0;

    const lower = durationStr.toLowerCase();

    if (lower.includes("hr")) {
      const hours = parseInt(lower, 10) || 0;
      return hours * 3600;
    }

    if (lower.includes("min")) {
      const minutes = parseInt(lower, 10) || 0;
      return minutes * 60;
    }

    if (lower.includes("sec")) {
      const seconds = parseInt(lower, 10) || 0;
      return seconds;
    }

    return parseInt(lower, 10) || 0; // fallback: raw number
  };

  return (
    <div className="p-20 lg:px-48 xl:px-56">
      <h2 className="font-bold text-xl flex items-center justify-between">
        AI Interview Session
        <span className="flex gap-2 items-center">
          <Timer />
          <TimerCounter duration={parseDurationToSeconds(interviewInfo?.interviewData?.duration)} onEnd={endInterview} />
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
        {/* <AlertConfirmation stopInterview={() => stopInterview()} /> */}
        {/* {!loading ? <PhoneCall className="h-12 w-12 p-3 bg-red-500 rounded-full"
          onClick={() => stopInterview()}
        /> : <Loader2Icon className="animate-spin" />} */}
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
        Interview in progress.........
      </h2>
    </div>
  );
}

export default StartInterview;

