import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { GraduationCap, Lock, Mail, User, BookOpen, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    studentId: '',
    semester: '6',
    section: 'A',
    department: 'Computer Science & Engineering',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(formData);
      navigate('/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details.');
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
        <h2 className="text-2xl font-extrabold text-brand-text">Student Registration</h2>
        <p className="mt-1 text-xs text-brand-muted">
          Create an institutional student account to begin tracking courses and earning XP
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <Card variant="white" padding="lg" className="shadow-elevated border-brand-border space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-[#FDEEEF] border border-[#F9C3C9] text-xs font-medium text-brand-red">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">First Name</label>
                <input
                  type="text"
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. Ayush"
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border bg-[#FBFBFE] text-xs text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Srivastava"
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border bg-[#FBFBFE] text-xs text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Institutional Email</label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ayush.student@academia.edu"
                className="w-full px-3.5 py-2 rounded-xl border border-brand-border bg-[#FBFBFE] text-xs text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Student Roll ID</label>
                <input
                  type="text"
                  required
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="STU2026CS042"
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border bg-[#FBFBFE] text-xs text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Semester & Section</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full px-2 py-2 rounded-xl border border-brand-border bg-[#FBFBFE] text-xs text-brand-text"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Sem {s}
                      </option>
                    ))}
                  </select>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    className="w-full px-2 py-2 rounded-xl border border-brand-border bg-[#FBFBFE] text-xs text-brand-text"
                  >
                    {['A', 'B', 'C'].map((sec) => (
                      <option key={sec} value={sec}>
                        Sec {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Password</label>
              <input
                type="password"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Choose a strong password (min 8 chars)"
                className="w-full px-3.5 py-2 rounded-xl border border-brand-border bg-[#FBFBFE] text-xs text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-3"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Register Student Account
            </Button>
          </form>

          <div className="border-t border-brand-border pt-4 text-center">
            <p className="text-xs text-brand-muted">
              Already enrolled?{' '}
              <Link to="/login" className="font-bold text-brand-primary hover:underline">
                Sign in to your account
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
