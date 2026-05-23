import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

export default function MultiChoiceSlide({ 
  question, 
  options, 
  correctIndex, 
  explanation,
  selected, 
  onSelect, 
  evaluated, 
  isCorrect 
}) {
  if (!question || !options?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex flex-col flex-1 py-4 px-4 space-y-4 select-none justify-center"
    >
      {/* Question */}
      <h3 className="font-fredoka text-lg font-bold text-white text-center leading-snug px-2">
        {question}
      </h3>

      {/* Selectable Option Cards */}
      <div className="flex flex-col gap-3">
        {options.map((option, idx) => {
          const isSelected = selected === idx;
          const isCorrectChoice = idx === correctIndex;
          
          let cardStyle = "border-dim bg-purple-card hover:bg-purple-light/30";
          
          if (isSelected && !evaluated) {
            cardStyle = "border-coral bg-coral-soft/10 shadow-[0_0_8px_var(--coral-glow)]";
          } else if (evaluated) {
            if (isSelected) {
              cardStyle = isCorrect 
                ? "border-success bg-success/15 text-success" 
                : "border-error bg-error/15 text-error";
            } else if (isCorrectChoice) {
              cardStyle = "border-success bg-success/5 opacity-80 text-success";
            } else {
              cardStyle = "border-dim bg-purple-card opacity-50";
            }
          }

          return (
            <motion.button
              key={idx}
              whileTap={evaluated ? {} : { scale: 0.98 }}
              disabled={evaluated}
              onClick={() => onSelect(idx)}
              className={`p-4 rounded-xl border-2 flex items-center justify-between text-left font-nunito text-[13px] font-semibold text-white transition-all duration-200 min-h-[56px] leading-snug ${cardStyle}`}
            >
              <div className="flex items-center gap-3 pr-2">
                {/* Visual Index Circle (A, B, C) */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-fredoka text-[11px] font-bold border transition-colors ${
                  isSelected && !evaluated
                    ? 'border-coral text-coral bg-coral-soft'
                    : evaluated && isSelected
                      ? isCorrect ? 'border-success bg-success text-white' : 'border-error bg-error text-white'
                      : evaluated && isCorrectChoice
                        ? 'border-success text-success bg-success/10'
                        : 'border-muted text-muted'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                
                <span className="flex-1">{option}</span>
              </div>

              {/* Status Icons */}
              {evaluated && isSelected && (
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
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
