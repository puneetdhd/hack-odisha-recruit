# HireVox 🤖💼  
**HireVox – Your AI-Powered Recruiter for Smarter, Faster, and Fairer Hiring**  

---

## 📖 About HireVox  

HireVox is an **AI-powered recruitment platform** that streamlines the entire hiring journey — from resume parsing to AI-driven interviews and feedback generation. Recruiters simply provide a job description, and HireVox handles the rest: generating smart questions, scheduling interviews, conducting voice-based assessments, scoring candidates fairly, and flagging suspicious behavior. With real-time analytics, cheat prevention, and ATS integration, HireVox empowers companies to hire **faster, smarter, and without bias**.  

This project was developed by **Team [CodeBlooded]** and submitted for **[HackOdisha + 2025]**.  

🚀 **Live here** – [Add your deployed link]  

---

## 🌟 Features  

- ✨ **Resume Parsing & Ranking with AI**  
  Automatically extracts and ranks candidate resumes to save recruiters hours of manual work.  

- 🗣️ **AI-Powered Interview (Voice/Chat)**  
  Conducts structured interviews in real-time using AI voice/chat agents, ensuring consistent and unbiased questioning.  

- 📊 **Smart Scoring & Feedback**  
  Analyzes candidate responses, generates unbiased scores, and provides recruiters with structured feedback and recommendations.  

- 📈 **Recruiter Dashboard with Analytics**  
  Centralized dashboard to view candidate rankings, insights, and hiring metrics.    

- 🛡️ **Cheat Prevention**  
  Detects if a candidate switches tabs, delays answers unnaturally, or tries to cheat — and flags or ends the interview.  

---

## 🛠️ Tech Stack  

- **Frontend:** Next.js ⚛️ + TailwindCSS 🎨  
- **Backend:** Node.js 🟢 + gofr (for resume parsing)  
- **AI Models:**  
  - Akask ChatAPI (Meta-Llama-3-1-8B-Instruct-FP8) → Question generation  
  - Vapi Voice Agent 🎙️ → AI-powered voice interviews  
  - OpenRouter API (GPT-3.5-Turbo) → Feedback & scoring  
- **Database:** Supabase 🗄️  
- **Cloud:** Akash Networks ☁️  

---

## 🔄 Workflow / How It Works  

### 👨‍💼 Recruiter Side  
1. Enters job title, description, interview duration, and question type.  
2. AI generates interview questions (editable by recruiter).  
3. Recruiter shares interview link via email/dashboard.  
4. Receives candidate reports with AI-generated scores, feedback & recommendations.  

### 👩‍💻 Candidate Side  
1. Opens interview link → fills name, email, and uploads resume.  
2. AI generates role + resume-specific questions.  
3. Candidate joins full-screen AI interview (voice/chat).  
4. Responses are analyzed → feedback & scoring generated.  
5. Cheating prevention system monitors behavior.  

---

## 🚀 Getting Started Locally  

### Clone the Repository  
```bash
git clone https://github.com/your-username/hirevox.git
```

### 2️⃣ Install Frontend Dependencies
```bash
cd voice-prep-ai
npm install
```

### 3️⃣ Run the Frontend
```bash
npm run dev
```
### 4️⃣ Install Backend Dependencies
```bash
cd resume-parser
npm install
```

## 🔑 Environment Variables

Create a `.env.local` file in the **frontend** directory with the following variables:

```ini
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>

OPENROUTER_API_KEY=<your-openrouter-api-key>

NEXT_PUBLIC_HOST_URL=http://localhost:3000/interview

NEXT_PUBLIC_VAPI_API_KEY=<your-vapi-api-key>

AKASH_API_KEY=<your-akash-api-key>
```

### 5️⃣ Run the Backend (gofr)
```bash
go run main.go
```
## 🚀 Future Enhancements  

- 📹 AI-based video interviews with facial expression analysis  
- 🔔 Real-time recruiter notifications  
- 📲 Mobile app for candidate interviews  
- 📊 Advanced analytics & predictive hiring metrics  
- 🏢 Marketplace integrations with Workday, Lever, and Greenhouse  

---

## 👥 Team [CodeBlooded]  

- [Monalisha Patra] – developer  
- [Puneet kumar dhal] – developer  
- [Utkal Kumar Das] – developer  
- [RudraMadhab Das] – developer  

---

## 🤝 Contributing  

We welcome contributions! Please fork this repo, create a feature branch, and open a pull request.  

---

## 📄 License  

This project is licensed under the **MIT License**.  

---

## 🙏 Acknowledgements  

- Akask for ChatAPI (LLM integration)  
- Vapi for AI voice agents  
- OpenRouter for GPT-3.5 feedback generation  
- Supabase for database & auth  
- Akash Networks for decentralized cloud hosting  

---

✨ **Hire smarter, not harder — with HireVox!**

