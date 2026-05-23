import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

export default function ScenarioSlide({ 
  situation, 
  options,
  selected, 
  onSelect, 
  evaluated 
}) {
  if (!situation || !options?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex flex-col flex-1 py-4 px-4 space-y-4 select-none justify-center"
    >
      {/* Situation Block */}
      <div className="bg-purple-card border border-dim rounded-2xl p-5 shadow-lg relative overflow-hidden">
        {/* Glow behind */}
        <div className="absolute right-0 top-0 w-16 h-16 rounded-full bg-coral-soft/5 blur-xl" />
        
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle size={16} className="text-coral" />
          <span className="font-fredoka text-[11px] font-bold text-coral uppercase tracking-widest leading-none">
            Real Scenario
          </span>
        </div>
        <p className="font-nunito text-[13.5px] font-semibold text-white leading-relaxed">
          {situation}
        </p>
      </div>

      {/* Selectable Choice list */}
      <div className="flex flex-col gap-2.5">
        {options.map((option, idx) => {
          const isSelected = selected === idx;
          let cardStyle = "border-dim bg-purple-card hover:bg-purple-light/30";

          if (isSelected && !evaluated) {
            cardStyle = "border-coral bg-coral-soft/10 shadow-[0_0_8px_var(--coral-glow)]";
          } else if (evaluated) {
            if (isSelected) {
              cardStyle = "border-coral bg-coral-soft/15 text-white";
            } else {
              cardStyle = "border-dim bg-purple-card opacity-40";
            }
          }

          return (
            <motion.button
              key={idx}
              whileTap={evaluated ? {} : { scale: 0.98 }}
              disabled={evaluated}
              onClick={() => onSelect(idx)}
              className={`p-4 rounded-xl border-2 text-left font-nunito text-[12.5px] font-semibold text-white transition-all duration-200 min-h-[50px] leading-snug ${cardStyle}`}
            >
              {option.label}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
