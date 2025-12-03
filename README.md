📄 README.md (Complete Version — Ready to Upload)
# 💬 ChatGPT Streaming App (FastAPI + OpenAI API + Modern UI)

A fully working ChatGPT-style web application with:
- ⚡ Real-time streaming responses  
- 🎨 Modern UI with loading animations  
- 🔗 FastAPI backend  
- 📦 Docker support  
- 🚀 One-click Railway deployment  
- 🔐 Environment variable support  

---

## 🚀 Deploy on Railway

Click below to deploy instantly on Railway:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?templateUrl=https://github.com/rishirajcode/custom-gpt)

> 🔧 Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual GitHub repository.

---

## 📁 Project Structure



project/
│── backend/
│ ├── main.py
│ ├── requirements.txt
│ ├── .env.example
│ ├── Dockerfile
│ └── railway.json
│
└── frontend/
├── index.html
├── styles.css
└── scripts.js


---

## 🧠 Backend Setup (FastAPI)

### 1. Install dependencies
```bash
cd backend
pip install -r requirements.txt

2. Create .env file

Copy the example file:

cp .env.example .env


Add your OpenAI key:

OPENAI_API_KEY=your_api_key_here

3. Start development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000


Your backend will now be available at:

http://localhost:8000

🎨 Frontend Setup

Simply open:

frontend/index.html


or run a basic local server:

cd frontend
python -m http.server 3000


This will allow the frontend to communicate with:

/stream

🐳 Docker Setup
Build:
docker build -t chatgpt-app .

Run:
docker run -p 8000:8000 chatgpt-app

🩺 Health Check (Required for Railway)

Your backend includes:

@app.get("/health")
def health():
    return {"status": "ok"}


Railway uses this endpoint to verify if your app is running correctly.

📦 railway.json (Deployment Config)

This file enables one-click deploy:

{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health",
    "restartPolicyType": "ON_FAILURE"
  }
}

