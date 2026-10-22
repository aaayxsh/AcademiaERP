import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { GraduationCap, Lock, Mail, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('ayush.student@academia.edu');
  const [password, setPassword] = useState('Student@123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const user = await login(email, password);
      if (user.role === 'STUDENT') navigate('/student/dashboard');
      else if (user.role === 'FACULTY') navigate('/faculty/dashboard');
      else if (user.role === 'ADMIN') navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  const fillDemo = (role: 'student' | 'faculty' | 'admin') => {
    if (role === 'student') {
      setEmail('ayush.student@academia.edu');
      setPassword('Student@123');
    } else if (role === 'faculty') {
      setEmail('prof.sharma@academia.edu');
      setPassword('Faculty@123');
    } else if (role === 'admin') {
      setEmail('admin@academia.edu');
      setPassword('Admin@123');
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-11 h-11 rounded-xl bg-violet-gradient flex items-center justify-center text-white shadow-violet-glow">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-brand-text">
            Academia<span className="text-brand-primary">ERP</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-brand-text">Sign in to Institutional Portal</h2>
        <p className="mt-1 text-xs text-brand-muted">
          Access your courses, attendance, gamification records, and grading desk
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card variant="white" padding="lg" className="shadow-elevated border-brand-border space-y-6">
          {/* Quick Demo Fill Buttons */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-brand-muted uppercase tracking-wider text-center">
              Quick Fill Demo Credentials
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('student')}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-[#F4F1FD] border border-[#E5DEFA] text-xs font-bold text-brand-primary hover:bg-[#EAE4FB] transition-colors"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Student
              </button>
              <button
                type="button"
                onClick={() => fillDemo('faculty')}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-[#F4F1FD] border border-[#E5DEFA] text-xs font-bold text-brand-primary hover:bg-[#EAE4FB] transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Faculty
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-[#F4F1FD] border border-[#E5DEFA] text-xs font-bold text-brand-primary hover:bg-[#EAE4FB] transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[#FDEEEF] border border-[#F9C3C9] text-xs font-medium text-brand-red">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Institutional Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@academia.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border bg-[#FBFBFE] text-xs text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                />
                <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-brand-text">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-brand-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border bg-[#FBFBFE] text-xs text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                />
                <Lock className="w-4 h-4 text-brand-muted absolute left-3.5 top-3" />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Workspace
            </Button>
          </form>

          <div className="border-t border-brand-border pt-4 text-center">
            <p className="text-xs text-brand-muted">
              New student?{' '}
              <Link to="/register" className="font-bold text-brand-primary hover:underline">
                Create Student Account
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
