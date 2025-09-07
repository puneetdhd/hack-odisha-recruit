# HireVox 🤖💼  
**HireVox – Your AI-Powered Recruiter for Smarter, Faster, and Fairer Hiring**  

---

## 📖 About HireVox  

HireVox is an **AI-powered recruitment platform** that streamlines the hiring journey — from resume parsing to AI-driven interviews and feedback generation. Recruiters simply provide a job description, and HireVox handles the rest: generating smart questions, scheduling interviews, conducting voice-based assessments, scoring candidates fairly, and preventing cheating through webcam anomaly detection and tab-switch monitoring. With real-time analytics, and voice verification, HireVox empowers companies to hire **faster, smarter, and without bias**.  
  

This project was developed by **Team CodeBlooded** and submitted for **HackOdisha + 2025**.  

🚀 **Live here** – [Add your deployed link]  <br>
🎥 **Project Video Summary** – [Watch here](https://drive.google.com/file/d/1mKZhitHwCqo2bVEE2RxYlrkpSQgytOS_/view?usp=drive_link) <br>
📑 **Slides (PPT)** - [PPT link](https://drive.google.com/file/d/1Ax21DY6jHHFWkq9G7nVUvuLBJPlM8Lh8/view?usp=sharing)
---

## ☁️ Deployment on Akash

### Akash Wallet Address:

```bash
akash18czr8t9lmdvn8vwuzqxz63evy3s0z5t32gjrnc
```

- SDL File: See deploy.yml in the repo.

- The project is deployed and hosted using Akash Network for decentralized GPU cloud compute.

## 🌟 Features  

- ✨ **Resume Parsing & Ranking with AI**  
  Automatically extracts and ranks candidate resumes to save recruiters hours of manual work.  

- 🗣️ **AI-Powered Interview (Voice)**  
  Conducts structured interviews in real-time using AI voice agents, ensuring consistent and unbiased questioning.  

- 🔊 **Voice Verification**  
  Matches candidate’s voice with pre-recorded samples to verify identity and prevent impersonation during interviews.  

- 📊 **Smart Scoring & Feedback**  
  Analyzes candidate responses, generates unbiased scores, and provides recruiters with structured feedback and recommendations.  

- 📈 **Recruiter Dashboard with Analytics**  
  Centralized dashboard to view candidate rankings, insights, and hiring metrics.    

- 🛡️ **Cheat Prevention & Anomaly Detection**  
  - Warns candidates if they switch tabs twice; ends interview on the third attempt.  
  - Uses **webcam anomaly detection** to flag unusual activities (e.g., multiple faces, frequent distractions, mobile usage).  

---

## 🛠️ Tech Stack  

- **Frontend:** Next.js ⚛️ + TailwindCSS 🎨  
- **Backend:** Next.js 🟢 + gofr (for resume parsing), Flask (Python) for voice verification APIs  
- **AI Models:**  
  - Akash ChatAPI (Meta-Llama-3-1-8B-Instruct-FP8) → Question generation  
  - Vapi Voice Agent 🎙️ → AI-powered voice interviews  
  - OpenRouter API (GPT-3.5-Turbo) → Feedback & scoring  
- **Other Services:**  
  - Supabase 🗄️ → Database & authentication  
  - face-api.js 👁️ → Webcam anomaly detection  
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
4. System verifies candidate’s voice to prevent impersonation.  
5. Responses analyzed → feedback & scoring generated.  
6. Cheating prevention system monitors tab-switching and webcam anomalies.  

---

## 🚀 Getting Started Locally  

### 1️⃣ Clone the Repository  
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

### 5️⃣ Run the Backend (gofr)
```bash
go run main.go
```
### 6️⃣ Setup & Run Python Backend (Voice Monitor)
```bash
cd ./voice-monitor
```
### Create a virtual environment:
```bash
python -m venv .venv
```
### Activate the virtual environment:
- **Windows (PowerShell)**
  ```bash
  .\.venv\Scripts\Activate
  ```
- **Linux / macOS**
  ```bash
  source .venv/bin/activate
  ```
### Install dependencies:
```bash
pip install -r requirements.txt
```
### Run the Python voice server:
```bash
python voice_server.py
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
For `Akash Deployment Configuration` (set these in your environment):

```ini
# Akash Deployment Configuration
AKASH_KEY_NAME=your_key_name
AKASH_NODE=https://rpc.akash.network:443
AKASH_CHAIN_ID=akashnet-2
AKASH_ACCOUNT_ADDRESS=your_akash_wallet_address

# Docker Configuration
DOCKER_USERNAME=<docker-username>
DOCKER_PASSWORD=<docker-password>
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

- Akash for ChatAPI (LLM integration)  
- Vapi for AI voice agents  
- OpenRouter for GPT-3.5 feedback generation  
- Supabase for database & auth  
- Akash Networks for decentralized cloud hosting
- face-api.js for webcam anomaly detection  

---

✨ **Hire smarter, not harder — with HireVox!**








