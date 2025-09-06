"use client";
import React from "react";
import { Mic, Play, Pause, Phone, CloudCog } from "lucide-react";
import { supabase } from "@/services/supabaseClient";

export default function Login() {
  //   used to sign in with google
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider:"google"
    })
    if (error) {
        console.log("error:",error.message)
    }
  }

  return (
    <div className="min-h-screen w-3/4 h-1/4 flex flex-col items-center justify-center p-20 m-auto">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-8 rounded-3xl shadow-3xl">
        {/* Header with Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-500 rounded-full p-3 mr-3">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">
              <span className="text-blue-500">Hire</span>
              <span className="text-gray-700">Vox</span>
            </h1>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-l w-full relative overflow-hidden rounded">
          {/* Background decorative elements */}
          <div className="absolute top-4 right-4 w-16 h-16 bg-blue-100 rounded-full opacity-50"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-indigo-100 rounded-full opacity-50"></div>
          <div className="absolute top-1/2 right-8 w-8 h-8 bg-blue-200 rounded-full opacity-30"></div>

          <div className="flex flex-col lg:flex-row items-center justify-between relative z-10">
            {/* Left side - Person with magnifying glass */}
            <div className="flex-1 mb-8 lg:mb-0 lg:mr-8">
              <div className="relative">
                {/* Person figure */}
                <div className="w-24 h-32 bg-blue-500 rounded-t-full mx-auto mb-4 relative">
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-blue-400 rounded-full"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-12 bg-blue-600 rounded-t-lg"></div>
                </div>

                {/* Magnifying glass */}
                <div className="absolute -right-4 top-8">
                  <div className="w-12 h-12 border-4 border-gray-400 rounded-full relative">
                    <div className="absolute -bottom-2 -right-2 w-6 h-1 bg-gray-400 rotate-45 origin-left"></div>
                  </div>
                </div>

                {/* Resume/Document */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-lg w-32 mx-auto mt-4">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full mr-2"></div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-300 rounded mb-1"></div>
                      <div className="h-2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-200 rounded"></div>
                    <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-1 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Center - Computer Screen */}
            <div className="flex-1 mb-8 lg:mb-0">
              <div className="relative">
                {/* Monitor */}
                <div className="bg-gray-800 rounded-t-2xl p-4 shadow-2xl">
                  <div className="bg-white rounded-lg p-6 h-64 relative overflow-hidden">
                    {/* Video call interface */}
                    <div className="absolute inset-4">
                      {/* Main person in call */}
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-24 bg-gradient-to-b from-orange-400 to-orange-500 rounded-lg">
                        <div className="w-12 h-12 bg-orange-300 rounded-full mx-auto mt-2"></div>
                      </div>

                      {/* Call controls */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <Mic className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
                        </div>
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                          <Phone className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Monitor stand */}
                <div className="bg-gray-700 h-8 w-20 mx-auto rounded-b-lg"></div>
                <div className="bg-gray-600 h-2 w-32 mx-auto rounded-full"></div>
              </div>
            </div>

            {/* Right side - Interview Cards */}
            <div className="flex-1 lg:ml-8">
              <div className="space-y-4">
                {/* Creative Director Card */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg mr-3 flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">
                        SENIOR RECRUITER
                      </div>
                      <div className="text-xs opacity-90">★ ★ ★ ★ ★</div>
                    </div>
                  </div>
                </div>

                {/* Product Manager Card */}
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg mr-3 flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">
                        HIRING MANAGER
                      </div>
                      <div className="text-xs opacity-90">★ ★ ★ ★ ★</div>
                    </div>
                  </div>
                </div>

                {/* Art Director Card */}
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg mr-3 flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">
                        TALENT ACQUISITION
                      </div>
                      <div className="text-xs opacity-90">★ ★ ★ ★ ★</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative plant */}
              <div className="mt-6 mx-auto w-16">
                <div className="w-12 h-16 bg-gradient-to-t from-green-600 to-green-400 rounded-t-full mx-auto relative">
                  <div className="absolute top-2 left-1 w-3 h-8 bg-green-500 rounded-full transform -rotate-12"></div>
                  <div className="absolute top-2 right-1 w-3 h-8 bg-green-500 rounded-full transform rotate-12"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-6 bg-green-400 rounded-full"></div>
                </div>
                <div className="w-16 h-4 bg-orange-400 rounded-full mx-auto -mt-1"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-12 max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to HireVox
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Sign in with Google Authentication
          </p>

          {/* Login Button */}
          <button
            onClick={signInWithGoogle} 
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-12 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 text-lg">
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
}
