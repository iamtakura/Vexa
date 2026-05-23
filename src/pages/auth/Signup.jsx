import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useVexaStore } from '../../store/useVexaStore';

export default function Signup() {
  const { signUp } = useAuth();
  const clearProgress = useVexaStore((state) => state.clearProgress);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmMessage, setShowConfirmMessage] = useState(false);

  const mapAuthError = (msg) => {
    if (!msg) return '';
    if (msg.includes('Invalid login credentials')) {
      return 'Incorrect email or password';
    }
    if (msg.includes('User already registered') || msg.includes('already exists')) {
      return 'An account with this email already exists';
    }
    if (msg.includes('Password should be at least 6 characters')) {
      return 'Password must be at least 6 characters';
    }
    return 'Something went wrong — please try again';
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error: authError } = await signUp(email.trim(), password);
      if (authError) {
        setError(mapAuthError(authError.message));
        setIsLoading(false);
        return;
      }

      // If user session is returned immediately (email confirmation disabled in dashboard)
      if (data?.session) {
        clearProgress();
        navigate('/onboarding/welcome');
        return;
      }

      // Otherwise if user created successfully but requires email confirmation
      if (data?.user) {
        clearProgress();
        setShowConfirmMessage(true);
      }
    } catch (err) {
      console.error('[Vexa Signup] Error:', err);
      setError('Something went wrong — please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen min-h-[100dvh] flex flex-col items-center justify-center px-5 py-8 overflow-y-auto overflow-x-hidden text-white no-scrollbar selection:bg-coral/30"
      style={{ background: 'var(--purple)' }}
    >
      <div className="w-full" style={{ maxWidth: '380px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-6 w-full"
        >
          {/* Vexa Logo */}
          <div className="flex items-center space-x-1 select-none">
            <span className="font-fredoka text-[36px] font-bold tracking-wider text-white">
              Vex<span className="text-coral">a</span>
            </span>
          </div>

          {!showConfirmMessage ? (
            <>
              {/* Headings */}
              <div className="text-center space-y-2 select-none">
                <h2 className="font-fredoka text-[22px] font-bold tracking-wide">
                  Create your account
                </h2>
                <p className="font-nunito text-[13px] text-muted leading-relaxed">
                  Free forever. No judgment.
                </p>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSignup} className="w-full space-y-4">
                <div className="space-y-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full h-[50px] px-5 bg-purple-light border border-dim rounded-2xl font-nunito text-[14px] text-white placeholder-muted focus:outline-none focus:border-coral/50 transition-all duration-200"
                  />
                </div>

                <div className="relative space-y-1">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full h-[50px] pl-5 pr-12 bg-purple-light border border-dim rounded-2xl font-nunito text-[14px] text-white placeholder-muted focus:outline-none focus:border-coral/50 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[25px] -translate-y-1/2 text-muted hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative space-y-1">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full h-[50px] pl-5 pr-12 bg-purple-light border border-dim rounded-2xl font-nunito text-[14px] text-white placeholder-muted focus:outline-none focus:border-coral/50 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-[25px] -translate-y-1/2 text-muted hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-nunito text-[12px] text-coral font-bold text-center"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[50px] bg-coral hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:bg-purple-light/50 border border-dim rounded-full flex items-center justify-center font-fredoka uppercase tracking-wider text-[12px] text-white transition-all duration-200 cursor-pointer disabled:cursor-not-allowed select-none shadow-[0_6px_20px_rgba(255,107,71,0.15)]"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin text-white" />
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Login Link */}
              <p className="font-nunito text-[13px] text-muted select-none">
                Already have an account?{' '}
                <Link to="/auth/login" className="text-coral hover:underline font-bold">
                  Log in
                </Link>
              </p>
            </>
          ) : (
            <div className="text-center py-4 space-y-4 w-full">
              <p className="font-fredoka text-xl font-600">Check your email</p>
              <p className="font-nunito text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                We sent a confirmation link to <span className="text-white font-bold">{email}</span>. Click it to activate your account then log in.
              </p>
              <button
                onClick={() => navigate('/auth/login')}
                className="w-full h-[50px] bg-coral hover:scale-[1.02] active:scale-[0.98] rounded-full flex items-center justify-center font-fredoka uppercase tracking-wider text-[12px] text-white transition-all duration-200 cursor-pointer shadow-[0_6px_20px_rgba(255,107,71,0.15)]"
              >
                Go to Login
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
