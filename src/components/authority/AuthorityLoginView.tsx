import React, { useState } from 'react';
import { authorityAuthService } from '../../services/authorityAuthService';
import { AuthorityUser } from '../../types/authority';
import {
  Landmark,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Building2,
  AlertTriangle,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface AuthorityLoginViewProps {
  onLoginSuccess: (user: AuthorityUser) => void;
  onSwitchToCitizen: () => void;
}

export const AuthorityLoginView: React.FC<AuthorityLoginViewProps> = ({
  onLoginSuccess,
  onSwitchToCitizen
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide both official credentials.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await authorityAuthService.login(email.trim(), password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMessage(
          res.errorMessage ||
            'Authority access denied. This account is not authorized to access the CIVIC-CONNECT Authority Portal.'
        );
      }
    } catch {
      setErrorMessage('Communication error connecting to municipal auth service.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (type: 'engineer' | 'commissioner') => {
    if (type === 'engineer') {
      setEmail('v.rathore@pwd.gov.in');
      setPassword('Executive@2026');
    } else {
      setEmail('commissioner@municipalcorp.gov.in');
      setPassword('Admin@2026');
    }
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8fa] text-[#172b4d]">
      {/* TOP NAVBAR — MATCHES INITIAL WEBSITE */}
      <header className="navbar">
        <div className="container nav-inner">
          <div className="brand" onClick={onSwitchToCitizen} role="button" tabIndex={0}>
            <span className="brand-mark">
              <Landmark className="w-5 h-5 text-white" />
            </span>
            <span>CIVIC-CONNECT</span>
          </div>

          <button
            type="button"
            onClick={onSwitchToCitizen}
            className="btn btn-secondary text-xs font-semibold"
          >
            <Building2 className="w-4 h-4 text-[#1769aa]" />
            <span>Go to Citizen Portal</span>
          </button>
        </div>
      </header>

      {/* MAIN AUTHENTICATION CARD */}
      <main className="page auth-page flex-1 flex items-center justify-center py-12 px-4">
        <div className="container">
          <div className="auth-card max-w-[480px] mx-auto bg-white border border-[#e2e8f0] rounded-[20px] p-8 sm:p-9 shadow-[0_8px_28px_rgba(15,42,67,0.08)]">
            <div className="auth-header text-center mb-6">
              <div className="auth-eyebrow inline-flex items-center gap-2 bg-[#eaf3fb] text-[#1769aa] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1769aa]" />
                <span>Authorized Personnel Only</span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#102a43] tracking-tight mb-2">
                Authority Sign In
              </h1>
              <p className="text-sm text-[#64748b]">
                Access is restricted to authorized municipal engineers and administrative supervisors.
              </p>
            </div>

            {/* ACCESS DENIED ALERT */}
            {errorMessage && (
              <div className="form-alert error bg-[#fff0f1] text-[#dc3545] border border-[#fed7d7] rounded-xl p-3 text-xs flex items-start gap-2.5 mb-5">
                <ShieldAlert className="w-4 h-4 text-[#dc3545] shrink-0 mt-0.5" />
                <div className="leading-relaxed font-semibold">{errorMessage}</div>
              </div>
            )}

            {/* FORGOT PASSWORD NOTICE */}
            {showForgotNotice && (
              <div className="form-alert bg-[#eaf3fb] text-[#102a43] border border-[#c7dff3] rounded-xl p-3.5 text-xs flex items-start gap-2.5 mb-5">
                <HelpCircle className="w-4 h-4 text-[#1769aa] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  Authority credential resets are managed centrally by the{' '}
                  <strong>Municipal Vigilance & IT Cell</strong>. Contact your Department
                  Administrator or call internal extension <strong>4001</strong>.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="field">
                <label htmlFor="authEmail" className="block text-xs font-bold text-[#102a43] mb-1.5">
                  Official Municipal / Gov Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#64748b] absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    id="authEmail"
                    type="email"
                    placeholder="officer@pwd.gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-[#d8e0e8] focus:border-[#1769aa] focus:ring-3 focus:ring-[rgba(23,105,170,0.12)] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#172b4d] outline-none transition-all placeholder:text-slate-400 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="authPass" className="block text-xs font-bold text-[#102a43]">
                    Duty Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotNotice(!showForgotNotice)}
                    className="text-xs text-[#1769aa] font-semibold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="password-wrapper relative">
                  <Lock className="w-4 h-4 text-[#64748b] absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    id="authPass"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-[#d8e0e8] focus:border-[#1769aa] focus:ring-3 focus:ring-[rgba(23,105,170,0.12)] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#172b4d] outline-none transition-all placeholder:text-slate-400 font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle absolute right-3 top-3 text-[#64748b] hover:text-[#102a43]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-3 rounded-xl bg-[#102a43] hover:bg-[#0d2135] text-white font-bold transition-all shadow-md shadow-[#102a43]/15 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authenticate & Enter Console</span>
                  </>
                )}
              </button>
            </form>

            {/* DEMO EVALUATION FAST-FILL */}
            <div className="demo-credentials-card mt-6 bg-[#f8fafc] border border-dashed border-[#cbd5e1] rounded-xl p-4 space-y-2.5">
              <div className="demo-header flex justify-between items-center text-[11px] font-bold text-[#102a43] uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1769aa]" />
                  <span>Evaluation Quick Fill (Dev Only)</span>
                </span>
                <span className="text-[10px] text-[#64748b] font-semibold">2 Mock Accounts</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleFillDemo('engineer')}
                  className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#e2e8f0] text-left transition-all hover:border-[#1769aa] shadow-2xs group"
                >
                  <div className="font-bold text-[#102a43] text-xs truncate group-hover:text-[#1769aa]">
                    Executive Engineer
                  </div>
                  <div className="text-[11px] text-[#64748b] truncate mt-0.5">
                    v.rathore@pwd.gov.in
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleFillDemo('commissioner')}
                  className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#e2e8f0] text-left transition-all hover:border-[#1769aa] shadow-2xs group"
                >
                  <div className="font-bold text-[#102a43] text-xs truncate group-hover:text-[#1769aa]">
                    Super Admin / IAS
                  </div>
                  <div className="text-[11px] text-[#64748b] truncate mt-0.5">
                    commissioner@municipalcorp.gov.in
                  </div>
                </button>
              </div>
            </div>

            <div className="text-[11px] text-[#64748b] text-center mt-5 leading-relaxed">
              Public citizen accounts cannot sign in here. Authority accounts are provisioned exclusively through municipal administration.
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER — MATCHES INITIAL WEBSITE */}
      <footer className="footer bg-[#102a43] text-white py-8 px-4 text-center text-xs">
        <div className="container flex flex-col sm:flex-row justify-between items-center gap-2 text-slate-400">
          <span>&copy; 2026 CIVIC-CONNECT &bull; Municipal Authority Incident Dispatch Network</span>
          <button
            type="button"
            onClick={onSwitchToCitizen}
            className="text-blue-300 hover:text-white font-semibold"
          >
            Public Citizen Access Portal
          </button>
        </div>
      </footer>
    </div>
  );
};
