import React from 'react';
import { motion } from 'framer-motion';

export default function StatDropSlide({ stat, context }) {
  if (!stat) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col flex-1 py-6 px-4 space-y-6 select-none items-center text-center justify-center"
    >
      {/* Huge stat number with pop effect */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="font-fredoka text-[72px] font-extrabold text-coral leading-none tracking-tight drop-shadow-[0_4px_16px_var(--coral-glow)] select-all"
      >
        {stat}
      </motion.div>

      {/* Context info box */}
      <div className="bg-purple-card/50 border border-dim rounded-2xl p-5 max-w-[310px] shadow-lg">
        <h4 className="font-fredoka text-[11px] font-bold text-muted uppercase tracking-widest block mb-2 leading-none">
          Statistical Reality
        </h4>
        <p className="font-nunito text-[14px] font-medium text-white leading-relaxed">
          {context}
        </p>
      </div>
    </motion.div>
  );
}
