# AcademiaERP — Gamified Academic ERP & Engagement Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)](https://fastapi.tiangolo.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748)](https://www.prisma.io/)

> **A production-grade, full-stack Academic ERP engineered for modern higher education institutions.** Integrates standard academic administration, behavioral engagement gamification (server-side, tamper-resistant, decoupled from grades), and an advisory AI stylometric validation microservice with strict faculty supremacy.

---

## 🌟 System Highlights & Key Innovations

### 1. Unified 3-Tier Enterprise Architecture
* **Frontend Portal (`/frontend`):** Built with React 18, TypeScript, Tailwind CSS, Lucide React, and Recharts. Designed with a custom violet gradient SaaS aesthetic (`#6547F5` to `#8B5CF6`, `#191A2E` dark accents, 18–22px card corner radii, and accessible contrasts). Features a persistent **Quick Persona Switcher** for instantaneous evaluation across roles.
* **Backend API (`/backend`):** High-performance Express + TypeScript service using Prisma ORM. Offers dual-database support: zero-config SQLite (`dev.db`) for immediate offline evaluation and PostgreSQL for production (Supabase-ready). Includes JWT authentication, RBAC guards, automated security audit trails, and an idempotent gamification engine.
* **AI Validation Microservice (`/ai-service`):** Python FastAPI service providing CPU-friendly, interpretable stylometric NLP (Shannon entropy, sentence burstiness variance, Type-Token Ratio, formulaic syntax markers). Decoupled and strictly advisory with mandatory faculty disposition logging.

### 2. Behavioral Gamification Engine (Zero Grade Compromise)
* **Separation of Concerns:** Academic marks (grades/GPA) are completely decoupled from XP and leaderboards. High XP can never inflate grades; academic integrity remains absolute.
* **Server-Side Idempotency:** Duplicate triggers (e.g. marking the same attendance session twice or resubmitting) check unique composite keys (`STUDENT_SESSION_DATE`, `STUDENT_SUBMISSION_EARLY`) so XP is never exploited.
* **Dynamic Streak Counter:** Daily attendance updates contiguous streak counts with milestone badges (3-Day Scholar, 5-Day Master).
* **Transparent XP Rule Engine:** Administrators can dynamically update base XP values and cooldowns with automated audit versioning.
* **Reward Catalog:** XP redemption for genuine collegiate perks (Priority Library Desk, Cafeteria Voucher, Wi-Fi Fast Lane) with automated balance validation.

### 3. Ethical AI Assignment Validation (Faculty Supremacy)
* **Interpretable Stylometrics:** Computes quantifiable signals rather than opaque black-box probability:
  * **Sentence Length Burstiness:** Standard deviation of sentence word counts (human prose exhibits high rhythm variance; uniform burstiness suggests LLM generation).
  * **Shannon Information Entropy:** Word-level uncertainty distribution.
  * **Vocabulary Richness:** Type-Token Ratio (TTR) and Hapax Legomena ratio.
  * **Formulaic Transition Density:** Detection of overused AI transition anchors (*"In conclusion"*, *"Moreover"*, *"Delve"*, *"It is important to remember"*).
* **Advisory Only:** No student is ever penalized automatically by AI. Every flagged submission routes to the Faculty AI Review queue.
* **Discretionary Faculty Review:** Faculty can inspect stylometric metrics, read the paper, and log an official disposition (`CLEARED`, `FLAGGED_ORAL_DEFENSE`, `REVISION_REQUESTED`, `PENALIZED`) with required written rationale.
* **Resilience Fallback:** If the Python microservice is offline, the backend's built-in lightweight stylometric engine processes submissions seamlessly without downtime.

---

## 🔑 Demo Personas & Credentials

The database comes pre-seeded with realistic courses, attendance records, submissions, AI assessments, XP rules, badges, and audit trails.

| Role | Name | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | Dr. Vikram Sethi | `admin@academia.edu` | `Admin@123` | System oversight, user provisioning, XP rule versioning, AI fairness governance, audit log inspection |
| **Faculty** | Prof. Rajesh Sharma | `prof.sharma@academia.edu` | `Faculty@123` | Course roster, date-based attendance marking, assignment creation, rubric grading, AI stylometric review |
| **Student** | Ayush Srivastava | `ayush.student@academia.edu` | `Student@123` | Course overview, timetable, attendance tracker, assignment submission, XP & streak dashboard, badges, rewards store |
| **Student (Alt)** | Priya Patel | `priya.patel@academia.edu` | `Student@123` | Top-ranked student on the leaderboard |
| **Student (Alt)** | Rohit Kumar | `rohit.kumar@academia.edu` | `Student@123` | Student with streak activity |
| **Student (Alt)** | Sneha Verma | `sneha.verma@academia.edu` | `Student@123` | High assignment submission count |

> **Pro Tip:** In the web application, use the violet floating badge at the bottom-right of your screen (**⚡ Quick Switch**) to switch between Admin, Faculty, and Student roles with a single click without typing credentials.

---

## 📁 Repository Structure

