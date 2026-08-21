import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../App';
import { loginWithHRMS, saveAuth, isAuthenticated } from '../lib/auth';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showToast, setAuthUser, setAuthEmployee } = useApp();

  // If already authenticated, skip straight to the app
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/settings', { replace: true });
    } else {
      const timer = setTimeout(() => setIsCheckingAuth(false), 400);
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await loginWithHRMS(username, password);

      // Persist token + user to localStorage
      saveAuth(data.token, data.user, data.employee);

      // Push into app context so UI updates immediately
      setAuthUser(data.user);
      setAuthEmployee(data.employee);

      showToast(`Welcome back, ${data.user.first_name || data.user.username}!`, 'success');
      navigate('/settings', { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <p className="mt-4 text-sm text-slate-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[60%] items-center justify-center bg-gradient-to-br from-blue-600/10 via-blue-50 to-purple-50 p-8">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/20">
            <span className="text-4xl font-bold text-white">A</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Aether ERP</h2>
            <p className="text-sm text-slate-500 mt-1">Enterprise Resource Planning</p>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mt-8">
            {['Settings', 'Support'].map((label) => (
              <div
                key={label}
                className="p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm"
              >
                <p className="text-xs font-semibold text-slate-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">AetherERP</h1>
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Welcome Back</h2>
            <p className="text-sm text-slate-600">Sign in with your HRMS credentials</p>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                icon={<User size={16} />}
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                icon={<Lock size={16} />}
                disabled={isLoading}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff size={16} strokeWidth={2} />
                    ) : (
                      <Eye size={16} strokeWidth={2} />
                    )}
                  </button>
                }
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12"
              isLoading={isLoading}
              disabled={isLoading || !username || !password}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
