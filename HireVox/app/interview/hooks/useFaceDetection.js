"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function useFaceDetection() {
  const videoRef = useRef(null);
  const warningCountRef = useRef(0);
  const [isActive, setIsActive] = useState(false);
  const [noFaceDetected, setNoFaceDetected] = useState(false);
  const [multipleFacesDetected, setMultipleFacesDetected] = useState(false);
  const [shouldTerminate, setShouldTerminate] = useState(false);

  useEffect(() => {
    let stream = null;

    const startVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsActive(true);
          };
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    const checkFaceVisibility = () => {
      if (
        !videoRef.current ||
        !videoRef.current.videoWidth ||
        !videoRef.current.videoHeight
      )
        return;

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Set canvas dimensions to match the video feed
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      try {
        context.drawImage(videoRef.current, 0, 0);
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const data = imageData.data;

        // Calculate average brightness
        let totalBrightness = 0;
        let regions = [0, 0, 0, 0]; // Divide image into 4 regions for multiple face detection

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const i = (y * canvas.width + x) * 4;
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            totalBrightness += brightness;

            // Check which region this pixel belongs to
            const regionX = x < canvas.width / 2 ? 0 : 1;
            const regionY = y < canvas.height / 2 ? 0 : 1;
            const regionIndex = regionY * 2 + regionX;
            regions[regionIndex] += brightness;
          }
        }

        const avgBrightness = totalBrightness / (canvas.width * canvas.height);

        // Normalize region values
        regions = regions.map((r) => r / ((canvas.width * canvas.height) / 4));

        // Check for multiple faces by looking at brightness distribution
        const hasMultipleFaces =
          regions.filter((r) => r > 50 && Math.abs(r - avgBrightness) < 30)
            .length > 1;

        // Update face detection states
        const noFace = avgBrightness < 30 || avgBrightness > 220;
        setNoFaceDetected(noFace);
        setMultipleFacesDetected(hasMultipleFaces);

        // Increment warning counter if violations detected
        if (noFace || hasMultipleFaces) {
          warningCountRef.current += 1;

          // Check if we should terminate after 2 warnings
          if (warningCountRef.current > 2) {
            setShouldTerminate(true);
          }
        } else {
          // Reset counter if no violations
          warningCountRef.current = Math.max(0, warningCountRef.current - 0.5);
        }
      } catch (error) {
        console.error("Error processing video frame:", error);
      }
    };

    const interval = setInterval(checkFaceVisibility, 1000);
    startVideo();

    return () => {
      clearInterval(interval);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    videoRef,
    isActive,
    noFaceDetected,
    multipleFacesDetected,
    shouldTerminate,
  };
}