```text
gamei/
├── package.json                 # Root orchestrator with unified npm scripts
├── .env.example                 # Central environment variable reference
├── README.md                    # Project documentation
│
├── backend/                     # Node.js + Express + TypeScript + Prisma
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── prisma/
│   │   ├── schema.prisma        # PostgreSQL / Supabase production schema
│   │   ├── schema.sqlite.prisma # SQLite zero-config local dev schema
│   │   ├── seed.ts              # Rich synthetic data seeder
│   │   └── dev.db               # Pre-seeded SQLite database
│   ├── src/
│   │   ├── config/              # Environment & Prisma client initialization
│   │   ├── controllers/         # Auth, Student, Faculty, Admin, Public controllers
│   │   ├── middleware/          # JWT auth, RBAC guards, audit logger, error handler
│   │   ├── routes/              # Modular Express routing
│   │   ├── services/            # Gamification engine & AI fallback client
│   │   └── server.ts            # Express server entrypoint
│   └── tests/
│       └── run-tests.ts         # Automated backend test suite (7/7 suites)
│
├── frontend/                    # Vite + React 18 + TypeScript + Tailwind CSS
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── components/          # Reusable UI primitives (Card, Button, Badge, Modal, Layout)
│   │   ├── context/             # AuthContext with auto-persistence & quick switcher
│   │   ├── pages/
│   │   │   ├── landing/         # SaaS Landing page (Hero, pillars, AI ethics, FAQ)
│   │   │   ├── auth/            # Login, Register, Forgot Password
│   │   │   ├── student/         # Dashboard, Courses, Assignments, Attendance, Gamification, Timetable
│   │   │   ├── faculty/         # Dashboard, Assignments & Grading, Attendance Marker, AI Stylometrics Review
│   │   │   └── admin/           # Dashboard, User Admin, XP Rules, AI Governance, Audit Logs
│   │   ├── services/            # Axios API client with bearer token interceptor
│   │   └── App.tsx              # Role-guarded route definitions
│
└── ai-service/                  # Python 3.10+ FastAPI Stylometric NLP Microservice
    ├── requirements.txt
    ├── main.py                  # FastAPI app endpoints (/health, /analyze/text, /analyze/file)
    ├── analyzer.py              # Stylometric engine (entropy, burstiness, TTR, markers)
    ├── extractors.py            # PDF and DOCX text extractors
    └── test_ai_service.py       # Microservice unit tests
```

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher
* **Python:** v3.10 or higher (optional: only required if running the dedicated Python AI microservice; backend includes automatic CPU fallback)

---

### Step 1: Install Dependencies

From the repository root `gamei/`:
```bash
npm run setup
```
*(Or install manually in both folders)*:
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

### Step 2: Database Initialization (Zero Setup SQLite)

The repository already comes with a populated `backend/prisma/dev.db`. To re-seed or regenerate fresh synthetic data anytime:
```bash
cd backend
npm run db:seed
```

*(Optional: If you wish to use PostgreSQL / Supabase, simply set `DATABASE_URL` in `backend/.env` to your Postgres connection string and run `npx prisma db push --schema=prisma/schema.prisma`)*.

---

### Step 3: Run the Development Servers

#### Option A: Single Command (Recommended)
From the root `gamei/` directory, start both the backend and frontend concurrently:
```bash
npm run dev
```
* Backend: `http://localhost:5000` (API & Health Check: `http://localhost:5000/api/public/health`)
* Frontend: `http://localhost:5173`

#### Option B: Separate Terminal Windows
If you prefer running the services independently:

**Terminal 1 — Backend API (Port 5000)**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend Application (Port 5173)**
```bash
cd frontend
npm run dev
```

**Terminal 3 (Optional) — Python AI Microservice (Port 8000)**
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*(If omitted, the backend's local stylometric engine automatically takes over without any interruption).*

---

## 🧪 Testing & Verification

### Backend Automated Test Suite
To run all 7 automated unit and integration suites (Password hashing, JWT auth, RBAC permissions, Idempotent Gamification, XP calculations, Assignment submission lifecycle, and Audit trails):
```bash
cd backend
npm test
```
**Result:** 7/7 suites pass with 0 errors.

### Python AI Microservice Test Suite
To verify the stylometric NLP algorithms (Shannon entropy, burstiness variance, PDF extraction):
```bash
cd ai-service
python test_ai_service.py
```
**Result:** 4/4 test suites pass with 0 errors.

### Frontend Production Build
To verify TypeScript strict compliance and production asset bundling:
```bash
cd frontend
npm run build
```

---

## 🌐 Free-Tier Cloud Deployment Guide

### Option A: Frontend on Vercel / Netlify
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Set **Build Command** to `npm run build` and **Output Directory** to `dist`.
4. Configure Environment Variable:
   ```env
   VITE_API_URL=https://your-backend-service.onrender.com/api
   ```

### Option B: Backend on Render / Railway
1. Create a Web Service on [Render](https://render.com) pointing to the `backend` folder.
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`
4. Configure Environment Variables:
   ```env
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-secure-production-jwt-secret
   CORS_ORIGIN=https://your-frontend.vercel.app
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
   ```

### Option C: Database on Supabase (PostgreSQL)
1. Create a free PostgreSQL project at [Supabase](https://supabase.com).
2. Copy your Connection String from *Project Settings > Database*.
3. Run `npx prisma db push --schema=prisma/schema.prisma` from `backend/`.
4. Run `npm run db:seed` to populate sample data.

---

## 🛡️ Security, Governance & AI Ethics Statement

1. **Academic Supremacy:** Academic performance metrics and transcripts are calculated purely from faculty rubric evaluations (`Submission.grade`). Gamification XP points (`User.xp`) and rank badges are tracked in an isolated ledger (`XpTransaction`) and do not influence GPA.
2. **Audit Accountability:** Every role transition, user status change, attendance session closure, and grade submission automatically logs immutable records into the `AuditLog` table with timestamp, IP address, and JSON diffs.
3. **Transparent Heuristic Signals:** The AI microservice explicitly provides measurable stylometric signals (sentence variance, entropy, TTR) alongside a disclaimer: *"Heuristic analysis is probabilistic and advisory only. Faculty review is mandatory before any academic disposition is determined."*

---

## 👨‍💻 Project Information

* **Project:** Gamified ERP System for Academic Management and Student Engagement
* **Author:** Ayush Srivastava
* **Degree:** B.Tech Computer Science & Engineering
* **License:** MIT License — Open for academic demonstration and evaluation.
