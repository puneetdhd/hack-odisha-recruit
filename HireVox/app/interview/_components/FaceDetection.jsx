"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function FaceDetection({ onAnomalyDetected }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const detectionInterval = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Load the required face-api.js models
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        ]);
        setIsModelLoaded(true);
      } catch (error) {
        console.error("Error loading face detection models:", error);
      }
    };

    loadModels();

    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isModelLoaded) return;

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    startVideo();

    return () => {
      // Cleanup video stream
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isModelLoaded]);

  useEffect(() => {
    if (!isModelLoaded || !videoRef.current) return;

    const detectFaceAnomalies = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      // Check for anomalies
      if (detections.length === 0) {
        onAnomalyDetected("No face detected");
      } else if (detections.length > 1) {
        onAnomalyDetected("Multiple faces detected");
      } else {
        const detection = detections[0];

        // Check for suspicious expressions
        const expressions = detection.expressions;
        if (expressions.angry > 0.5 || expressions.disgusted > 0.5) {
          onAnomalyDetected("Suspicious expression detected");
        }
      }

      // Draw detections on canvas
      const displaySize = {
        width: videoRef.current.width,
        height: videoRef.current.height,
      };
      faceapi.matchDimensions(canvasRef.current, displaySize);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvasRef.current
        .getContext("2d")
        .clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
    };

    // Start detection loop
    detectionInterval.current = setInterval(detectFaceAnomalies, 1000);

    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, [isModelLoaded, onAnomalyDetected]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        width={640}
        height={480}
        className="rounded-lg"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0"
        width={640}
        height={480}
      />
    </div>
  );
}
