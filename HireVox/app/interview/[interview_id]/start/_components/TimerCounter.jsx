"use client";
import React, { useEffect, useState, useRef } from "react";

function TimerCounter({ duration, onEnd }) {
  const [timeLeft, setTimeLeft] = useState(duration); // duration in seconds
  const hasEnded = useRef(false); // prevent double-calling onEnd

  useEffect(() => {
    if (timeLeft <= 0 && !hasEnded.current) {
      hasEnded.current = true;
      onEnd?.(); // stop interview once timer hits 0
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onEnd]);

  // Format hh:mm:ss
  const formatTime = (secs) => {
    const hours = String(Math.floor(secs / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const seconds = String(secs % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return <span>{formatTime(timeLeft)}</span>;
}

export default TimerCounter;
