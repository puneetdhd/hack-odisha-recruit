import React from 'react'
import { Home, ArrowRight, Check, Send, Clock } from 'lucide-react';
import Link from 'next/link';

const InterviewComplete = () => {
  return (
    <div className="bg-white text-white font-sans min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center space-y-6 sm:space-y-8 py-8 px-4 sm:px-6 lg:px-8">
        {/* Success Icon */}
        <div className="rounded-full bg-green-500 p-3 sm:p-4">
          <Check className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
        </div>

        {/* Heading */}
        <h1 className="text-primary text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
          Interview Complete!
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg text-gray-600 text-center max-w-2xl">
          Thank you for participating in the AI-driven interview with Alcruiter
        </p>

        {/* Next Steps Card */}
        <div className="bg-blue-500 rounded-xl p-6 sm:p-8 shadow-lg w-full max-w-xl space-y-4">
          <div className="flex items-center justify-center rounded-full bg-white w-12 h-12 mx-auto">
            <Send className="h-6 w-6 text-blue-400" />
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold text-center">
            What's Next?
          </h2>

          <p className="text-gray-300 text-center text-sm sm:text-base">
            The recruiter will review your interview responses and will contact you soon regarding the next steps.
          </p>

          <div className="flex items-center justify-center text-gray-200 font-bold text-xs sm:text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>Response within 2-3 business days</span>
          </div>
        </div>

        
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-gray-600 text-center py-4 px-4">
        <p className="text-xs sm:text-sm">
          &copy; 2025 HireVox. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default InterviewComplete;