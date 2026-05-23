import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import OnboardingLayout from '../../components/layout/OnboardingLayout';
import Button from '../../components/ui/Button';
import { useVexaStore } from '../../store/useVexaStore';
import { Sparkles, Heart, Activity, Compass, Flame } from 'lucide-react';

export default function Motivations() {
  const navigate = useNavigate();
  const { setMotivations, motivations } = useVexaStore();
  const [selected, setSelected] = useState(motivations || []);

  const options = [
    { key: 'myths', label: 'Bust media & porn myths', icon: Sparkles },
    { key: 'bodies', label: 'Learn body & cycle facts', icon: Activity },
    { key: 'comm', label: 'Improve relationship talk', icon: Heart },
    { key: 'health', label: 'Understand sexual health', icon: Flame },
    { key: 'identity', label: 'Explore pleasure & identity', icon: Compass },
  ];

  const handleToggle = (key) => {
    if (selected.includes(key)) {
      setSelected(selected.filter((item) => item !== key));
    } else {
      setSelected([...selected, key]);
    }
  };

  const handleNext = () => {
    if (selected.length > 0) {
      setMotivations(selected);
      navigate('/onboarding/source');
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
            What brings you here?
          </h2>
          <p className="font-nunito text-muted text-[13px] px-2">
            Select all that apply. We'll prioritize the topics you care about most.
          </p>
        </div>

        {/* Chip Selection Grid */}
        <div className="flex-1 flex flex-col justify-center gap-3 py-6 select-none">
          {options.map((option) => {
            const isSelected = selected.includes(option.key);
            const Icon = option.icon;

            return (
              <motion.div
                key={option.key}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleToggle(option.key)}
                className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-3.5 transition-all duration-200 ${
                  isSelected
                    ? 'bg-coral-soft/10 border-coral shadow-[0_0_10px_var(--coral-glow)]'
                    : 'bg-purple-card hover:bg-purple-light/40 border-dim'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-coral text-white' : 'bg-purple-light text-muted'
                }`}>
                  <Icon size={18} className="fill-current" />
                </div>
                <span className="font-nunito font-semibold text-[13.5px] text-white text-left">
                  {option.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="pb-4">
          <Button
            onClick={handleNext}
            disabled={selected.length === 0}
            className="w-full"
          >
            Continue
          </Button>
        </div>
      </motion.div>
    </OnboardingLayout>
  );
}
