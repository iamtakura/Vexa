import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import OnboardingLayout from '../../components/layout/OnboardingLayout';
import Button from '../../components/ui/Button';
import { Shield } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <OnboardingLayout>
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        className="flex-1 flex flex-col justify-between text-center min-h-0"
      >
        {/* Visual Hero Area */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 my-4 min-h-0">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-20 h-20 rounded-[28px] bg-gradient-to-tr from-coral to-pink-500 flex items-center justify-center shadow-[0_10px_30px_rgba(255,107,71,0.3)]"
          >
            <span className="font-fredoka text-4xl font-bold text-white tracking-tighter">v</span>
          </motion.div>

          <div className="space-y-2">
            <h1 className="font-fredoka text-3xl font-extrabold text-white tracking-wide">
              vexa
            </h1>
            <p className="font-fredoka text-coral text-base font-bold uppercase tracking-widest">
              "Everything they didn't teach you."
            </p>
          </div>

          <p className="font-nunito text-muted max-w-[270px] text-[13px] leading-relaxed">
            Your gamified, shame-free space to bust myths, learn the facts, and understand relationships.
          </p>
        </div>

        {/* Action Button & Privacy Trust */}
        <div className="space-y-3 pb-2 shrink-0">
          <Button 
            onClick={() => navigate('/onboarding/age')} 
            className="w-full"
          >
            Get Started
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-muted text-[10.5px] font-medium font-nunito">
            <Shield size={13} className="text-muted/65" />
            <span>No data leaves your device. Fully private.</span>
          </div>
        </div>
      </motion.div>
    </OnboardingLayout>
  );
}
