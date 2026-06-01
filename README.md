# ⚖️ DriveLegal — Offline-First AI Compliance & Road Safety Companion

![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react) ![Node.js](https://img.shields.io/badge/Node.js-Latest-green?style=for-the-badge&logo=node.js) ![Express.js](https://img.shields.io/badge/Express.js-Latest-lightgrey?style=for-the-badge&logo=express) ![ChromaDB](https://img.shields.io/badge/ChromaDB-Latest-brightgreen?style=for-the-badge&logo=google-cloud) ![Firebase](https://img.shields.io/badge/Firebase-Latest-orange?style=for-the-badge&logo=firebase) ![Vite](https://img.shields.io/badge/Vite-Latest-bd34fe?style=for-the-badge&logo=vite)

🚀 **DriveLegal** is an offline-first, AI-powered compliance and road safety companion designed for the **Road Safety Hackathon 2026**. It helps drivers review localized traffic regulations, calculate compounding fine structures, verify vehicle registry records, perform document OCR, and test road safety awareness completely offline.

---

## 🎯 Problem Statement
Road safety regulations and challan fine structures are often complex, localized by state, and fragmented. Furthermore, drivers frequently lose cellular network coverage on highways, leaving them without access to critical compliance checks, emergency numbers, or traffic fine calculators when they need them most.

## 💡 Our Solution
DriveLegal modernizes traffic compliance and safety education by providing:

| Feature | Description |
|-----------|-------------|
| 🤖 **Offline-First AI Chatbot** | Powered by a local intent classifier and statutory matching engine, with RAG + Hugging Face Qwen-2.5 fallback when online. |
| 🧮 **Challan Fine Calculator** | Dynamic compounding fine engine with state-specific overrides for India, the USA, and the UK. |
| 🔍 **Agentic Vehicle Registry** | Instantly lookup vehicle ownership, insurance status, emissions (PUC), and active challans. |
| 📸 **Document OCR & PDF** | Optical Character Recognition via Tesseract.js to scan traffic documents, and jsPDF to export safety certificates. |
| 🏆 **Gamified Safety Quiz** | Interactive driving awareness trivia to build defensive driving habits and earn collectable badges. |

⚠️ **Disclaimer:** Statuary laws and traffic fines are subject to local amendments. This application provides calculations for educational and compliance reference purposes.

---

## ✨ Features

### 🤖 Core Intelligence (Local NLP Engine)
*   **Offline Intent Classification** — Rules-based parser classifies user intent (fines, emergency, quiz) in milliseconds entirely in the browser.
*   **Quantum-Inspired Superposition Filter** — A unique algorithm in `nlpEngine.js` that maps generative text as a superposition of semantic possibilities, collapsing them against verified database states to completely eliminate numerical hallucinations.
*   **Grounded RAG Extension** — When online, queries are routed through a Express-based ChromaDB vector database and Hugging Face's Qwen 2.5 72B Instruct model for context-rich natural language answers.

### 🚗 Agentic Vehicle Registry Lookup
*   **Active Tool-use Integration** — Chatbot recognizes license plates (e.g., `DL-03-A-1234`, `CA-99A-4040`, `UK-LX-7777`) and automatically queries a secure database.
*   **Full Document Compliance** — Inspects vehicle ownership records, insurance validity, emission compliances, and active outstanding challans.

### 🧮 Compounding Challan Calculator
*   **Multi-Region Ruleset** — Fully indexes traffic laws for **India** (MVA), **United States** (CVC / NY VTL), and the **United Kingdom** (Highway Code / RTA).
*   **State-Specific Overrides** — Accounts for localized adjustments, such as stricter overspeeding fines in Delhi NCR and California, and London's ULEZ emission charges.
*   **Demerit Points System** — Track license points penalties (such as the 6-point penalty in the UK for distracted driving).

### 🏆 Gamified Safety Profiler
*   **Safety Score Tracking** — Every driver starts with a 100-point safety profile that updates dynamically.
*   **Earn Driver Badges** — Achieve titles such as *Defensive Driver Master*, *Law-Abiding Citizen*, or *Quiz Master* based on safety quiz streaks.
*   **Local Session Syncing** — Persistent profile tracking to store quiz streaks and demerits completely offline.

---

## 🛠 Tech Stack

### 🖥️ Frontend
*   **React 19** — Modern client framework for responsive user interfaces.
*   **Vite** — Ultra-fast frontend build tooling.
*   **Firebase SDK** — Seamless user profile syncing and authentication.
*   **Tesseract.js** — Browser-based OCR library to scan driver licenses and documents completely offline.
*   **jsPDF** — Library to generate downloadable road safety compliance certificates.
*   **Lucide React** — Elegant vector iconography system.

### ⚙️ Backend & AI
*   **Node.js & Express.js** — Secure middleware API router.
*   **ChromaDB** — Scalable vector database powering semantic search and Retrieval-Augmented Generation (RAG).
*   **Hugging Face Serverless API** — Generative AI model hosting for conversational fallback (Qwen 2.5 72B Instruct).
*   **Concurrently** — Script orchestration to boot the full monorepo stack with a single command.

---

## 🔗 API Reference

### 👤 Driver Authorization & Scoring
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/register` | POST | Register a new driver profile. |
| `/api/auth/login` | POST | Authorize driver credentials. |
| `/api/auth/update-score` | POST | Sync driver safety score based on compliance. |
| `/api/auth/add-badge` | POST | Unlock a new collectible badge on user profile. |
| `/api/auth/record-quiz` | POST | Sync quiz streaks and demerit statistics. |

### 🧠 Grounded AI Chat & RAG
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/chat` | POST | Grounded AI chat incorporating ChromaDB vector context and mock vehicle tool lookups. |
| `/api/query` | POST | Direct query access to the ChromaDB legal vector collection. |
| `/api/add` | POST | Insert new statuary documents into ChromaDB. |
| `/api/health` | GET | Check connections to ChromaDB and check total document counts. |

---

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   npm or yarn

### 1️⃣ Clone the Repository
```bash
git clone <repository-url>
cd aichatbot
```

### 2️⃣ Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=3000

# Hugging Face AI Configuration
HF_TOKEN=your_huggingface_api_token
HF_MODEL=Qwen/Qwen2.5-72B-Instruct

# ChromaDB Cloud Configuration
CHROMA_API_KEY=your_chromadb_api_key
CHROMA_TENANT=your_chroma_tenant_id
CHROMA_DATABASE=your_chroma_database_name
```

### 3️⃣ Initialize Dependencies
Install dependencies for the root, frontend, and backend packages:
```bash
npm install
npm install --prefix frontend
npm install --prefix backend
```

### 4️⃣ Seed the Legal Database
Index your statutory documents and laws into the ChromaDB vector collection:
```bash
npm run seed:backend
```

### 5️⃣ Run the Application
Boot the React Vite dev server and Express backend concurrently:
```bash
npm run dev
```
🌐 **Vite Frontend:** `http://localhost:5173`  
⚙️ **Express Backend:** `http://localhost:3000`

---

## 📐 Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          DriveLegal App UI                             │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐ ┌──────────┐ ┌────────────┐ │
│  │ Law      │ │ Challan  │ │ Emergency   │ │ Document │ │ AI Chatbot │ │
│  │ Explorer │ │ Calc     │ │ Directory   │ │ OCR      │ │ Component  │ │
│  └────┬─────┘ └────┬─────┘ └──────┬──────┘ └────┬─────┘ └─────┬──────┘ │
└───────┼────────────┼──────────────┼─────────────┼─────────────┼────────┘
        │            │              │             │             │
        ▼            ▼              ▼             ▼             ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Local nlpEngine (Offline)                       │
│  ┌────────────────────────┐ ┌──────────────────────────────────────┐   │
│  │   Static Law Database  │ │ Offline Intent Classifier            │   │
│  │   (IN, US, UK Rules)   │ │ & Quantum Superposition Fact Filter  │   │
│  └────────────────────────┘ └──────────────────────────────────────┘   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Fallback when Online)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Express API Middleware                          │
│  ┌─────────────────┐ ┌────────────────────────┐ ┌────────────────────┐ │
│  │  /api/auth/     │ │  /api/chat             │ │  /api/query        │ │
│  │  (User Scoring) │ │  (Agentic Prefetching) │ │  (Vector Query)    │ │
│  └────────┬────────┘ └───────────┬────────────┘ └──────────┬─────────┘ │
└───────────┼──────────────────────┼─────────────────────────┼───────────┘
            ▼                      ▼                         ▼
