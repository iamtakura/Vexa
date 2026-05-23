import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import OnboardingLayout from '../../components/layout/OnboardingLayout';
import Button from '../../components/ui/Button';
import { useVexaStore } from '../../store/useVexaStore';
import { User, Users } from 'lucide-react';

export default function AgeSelect() {
  const navigate = useNavigate();
  const { setAgeGroup, ageGroup } = useVexaStore();
  const [selected, setSelected] = useState(ageGroup);

  const handleNext = () => {
    if (selected) {
      setAgeGroup(selected);
      navigate('/onboarding/motivations');
    }
  };

  return (
    <OnboardingLayout>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex-1 flex flex-col justify-between min-h-0"
      >
        {/* Title */}
        <div className="space-y-2 text-center mt-2">
          <h2 className="font-fredoka text-2xl font-bold text-white leading-tight">
            Choose your path
          </h2>
          <p className="font-nunito text-muted text-[13px] px-4">
            We tailor our educational lessons to be age-appropriate, direct, and shame-free.
          </p>
        </div>

        {/* Selection Cards */}
        <div className="flex-1 flex flex-col justify-center gap-4 py-6">
          {/* Teen Option */}
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected('teen')}
            className={`p-5 rounded-2xl border-2 cursor-pointer flex items-center gap-4 transition-all duration-200 ${
              selected === 'teen'
                ? 'bg-coral-soft/10 border-coral shadow-[0_0_12px_var(--coral-glow)]'
                : 'bg-purple-card hover:bg-purple-light/40 border-dim'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              selected === 'teen' ? 'bg-coral text-white' : 'bg-purple-light text-muted'
            }`}>
              <User size={24} className="fill-current" />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-fredoka text-base font-semibold text-white">Teen</h3>
              <p className="font-nunito text-muted text-[12px] leading-snug">
                Ages 13–17 · Puberty, consent, body normalcy, and relationship basics.
              </p>
            </div>
          </motion.div>

          {/* Young Adult Option */}
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected('youngAdult')}
            className={`p-5 rounded-2xl border-2 cursor-pointer flex items-center gap-4 transition-all duration-200 ${
              selected === 'youngAdult'
                ? 'bg-coral-soft/10 border-coral shadow-[0_0_12px_var(--coral-glow)]'
                : 'bg-purple-card hover:bg-purple-light/40 border-dim'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              selected === 'youngAdult' ? 'bg-coral text-white' : 'bg-purple-light text-muted'
            }`}>
              <Users size={24} className="fill-current" />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-fredoka text-base font-semibold text-white">Young Adult</h3>
              <p className="font-nunito text-muted text-[12px] leading-snug">
                Ages 18–25 · Intimacy realities, sexual health, pleasure, and communication.
              </p>
            </div>
          </motion.div>
        </div>

        {/* CTA Button */}
        <div className="pb-4">
          <Button
            onClick={handleNext}
            disabled={!selected}
            className="w-full"
          >
            Continue
          </Button>
        </div>
      </motion.div>
    </OnboardingLayout>
  );
}
