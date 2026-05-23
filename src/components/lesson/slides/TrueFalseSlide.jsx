import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

export default function TrueFalseSlide({ 
  statement, 
  answer, 
  explanation,
  selected, 
  onSelect, 
  evaluated, 
  isCorrect 
}) {
  if (!statement) return null;

  const options = [
    { value: true, label: 'True', color: 'border-green-500 bg-green-500/10' },
    { value: false, label: 'False', color: 'border-red-500 bg-red-500/10' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex flex-col flex-1 py-4 px-4 space-y-5 select-none justify-center"
    >
      {/* Statement Card */}
      <div className="bg-purple-card border border-dim rounded-2xl p-5 shadow-inner">
        <span className="font-fredoka text-[11px] font-bold text-coral uppercase tracking-widest block mb-2">
          Fact or Myth?
        </span>
        <p className="font-nunito text-[14.5px] font-semibold text-white leading-relaxed">
          {statement}
        </p>
      </div>

      {/* Selectable Options */}
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const isSelected = selected === opt.value;
          const showEvaluation = evaluated && isSelected;
          
          let cardStyle = "border-dim bg-purple-card hover:bg-purple-light/30";
          if (isSelected && !evaluated) {
            cardStyle = "border-coral bg-coral-soft/10 shadow-[0_0_8px_var(--coral-glow)]";
          } else if (evaluated) {
            if (isSelected) {
              cardStyle = isCorrect 
                ? "border-success bg-success/15 text-success" 
                : "border-error bg-error/15 text-error";
            } else if (opt.value === answer) {
              // Highlight the correct answer if user got it wrong
              cardStyle = "border-success bg-success/5 opacity-80 text-success";
            } else {
              cardStyle = "border-dim bg-purple-card opacity-50";
            }
          }

          return (
            <motion.button
              key={opt.label}
              whileTap={evaluated ? {} : { scale: 0.98 }}
              disabled={evaluated}
              onClick={() => onSelect(opt.value)}
              className={`p-4 rounded-xl border-2 flex items-center justify-between text-left font-fredoka text-base font-bold text-white transition-all duration-200 min-h-[52px] ${cardStyle}`}
            >
              <span>{opt.label}</span>

              {/* Status Icon */}
              {evaluated && isSelected && (
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  isCorrect ? 'bg-success text-white' : 'bg-error text-white'
                }`}>
                  {isCorrect ? <Check size={12} strokeWidth={4} /> : <X size={12} strokeWidth={4} />}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
