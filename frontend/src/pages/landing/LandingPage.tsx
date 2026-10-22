import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Cpu,
  Trophy,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  CalendarCheck2,
  Users,
  ChevronDown,
  Layers,
  Award,
  Zap,
  BarChart3,
  Lock,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { QuickRoleSwitcher } from '../../components/ui/QuickRoleSwitcher';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeRoleTab, setActiveRoleTab] = useState<'student' | 'faculty' | 'admin'>('student');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the Gamification Engine determine student XP awards?',
      a: 'XP is calculated strictly through verified academic behaviors rather than exam grades. Students earn XP for on-time assignment delivery (+50 XP), 24h early submissions (+25 XP), lecture attendance consistency (+15 XP), and maintaining 7-day or 14-day engagement streaks. Official marks are never altered or inflated by XP or leaderboard rankings.',
    },
    {
      q: 'What is the role of the AI-Assisted Assignment Validation microservice?',
      a: 'The microservice provides CPU-friendly stylometric decision-support (Shannon entropy, sentence length variability, and lexical diversity metrics). It does NOT grade students, deduct points, or make automated misconduct declarations. It serves solely as an advisory indicator, and faculty members retain exclusive authority over all academic integrity evaluations.',
    },
    {
      q: 'How are leaderboards configured and reset?',
      a: 'The platform maintains dynamic Monthly Class Leaderboards and Semester Course Leaderboards with stable tie-breaking. At the end of each monthly cycle, monthly balances reset to offer a second chance for every student, while lifetime XP and verified transaction histories remain permanently preserved.',
    },
    {
      q: 'What security protections are implemented for institutional records?',
      a: 'AcademiaERP implements server-side Role-Based Access Control (RBAC), bcrypt password hashing, JWT authentication, and cryptographic idempotency keys on all XP transactions to prevent duplicate awarding. Audit logs capture administrative changes, grading events, and AI review dispositions.',
    },
  ];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col selection:bg-brand-lavender selection:text-brand-primary">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-40 bg-brand-surface/90 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-6 h-18 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-gradient flex items-center justify-center text-white shadow-violet-glow">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-brand-text">
                Academia<span className="text-brand-primary">ERP</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-lavender text-brand-primary">
                B.Tech SaaS Core
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-xs font-semibold text-brand-muted">
            <a href="#modules" className="hover:text-brand-primary transition-colors">
              Modules
            </a>
            <a href="#philosophy" className="hover:text-brand-primary transition-colors">
              Philosophy
            </a>
            <a href="#roles" className="hover:text-brand-primary transition-colors">
              Role Workspaces
            </a>
            <a href="#ai-validation" className="hover:text-brand-primary transition-colors">
              AI Transparency
            </a>
            <a href="#faq" className="hover:text-brand-primary transition-colors">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <QuickRoleSwitcher />
            </div>
            <Link to="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Student Register
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
        {/* Soft background ambient gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-brand-primary/10 via-brand-secondary/15 to-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <Badge variant="lavender" size="md" className="mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Next-Gen Academic ERP & Student Motivation Platform
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-brand-text tracking-tight leading-[1.15]">
            Where Academic Management Meets{' '}
            <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-[#A78BFA] bg-clip-text text-transparent">
              Behavioral Engagement
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-brand-muted max-w-2xl mx-auto font-normal leading-relaxed">
            A unified academic SaaS platform that streamlines course delivery, attendance, and grading while
            celebrating consistency, on-time submissions, and effort through an auditable gamification engine.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/student/dashboard')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Student Portal
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/faculty/dashboard')}
              leftIcon={<Users className="w-4 h-4" />}
            >
              Faculty Review Desk
            </Button>
          </div>

          <p className="mt-4 text-xs text-brand-muted font-medium">
            No credit card or paid APIs required • Free-tier & open-source compatible architecture
          </p>
        </div>

        {/* 3. Interactive Dashboard Preview Card */}
        <div className="max-w-6xl mx-auto px-6 mt-14">
          <Card variant="white" padding="none" className="overflow-hidden shadow-elevated border-brand-border">
            {/* Window header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#FAF8FF] border-b border-brand-border">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                <span className="ml-3 text-xs font-semibold text-brand-muted">
                  AcademiaERP Unified Dashboard Preview
                </span>
              </div>
              <Badge variant="emerald" size="sm">
                System Healthy • All Microservices Active
              </Badge>
            </div>

            {/* Dashboard Mockup Grid */}
            <div className="p-6 md:p-8 bg-[#FBFBFE] grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Student Academic Progress */}
              <Card variant="white" padding="sm" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-brand-muted font-medium">Enrolled Courses</p>
                    <h4 className="text-lg font-bold text-brand-text">CS301 • Algorithms</h4>
                  </div>
                  <Badge variant="lavender">Sem 6 • Sec A</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-brand-muted">Attendance Record</span>
                    <span className="text-brand-emerald">92% (11/12 Sessions)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-brand-bg overflow-hidden">
                    <div className="h-full rounded-full bg-brand-emerald w-[92%]" />
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#F4F1FD] border border-[#E5DEFA] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-5 h-5 text-brand-primary" />
                    <div>
                      <p className="text-[11px] text-brand-muted font-medium">Monthly Academic XP</p>
                      <p className="text-sm font-extrabold text-brand-primary tabular-nums">380 XP • Rank #2</p>
                    </div>
                  </div>
                  <Badge variant="amber">12-Day Streak 🔥</Badge>
                </div>
              </Card>

              {/* Center Column: Faculty Review Desk */}
              <Card variant="white" padding="sm" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-brand-muted font-medium">Faculty Evaluation Desk</p>
                    <h4 className="text-lg font-bold text-brand-text">Dynamic Programming Lab</h4>
                  </div>
                  <Badge variant="emerald">18 Submitted</Badge>
                </div>
                <div className="p-3 rounded-xl bg-white border border-brand-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-text">Ayush Srivastava</span>
                    <span className="text-xs font-semibold text-brand-emerald">94 / 100 Marks</span>
                  </div>
                  <p className="text-[11px] text-brand-muted line-clamp-2">
                    "Outstanding mathematical rigor. Clear step-by-step substitution proofs."
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-brand-muted">Official Grade:</span>
                  <span className="font-bold text-brand-text">Grade Independent of XP</span>
                </div>
              </Card>

              {/* Right Column: AI Validation Microservice */}
              <Card variant="indigo" padding="sm" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#A78BFA]" />
                    <h4 className="text-sm font-bold text-white">AI Stylometric Analysis</h4>
                  </div>
                  <Badge variant="indigo">Advisory Only</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">AI Likelihood Score:</span>
                    <span className="text-brand-emerald font-bold">0.14 (Low Signal)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Shannon Entropy:</span>
                    <span className="text-white font-mono">6.94 bits</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Sentence Burstiness:</span>
                    <span className="text-white font-mono">8.6 std dev</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Heuristic statistical decision support. Faculty members retain sole authority over student submissions.
                </p>
              </Card>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. Three Integrated Modules Section */}
      <section id="modules" className="py-20 bg-brand-surface border-y border-brand-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="lavender" size="md">
              Core System Architecture
            </Badge>
            <h2 className="text-3xl font-extrabold text-brand-text mt-3">
              Three Powerful Pillars in One Cohesive Platform
            </h2>
            <p className="text-sm text-brand-muted mt-2">
              Designed to eliminate fragmented academic tools through a unified relational data model.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
            {/* Module 1 */}
            <Card variant="tinted" padding="md" hoverEffect className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-lavender text-brand-primary flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-text">1. Academic ERP Engine</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Streamlines course enrollment, date-based attendance tracking, assignment authoring, PDF/DOCX file
                submissions, rubric-based grading, and timetables.
              </p>
              <ul className="text-xs text-brand-text space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  Date-wise lecture attendance entry
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  Rubric-based submission evaluations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  Course syllabus & notice broadcasting
                </li>
              </ul>
            </Card>

            {/* Module 2 */}
            <Card variant="tinted" padding="md" hoverEffect className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-lavender text-brand-primary flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-text">2. Behavioral Gamification</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Server-side, event-driven XP engine that rewards on-time submissions, lecture presence, and continuous
                streaks. Features monthly leaderboards and a simulated reward catalogue.
              </p>
              <ul className="text-xs text-brand-text space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  Strictly independent from grades
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  Idempotent duplicate award prevention
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  Monthly resets with lifetime XP preservation
                </li>
              </ul>
            </Card>

            {/* Module 3 */}
            <Card variant="tinted" padding="md" hoverEffect className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-lavender text-brand-primary flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-text">3. AI Validation Service</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Lightweight Python FastAPI microservice providing CPU-friendly stylometric signals (Shannon entropy,
                sentence length variance, transition word density) with strict faculty advisory caveats.
              </p>
              <ul className="text-xs text-brand-text space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  Transparent statistical metrics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  Offline resilience without blocking ERP
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  Audited oral-defense faculty disposition
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. Second-Chance & Effort Philosophy Section */}
      <section id="philosophy" className="py-20 bg-brand-bg">
        <div className="max-w-5xl mx-auto px-6">
          <Card variant="gradient" padding="lg" className="rounded-card-lg relative overflow-hidden">
            <div className="relative z-10 space-y-4 text-white max-w-3xl">
              <Badge variant="indigo" size="md">
                Engagement Philosophy
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug">
                Rewarding Consistent Effort and Improvement, Not Just Test Scores
              </h2>
              <p className="text-sm text-purple-100 leading-relaxed font-normal">
                Traditional ERP systems are punitive: students only interact with them when receiving penalties or test
                results. AcademiaERP shifts the focus to observable positive academic habits.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <h4 className="font-bold text-sm text-white">Monthly Second Chances</h4>
                  <p className="text-xs text-purple-100 mt-1">
                    Leaderboards reset every calendar month, ensuring that students who had a difficult week can rebuild
                    momentum without being permanently sidelined.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <h4 className="font-bold text-sm text-white">Strict Academic Separation</h4>
                  <p className="text-xs text-purple-100 mt-1">
                    Official marks, transcript percentages, and faculty evaluations are never influenced or altered by
                    gamification points or leaderboard status.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 6. Role-Specific Feature Workspaces */}
      <section id="roles" className="py-20 bg-brand-surface border-y border-brand-border">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="lavender" size="md">
              Tailored Portals
            </Badge>
            <h2 className="text-3xl font-extrabold text-brand-text mt-3">
              Purpose-Built Experiences for Every Stakeholder
            </h2>
          </div>

          {/* Role selector tabs */}
          <div className="flex justify-center mt-8">
            <div className="inline-flex p-1.5 rounded-2xl bg-brand-bg border border-brand-border gap-2">
              <button
                onClick={() => setActiveRoleTab('student')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeRoleTab === 'student'
                    ? 'bg-violet-gradient text-white shadow-sm'
                    : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                Student Portal
              </button>
              <button
                onClick={() => setActiveRoleTab('faculty')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeRoleTab === 'faculty'
                    ? 'bg-violet-gradient text-white shadow-sm'
                    : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                Faculty Workspace
              </button>
              <button
                onClick={() => setActiveRoleTab('admin')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeRoleTab === 'admin'
                    ? 'bg-violet-gradient text-white shadow-sm'
                    : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                Administrator Control
              </button>
            </div>
          </div>

          {/* Role Tab Content */}
          <div className="mt-10">
            {activeRoleTab === 'student' && (
              <Card variant="white" padding="lg" className="space-y-6">
                <div className="flex items-center justify-between border-b border-brand-border pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-brand-text">Student Motivation & Productivity Hub</h3>
                    <p className="text-xs text-brand-muted">
                      Everything a student needs to track courses, deliver assignments, and celebrate consistency.
                    </p>
                  </div>
                  <Button size="sm" onClick={() => navigate('/student/dashboard')}>
                    Launch Student Portal
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-brand-primary">Academic ERP</h4>
                    <p className="text-xs text-brand-muted leading-relaxed">
                      Enrolled courses, assignment submissions (PDF/DOCX), date-based attendance tracking, and weekly
                      timetable items.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-brand-primary">Gamified Recognition</h4>
                    <p className="text-xs text-brand-muted leading-relaxed">
                      XP transaction statements, attendance streaks, achievement badges (Consistency Champion, Early
                      Bird), and monthly class ranks.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-brand-primary">Simulated Rewards</h4>
                    <p className="text-xs text-brand-muted leading-relaxed">
                      Exchange verified monthly XP for simulated campus perks such as quiet study pod reservations and
                      café vouchers.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {activeRoleTab === 'faculty' && (
              <Card variant="white" padding="lg" className="space-y-6">
                <div className="flex items-center justify-between border-b border-brand-border pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-brand-text">Faculty Teaching & Academic Governance Desk</h3>
                    <p className="text-xs text-brand-muted">
                      Effortless class administration, batch attendance marking, and AI review disposition recording.
                    </p>
                  </div>
                  <Button size="sm" onClick={() => navigate('/faculty/dashboard')}>
                    Launch Faculty Portal
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-brand-primary">Assignment & Rubric Grading</h4>
                    <p className="text-xs text-brand-muted leading-relaxed">
                      Publish coursework with custom deadlines and permitted file formats. Grade submissions with
                      structured feedback drawers.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-brand-primary">Attendance Roster</h4>
                    <p className="text-xs text-brand-muted leading-relaxed">
                      Date-based session marking with one-click batch Present/Absent actions. Automatically triggers
                      idempotent attendance XP.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-brand-primary">AI Review Workspace</h4>
                    <p className="text-xs text-brand-muted leading-relaxed">
                      Inspect stylometric signals (entropy, sentence variance) and record final dispositions (Dismissed,
                      Confirmed Original, Flagged for Viva).
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {activeRoleTab === 'admin' && (
              <Card variant="white" padding="lg" className="space-y-6">
                <div className="flex items-center justify-between border-b border-brand-border pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-brand-text">Administrator Institutional Control Panel</h3>
                    <p className="text-xs text-brand-muted">
                      Full institutional governance, security audit trails, user provisioning, and configurable XP rules.
                    </p>
                  </div>
                  <Button size="sm" onClick={() => navigate('/admin/dashboard')}>
                    Launch Admin Portal
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-brand-primary">User Directory & RBAC</h4>
                    <p className="text-xs text-brand-muted leading-relaxed">
                      Search, filter, invite, activate, or suspend student, faculty, and administrator accounts with
                      server-side authorization.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-brand-primary">XP Rule Engine</h4>
                    <p className="text-xs text-brand-muted leading-relaxed">
                      Configure base points and active status for academic event types with rule versioning that protects
                      past transactions.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-brand-primary">Security & Audit Logs</h4>
                    <p className="text-xs text-brand-muted leading-relaxed">
                      Comprehensive cryptographic and event logging tracking logins, role changes, attendance revisions,
                      and grading actions.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* 7. AI Validation Transparency & Limitations */}
      <section id="ai-validation" className="py-20 bg-brand-bg">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="amber" size="md">
              Ethical AI Policy
            </Badge>
            <h2 className="text-3xl font-extrabold text-brand-text mt-3">
              Transparent, Statistical Stylometrics — Never Automated Punishment
            </h2>
            <p className="text-sm text-brand-muted mt-2">
              Our AI validation microservice operates with clear mathematical signals and strict faculty oversight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card variant="white" padding="md" className="space-y-4">
              <h3 className="text-base font-bold text-brand-text flex items-center gap-2">
                <Cpu className="w-5 h-5 text-brand-primary" />
                How the Microservice Analyzes Text
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Rather than relying on black-box external commercial APIs, the microservice executes CPU-friendly
                computational linguistics:
              </p>
              <ul className="text-xs text-brand-text space-y-2.5">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>Shannon Entropy:</strong> Measures vocabulary token predictability (AI texts typically
                    cluster in narrow 6.5–7.5 bit ranges).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>Sentence Length Standard Deviation:</strong> Evaluates burstiness. Natural human writing has
                    high variance between short and long clauses.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>Type-Token Ratio & Over-Indexed Phrases:</strong> Scans for formulaic filler constructions
                    ("in conclusion", "multifaceted", "delves into").
                  </span>
                </li>
              </ul>
            </Card>

            <Card variant="white" padding="md" className="space-y-4 border-l-4 border-l-brand-amber">
              <h3 className="text-base font-bold text-brand-text flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-amber" />
                Mandatory Institutional Safeguards
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                To protect students from false-positive algorithmic bias:
              </p>
              <ul className="text-xs text-brand-text space-y-2.5">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-amber mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>Advisory Decision Support:</strong> AI signals are labeled "AI-likelihood estimate" and
                    never trigger automatic grade deductions or penalties.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-amber mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>Faculty Primacy & Viva Defense:</strong> Faculty members conduct an oral viva or discussion
                    before taking any academic integrity steps.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-amber mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>Zero-Downtime Decoupling:</strong> If the AI service is offline, assignment submissions and
                    grading continue working completely unimpeded.
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section id="faq" className="py-20 bg-brand-surface border-t border-brand-border">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="lavender" size="md">
              Frequently Asked Questions
            </Badge>
            <h2 className="text-3xl font-extrabold text-brand-text mt-3">
              Clear Answers on System Architecture
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-brand-border bg-white overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-brand-text hover:text-brand-primary"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-brand-primary' : 'text-brand-muted'}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-brand-muted leading-relaxed border-t border-brand-bg pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="mt-auto bg-brand-indigo text-slate-300 py-12 border-t border-[#2A2B47]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[#2A2B47] pb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-gradient flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">
                Academia<span className="text-brand-secondary">ERP</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <Link to="/login" className="hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="hover:text-white transition-colors">
                Student Registration
              </Link>
              <a href="#modules" className="hover:text-white transition-colors">
                System Pillars
              </a>
              <a href="#ai-validation" className="hover:text-white transition-colors">
                AI Transparency
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2026 AcademiaERP. Final Year B.Tech Academic Management & Gamification Platform.</p>
            <p>Developed with React, Express, Prisma ORM, and Python FastAPI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
