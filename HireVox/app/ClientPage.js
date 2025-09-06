"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, Clock, FileText, LinkIcon, Users, Zap, Shield, BarChart3 } from "lucide-react"

export default function ClientPage() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen font-sans antialiased hirevox-theme hirevox-bg hirevox-text">
      <style jsx>{`
        .hirevox-theme {
          --hirevox-background: hsl(0 0% 100%);
          --hirevox-foreground: hsl(222.2 84% 4.9%);
          --hirevox-card: hsl(0 0% 100%);
          --hirevox-card-foreground: hsl(222.2 84% 4.9%);
          --hirevox-primary: hsl(221.2 83.2% 53.3%);
          --hirevox-primary-foreground: hsl(210 40% 98%);
          --hirevox-secondary: hsl(210 40% 96%);
          --hirevox-secondary-foreground: hsl(222.2 47.4% 11.2%);
          --hirevox-muted: hsl(210 40% 96%);
          --hirevox-muted-foreground: hsl(215.4 16.3% 46.9%);
          --hirevox-border: hsl(214.3 31.8% 91.4%);
        }
        
        .hirevox-primary {
          background-color: var(--hirevox-primary);
          color: var(--hirevox-primary-foreground);
        }
        
        .hirevox-primary:hover {
          background-color: oklch(0.50 0.15 220);
        }
        
        .hirevox-secondary {
          background-color: var(--hirevox-secondary);
          color: var(--hirevox-secondary-foreground);
        }
        
        .hirevox-text-primary {
          color: var(--hirevox-primary);
        }
        
        .hirevox-bg {
          background-color: var(--hirevox-background);
        }
        
        .hirevox-text {
          color: var(--hirevox-foreground);
        }
        
        .hirevox-card {
          background-color: var(--hirevox-card);
          color: var(--hirevox-card-foreground);
          border-color: var(--hirevox-border);
        }
        
        .hirevox-muted-bg {
          background-color: var(--hirevox-muted);
        }
        
        .hirevox-muted-text {
          color: var(--hirevox-muted-foreground);
        }
      `}</style>

      {/* Header */}
      <header className="border-b hirevox-bg/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50" style={{borderColor: 'var(--hirevox-border)'}}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full hirevox-primary">
                <Mic className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold hirevox-text">HireVox</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("features")}
                className="hirevox-muted-text hover:text-foreground transition-colors cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="hirevox-muted-text hover:text-foreground transition-colors cursor-pointer"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="hirevox-muted-text hover:text-foreground transition-colors cursor-pointer"
              >
                Pricing
              </button>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/auth">
                <Button variant="ghost" className="hirevox-muted-text hover:text-foreground">
                  Log In
                </Button>
              </Link>
              <Link href="/auth">
                <Button className="hirevox-primary">Sign Up Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="mb-6 hirevox-secondary">
                AI-Powered Hiring Platform
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6 hirevox-text">
                Streamline Your Hiring Process with <span className="hirevox-text-primary">AI-Driven Interviews</span>
              </h1>
              <p className="text-xl hirevox-muted-text text-balance mb-8 max-w-2xl">
                Create customizable interview questions, share candidate links, and conduct hassle-free hiring with
                our intelligent interview platform designed for modern hiring managers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/auth">
                  <Button size="lg" className="hirevox-primary px-8">
                    Start Free Trial
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="px-8 bg-transparent" style={{borderColor: 'var(--hirevox-border)'}}>
                  Watch Demo
                </Button>
              </div>
              <p className="text-sm hirevox-muted-text mt-4">No credit card required • 14-day free trial</p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img
                src="https://t4.ftcdn.net/jpg/05/88/10/29/360_F_588102950_BSSyCfB9AFqSlzx8Rn1cpDSdfrCVCscu.jpg"
                alt="Hiring manager conducting AI-powered interview with candidate"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 hirevox-muted-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4 hirevox-text">Key Features</h2>
            <p className="text-xl hirevox-muted-text text-balance max-w-2xl mx-auto">
              Explore the powerful features that make HireVox the ultimate AI-powered interview platform.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="shadow-md hirevox-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 hirevox-text-primary" />
                  <span>AI-Powered Interviews</span>
                </CardTitle>
                <CardDescription className="hirevox-muted-text">
                  Generate smart interview questions tailored to the job description.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="hirevox-muted-text">
                  Our AI algorithms analyze job requirements and create relevant questions to assess candidates
                  effectively.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md hirevox-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 hirevox-text-primary" />
                  <span>Resume Analysis</span>
                </CardTitle>
                <CardDescription className="hirevox-muted-text">Automatically extract key information from resumes.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="hirevox-muted-text">
                  Save time and effort with our resume analysis feature, which highlights relevant skills and
                  experience.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md hirevox-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LinkIcon className="h-5 w-5 hirevox-text-primary" />
                  <span>Shareable Interview Links</span>
                </CardTitle>
                <CardDescription className="hirevox-muted-text">Easily share interview links with candidates.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="hirevox-muted-text">
                  Generate unique interview links and send them to candidates for a seamless interview experience.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md hirevox-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 hirevox-text-primary" />
                  <span>Asynchronous Interviews</span>
                </CardTitle>
                <CardDescription className="hirevox-muted-text">Conduct interviews at any time, from anywhere.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="hirevox-muted-text">
                  Our platform supports asynchronous interviews, allowing candidates to complete interviews at their
                  convenience.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md hirevox-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 hirevox-text-primary" />
                  <span>Candidate Management</span>
                </CardTitle>
                <CardDescription className="hirevox-muted-text">Manage candidates and track their progress in one place.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="hirevox-muted-text">
                  Keep track of all your candidates, their interview status, and results in a centralized dashboard.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md hirevox-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 hirevox-text-primary" />
                  <span>Detailed Analytics</span>
                </CardTitle>
                <CardDescription className="hirevox-muted-text">Get insights into candidate performance with detailed analytics.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="hirevox-muted-text">
                  Access comprehensive analytics and reports to evaluate candidate performance and make data-driven
                  hiring decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4 hirevox-text">Simple 3-Step Process</h2>
            <p className="text-xl hirevox-muted-text text-balance max-w-2xl mx-auto">
              Get started with HireVox in minutes and transform your hiring process.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full hirevox-primary text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <div className="mb-6">
                <img
                  src="/professional-person-setting-up-ai-interview-on-com.png"
                  alt="Setting up AI interview"
                  className="mx-auto rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 hirevox-text">Create Interview</h3>
              <p className="hirevox-muted-text">
                Input job title, description, and select interview type. Choose duration and enable resume analysis
                if needed.
              </p>
            </div>

            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full hirevox-secondary text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <div className="mb-6">
                <img
                  src="/person-sending-interview-link-via-email-with-digit.png"
                  alt="Sharing interview link digitally"
                  className="mx-auto rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 hirevox-text">Share Link</h3>
              <p className="hirevox-muted-text">
                Generate and share the interview link with candidates. They can access it anytime and upload their
                resume if required.
              </p>
            </div>

            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full hirevox-primary text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <div className="mb-6">
                <img
                  src="/hiring-manager-analyzing-ai-generated-interview-re.png"
                  alt="Analyzing AI interview results"
                  className="mx-auto rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 hirevox-text">Review Results</h3>
              <p className="hirevox-muted-text">
                Access detailed interview results, AI-generated insights, and make informed hiring decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 hirevox-muted-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4 hirevox-text">
              Unlock the Power of AI in Your Hiring Process
            </h2>
            <p className="text-xl hirevox-muted-text text-balance max-w-2xl mx-auto">
              Discover the benefits of using HireVox for your recruitment needs.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="shadow-md hirevox-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 hirevox-text-primary" />
                  <span>Save Time and Resources</span>
                </CardTitle>
                <CardDescription className="hirevox-muted-text">Automate your hiring process and reduce manual effort.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="hirevox-muted-text">
                  HireVox automates the interview process, saving you valuable time and resources. Focus on
                  strategic tasks while our AI handles the initial screening.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md hirevox-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 hirevox-text-primary" />
                  <span>Reduce Bias</span>
                </CardTitle>
                <CardDescription className="hirevox-muted-text">Ensure fair and unbiased candidate evaluations.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="hirevox-muted-text">
                  Our AI-driven platform ensures fair and unbiased candidate evaluations, promoting diversity and
                  inclusion in your hiring process.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md hirevox-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 hirevox-text-primary" />
                  <span>Data-Driven Decisions</span>
                </CardTitle>
                <CardDescription className="hirevox-muted-text">Make informed hiring decisions with detailed analytics.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="hirevox-muted-text">
                  Access comprehensive analytics and reports to evaluate candidate performance and make data-driven
                  hiring decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-8 hirevox-text">
              Ready to Transform Your Hiring Process?
            </h2>
            <p className="text-xl hirevox-muted-text text-balance max-w-3xl mx-auto mb-12">
              Start your free trial today and experience the power of AI-driven interviews. Streamline your
              recruitment process and make smarter hiring decisions with HireVox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="hirevox-primary px-8">
                  Start Free Trial
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 bg-transparent" style={{borderColor: 'var(--hirevox-border)'}}>
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t hirevox-muted-bg" style={{borderColor: 'var(--hirevox-border)'}}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full hirevox-primary">
                  <Mic className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold hirevox-text">HireVox</span>
              </div>
              <p className="hirevox-muted-text mb-4 max-w-md">
                AI-driven interviews for hassle-free hiring. Streamline your recruitment process with intelligent
                automation.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 hirevox-text">Product</h3>
              <ul className="space-y-2 hirevox-muted-text">
                <li>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="hover:text-foreground transition-colors cursor-pointer"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("pricing")}
                    className="hover:text-foreground transition-colors cursor-pointer"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <Link href="/auth" className="hover:text-foreground transition-colors">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 hirevox-text">Support</h3>
              <ul className="space-y-2 hirevox-muted-text">
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center hirevox-muted-text" style={{borderColor: 'var(--hirevox-border)'}}>
            <p>&copy; 2025 HireVox. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}