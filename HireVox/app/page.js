import { Button } from "@/components/ui/button"
import "./globals.css"
import ClientPage from "./ClientPage"

export const metadata = {
  title: "HireVox - AI-Powered Interview Platform",
  description:
    "Streamline your hiring process with AI-driven interviews. Create customizable interview questions, share candidate links, and conduct hassle-free hiring.",
  generator: "v0.app",
}

export default function LandingPage() {
  return <ClientPage />
}
