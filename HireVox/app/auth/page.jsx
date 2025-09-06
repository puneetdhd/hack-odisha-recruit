"use client";
import React, { useEffect, useState } from "react";
import {
  Mic,
  Play,
  Pause,
  Phone,
  CloudCog,
  Sparkles,
  Users,
  Video,
  Zap,
  Loader2,
} from "lucide-react";
import { supabase } from "@/services/supabaseClient";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/provider";

export default function Login() {
  const router = useRouter();
  const { user } = useUser();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    // Redirect to /dashboard if already logged in
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Small delay to prevent flickering during rapid state changes
        const timeout = setTimeout(() => {
          router.replace("/dashboard");
        }, 100);
        return () => clearTimeout(timeout);
      }
    };
    checkUser();
  }, [router]);

  //   used to sign in with google
  const signInWithGoogle = async () => {
    if (isSigningIn) return;

    setIsSigningIn(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) {
        console.log("error:", error.message);
        setIsSigningIn(false);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left section - Hero */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-16">
          <div className="max-w-2xl text-center lg:text-left w-full">
            {/* Logo and branding */}
            <div className="flex items-center justify-center lg:justify-start mb-6 sm:mb-8">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 sm:p-4 shadow-2xl">
                  <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-400 animate-ping"></div>
              </div>
              <div className="ml-3 sm:ml-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Hire
                  </span>
                  <span className="text-blue-900">Vox</span>
                </h1>
                <p className="text-blue-600 text-xs sm:text-sm font-medium">
                  AI-Powered Recruitment
                </p>
              </div>
            </div>

            {/* Hero text */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-5xl font-bold text-blue-900 mb-4 sm:mb-6 leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {" "}
                Hiring Process{" "}
              </span>
              with AI
            </h2>

            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-blue-700 mb-8 sm:mb-12 leading-relaxed">
              Conduct intelligent interviews, analyze candidates with precision,
              and make data-driven hiring decisions - all powered by advanced AI
              technology.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 flex items-center justify-center">
                  <Video className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <span className="text-sm sm:text-base text-blue-800">
                  AI-Powered Interviews
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 flex items-center justify-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <span className="text-sm sm:text-base text-blue-800">
                  Smart Candidate Analysis
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 flex items-center justify-center">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <span className="text-sm sm:text-base text-blue-800">
                  Real-time Feedback
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <span className="text-sm sm:text-base text-blue-800">
                  Automated Screening
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right section - Login form */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-16">
          <div className="w-full max-w-md">
            {/* Login card */}
            <div className="bg-white border border-blue-200 shadow-2xl p-6 sm:p-8 lg:p-12">
              {/* Welcome text */}
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 mb-2">
                  Welcome Back
                </h3>
                <p className="text-sm sm:text-base text-blue-700">
                  Sign in to access your AI recruitment dashboard
                </p>
              </div>

              {/* Interactive demo preview */}
              <div className="mb-6 sm:mb-8 relative group">
                <div className="bg-white border border-blue-200 p-4 sm:p-6 shadow-lg transition-all duration-300 group-hover:border-blue-300">
                  {/* Mock interview interface */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 animate-pulse"></div>
                      <span className="text-xs sm:text-sm text-blue-700">
                        Live Interview
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-blue-600">
                      02:34
                    </div>
                  </div>

                  {/* Mock candidate */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm sm:text-base">
                          JS
                        </span>
                      </div>
                      <div>
                        <p className="text-blue-900 font-medium text-sm sm:text-base">
                          John Smith
                        </p>
                        <p className="text-blue-700 text-xs sm:text-sm">
                          Frontend Developer
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mock AI analysis */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 text-xs sm:text-sm">
                        Technical Skills
                      </span>
                      <div className="flex space-x-1">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500"
                          ></div>
                        ))}
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-300"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 text-xs sm:text-sm">
                        Communication
                      </span>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500"
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Login button */}
              <button
                onClick={signInWithGoogle}
                disabled={isSigningIn}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  {isSigningIn ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span className="text-sm sm:text-base">
                        Signing in...
                      </span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span className="text-sm sm:text-base">
                        Continue with Google
                      </span>
                    </>
                  )}
                </div>
              </button>

              {/* Additional info */}
              <div className="mt-4 sm:mt-6 text-center">
                <p className="text-blue-600 text-xs sm:text-sm">
                  Secure authentication powered by Google
                </p>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-6 sm:mt-8 text-center">
              <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-blue-600">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500"></div>
                  <span className="text-xs sm:text-sm">Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500"></div>
                  <span className="text-xs sm:text-sm">Fast</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500"></div>
                  <span className="text-xs sm:text-sm">AI-Powered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}