┌────────────────────────┐ ┌────────────────────────┐ ┌──────────────────┐
│  Firebase DB / Auth    │ │ Hugging Face Serverless│ │  ChromaDB Cloud  │
│  ┌───────────────────┐ │ │ ┌────────────────────┐ │ │  ┌─────────────┐ │
│  │  Driver Records   │ │ │ │ Qwen 2.5 LLM       │ │ │  │ Statutory   │ │
│  │  Safety Scorecards│ │ │ │ (Generative Chat)  │ │ │  │ Documents   │ │
│  └───────────────────┘ │ │ └────────────────────┘ │ │  └─────────────┘ │
└────────────────────────┘ └────────────────────────┘ └──────────────────┘
```

---

## 📁 Project Structure

```text
aichatbot/
├── 📂 backend/                 # Express Middleware Server
│   ├── 📂 src/
│   │   ├── 📂 data/            # Static localized laws dictionary
│   │   │   └── lawDatabase.js
│   │   └── 📂 utils/           # Database layer & static rule-engine
│   │       ├── database.js
│   │       └── nlpEngine.js
│   ├── seedChroma.js           # Seeds local/cloud ChromaDB collection
│   ├── server.js               # Main Express entry point
│   └── package.json
│
├── 📂 frontend/                # React + Vite Client (Offline PWA)
│   ├── 📂 public/              # Static app assets & logos
│   └── 📂 src/
│       ├── 📂 components/      # Modular App Tabs
│       │   ├── CalculatorTab.js# Compounding fine calculations
│       │   ├── ChatbotTab.jsx  # Grounded Chat Interface
│       │   ├── EmergencyTab.jsx# Dynamic emergency directories
│       │   ├── ExplorerTab.jsx # Statutes & traffic rule browser
│       │   ├── Login.jsx       # Auth layouts
│       │   ├── Profile.jsx     # Driver scorecard & badge showcase
│       │   ├── QuizTab.jsx     # Road safety awareness trivia
│       │   └── Register.jsx
│       ├── 📂 data/            # Shared static regulations dictionary
│       ├── 📂 utils/           # Shared offline NLP Engines & Firebase SDKs
│       ├── App.css
│       ├── App.jsx             # Router and tab switcher
│       ├── main.jsx
│       └── registerServiceWorker.js
│
├── package.json                # Concurrently build scripts
└── README.md                   # Project documentation
```

---



## 🔒 Security & Privacy

*   **Offline Processing** — Document OCR scans and legal rules parsing happen entirely in your local browser sandbox. No sensitive information or user documents are sent to any external server.
*   **Stateless Secure Chat** — Conversational history remains client-side. The API routes queries through temporary token headers, ensuring zero persistent logging of search prompts.
*   **Credential Hashing** — Local profiles integrate with Firebase Auth SDKs, securing data from unauthorized endpoints.

---

## 🤝 Contributing
We welcome contributions to expand the static legal rules database to more states and countries:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/new-region`).
3. Commit your additions (`git commit -m 'Add compliance rules for Singapore'`).
4. Push to the branch (`git push origin feature/new-region`).
5. Open a Pull Request.

---

## 🙏 Acknowledgments
*   🎓 **IIT Madras & CoERS** (Centre of Excellence in Road Safety) for sponsoring the Road Safety Hackathon 2026 and providing design guidelines.
*   ⚡ **React & Vite** for ultra-fast compilation.
*   📊 **ChromaDB & Hugging Face** for the scalable vector search and Qwen model architectures.
