import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

export default function HookSlide({ heading, subtext }) {
  if (!heading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex flex-col items-center text-center justify-center py-6 px-4 space-y-6 select-none"
    >
      {/* Dynamic Animated Sparkle Ring */}
      <div className="relative my-4 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="w-16 h-16 rounded-full border-2 border-dashed border-coral/40"
        />
        <div className="absolute">
          <Lightbulb size={28} className="text-coral fill-coral/10" />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-fredoka text-2xl font-extrabold text-white tracking-wide">
          {heading}
        </h2>
        <p className="font-nunito text-[14px] text-muted leading-relaxed max-w-[290px] mx-auto">
          {subtext}
        </p>
      </div>
    </motion.div>
  );
}
