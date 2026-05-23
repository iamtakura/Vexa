import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import OnboardingLayout from '../../components/layout/OnboardingLayout';
import Button from '../../components/ui/Button';
import { useVexaStore } from '../../store/useVexaStore';
import { useAuth } from '../../contexts/AuthContext';
import { Sparkles, CheckCircle } from 'lucide-react';

export default function SetupComplete() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    ageGroup, 
    motivations, 
    sexEdSource, 
    completeOnboarding 
  } = useVexaStore();

  const [name, setName] = useState('');

  const handleFinish = () => {
    // Dispatch complete onboarding action
    completeOnboarding({
      username: name.trim() || 'Curious Learner',
      ageGroup,
      motivations,
      sexEdSource
    }, user?.id);
    navigate('/home');
  };

  return (
    <OnboardingLayout>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex-1 flex flex-col justify-between min-h-0"
      >
        {/* Confetti Micro-Animations / Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-coral opacity-60"
              initial={{
                x: 195,
                y: 300,
                scale: 0.5
              }}
              animate={{
                x: Math.random() * 320 + 20,
                y: Math.random() * 400 + 80,
                scale: Math.random() * 1.5 + 0.5,
                opacity: [0.6, 0.8, 0]
              }}
              transition={{
                duration: Math.random() * 2.5 + 1.5,
                repeat: Infinity,
                delay: Math.random() * 0.5
              }}
            />
          ))}
        </div>

        {/* Celebration Block */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 my-4 z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-20 h-20 rounded-full bg-[#4CAF82]/20 border border-success flex items-center justify-center shadow-[0_8px_24px_rgba(76,175,130,0.2)]"
          >
            <CheckCircle size={44} className="text-success fill-success/15" />
          </motion.div>

          <div className="space-y-2 text-center">
            <h2 className="font-fredoka text-2xl font-bold text-white tracking-wide">
              You are all set!
            </h2>
            <p className="font-nunito text-muted text-[13px] px-6">
              Your profile has been created. Vexa is customized to your preferences.
            </p>
          </div>

          {/* Name Input */}
          <div className="w-full space-y-2 mt-4 px-2">
            <label className="block text-left font-nunito text-[12px] font-bold text-muted ml-2">
              What should we call you? (Optional)
            </label>
            <input
              type="text"
              maxLength={20}
              placeholder="e.g., Alex"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-3 rounded-full bg-purple-card hover:bg-purple-light/20 border border-dim text-white font-nunito text-[13.5px] font-semibold placeholder:text-muted/50 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral-soft/20 transition-all select-none"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pb-4 z-10">
          <Button
            onClick={handleFinish}
            className="w-full shadow-[0_8px_24px_rgba(255,107,71,0.35)]"
          >
            Start Learning
          </Button>
        </div>
      </motion.div>
    </OnboardingLayout>
  );
}
