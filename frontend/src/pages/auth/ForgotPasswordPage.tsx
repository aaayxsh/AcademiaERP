import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { GraduationCap, Mail, KeyRound, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);
    try {
      const res = await api.auth.requestOtp(email);
      setMessage(res.message);
      if (res.demoOtp) {
        setOtpCode(res.demoOtp); // Auto-fill in dev mode for seamless demo!
        setMessage(`${res.message} (Demo OTP auto-filled: ${res.demoOtp})`);
      }
      setStep('reset');
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);
    try {
      const res = await api.auth.resetPassword({ email, otpCode, newPassword });
      setMessage(res.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setIsLoading(false);
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
        <h2 className="text-2xl font-extrabold text-brand-text">Password Recovery</h2>
        <p className="mt-1 text-xs text-brand-muted">
          Verify your institutional account via 6-digit one-time passcode
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card variant="white" padding="lg" className="shadow-elevated border-brand-border space-y-6">
          {message && (
            <div className="p-3 rounded-xl bg-[#E7F8F2] border border-[#BAEEDC] text-xs font-medium text-brand-emerald">
              {message}
            </div>
          )}
          {error && (
            <div className="p-3 rounded-xl bg-[#FDEEEF] border border-[#F9C3C9] text-xs font-medium text-brand-red">
              {error}
            </div>
          )}

          {step === 'request' ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Institutional Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ayush.student@academia.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border bg-[#FBFBFE] text-xs text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                  />
                  <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-3" />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Send Verification Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">6-Digit Verification Code</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border bg-[#FBFBFE] text-xs font-bold tracking-widest text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                  />
                  <KeyRound className="w-4 h-4 text-brand-muted absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter strong password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border bg-[#FBFBFE] text-xs text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
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
                Update Password
              </Button>
            </form>
          )}

          <div className="border-t border-brand-border pt-4 text-center">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-muted hover:text-brand-primary">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
