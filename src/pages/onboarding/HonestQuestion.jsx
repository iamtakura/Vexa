import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import OnboardingLayout from '../../components/layout/OnboardingLayout';
import Button from '../../components/ui/Button';
import { useVexaStore } from '../../store/useVexaStore';
import { HelpCircle } from 'lucide-react';

export default function HonestQuestion() {
  const navigate = useNavigate();
  const { setSexEdSource, sexEdSource } = useVexaStore();
  const [selected, setSelected] = useState(sexEdSource);

  const sources = [
    { key: 'school', label: 'School classes & lectures' },
    { key: 'friends', label: 'Friends & peer circles' },
    { key: 'porn', label: 'Online videos & adult entertainment' },
    { key: 'parents', label: 'Parents & family chats' },
    { key: 'nowhere', label: 'Nowhere / completely self-taught' }
  ];

  const handleNext = () => {
    if (selected) {
      setSexEdSource(selected);
      navigate('/onboarding/complete');
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
            An honest question...
          </h2>
          <p className="font-nunito text-muted text-[13px] px-2">
            Where has most of your sex education come from so far? (Be honest, it is anonymous!)
          </p>
        </div>

        {/* Selection Options */}
        <div className="flex-1 flex flex-col justify-center gap-2.5 py-5 select-none">
          {sources.map((source) => {
            const isSelected = selected === source.key;

            return (
              <motion.div
                key={source.key}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(source.key)}
                className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all duration-200 ${
                  isSelected
                    ? 'bg-coral-soft/10 border-coral shadow-[0_0_10px_var(--coral-glow)]'
                    : 'bg-purple-card hover:bg-purple-light/40 border-dim'
                }`}
              >
                <span className="font-nunito font-semibold text-[13px] text-white">
                  {source.label}
                </span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? 'border-coral bg-coral' : 'border-muted/50'
                }`}>
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-scale-up" />
                  )}
                </div>
              </motion.div>
            );
          })}
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
