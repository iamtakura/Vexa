import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Check, Lock } from 'lucide-react';

export default function WorldNode({ 
  world, 
  status, 
  isRecommended = false, 
  isTablet = false,
  onClick 
}) {
  const { title, subtitle, icon, color } = world;
  const { completed, active, locked } = status;
  const [showTooltip, setShowTooltip] = useState(false);

  // Dynamic Lucide Icon picker
  const IconComponent = Icons[icon] || Icons.BookOpen;

  const handleTap = (e) => {
    if (locked) {
      e.stopPropagation();
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div className="relative flex flex-col items-center pb-[8px] select-none z-10">
      

      {/* Tooltip for Locked Nodes */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: -45, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bg-purple-light border border-dim text-white text-[11px] font-nunito px-3 py-1.5 rounded-xl shadow-lg z-30 pointer-events-none text-center w-48"
          >
            Complete the previous world to unlock.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Node Circle */}
      <motion.button
        whileHover={locked ? {} : { scale: 1.08 }}
        whileTap={locked ? { scale: 0.95 } : { scale: 0.92 }}
        onClick={handleTap}
        className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-4 relative transition-all duration-300 min-h-[44px] min-w-[44px] ${
          completed 
            ? 'bg-purple border-coral shadow-[0_4px_16px_var(--coral-glow)]' 
            : active 
              ? 'bg-coral border-white shadow-[0_8px_24px_rgba(255,107,71,0.45)] animate-pulse-glow text-white' 
              : locked
                ? 'bg-purple-card border-dim text-muted/40 cursor-not-allowed'
                : 'bg-purple-light border-[#FF8363] text-white hover:shadow-[0_4px_12px_rgba(255,107,71,0.2)]'
        }`}
        style={{ borderColor: completed ? 'var(--coral)' : active ? '#F9F7FF' : locked ? undefined : 'rgba(255,107,71,0.5)' }}
      >
        {/* Icon Inside Node */}
        {locked ? (
          <Lock size={isTablet ? 22 : 18} className="text-muted/40" />
        ) : (
          <IconComponent 
            size={completed ? (isTablet ? 26 : 22) : (isTablet ? 28 : 24)} 
            className={`${completed ? 'text-coral' : 'text-white'} fill-current`} 
          />
        )}

        {/* Completed Badge overlay */}
        {completed && (
          <div className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-coral flex items-center justify-center border-2 border-purple shadow-sm">
            <Check size={12} strokeWidth={4} className="text-white" />
          </div>
        )}
      </motion.button>

      {/* Node Labels */}
      <div className="mt-2 text-center max-w-[150px]">
        <h4 className={`font-fredoka text-[13.5px] sm:text-[16px] font-bold leading-tight ${locked ? 'text-muted/40' : 'text-white'}`}>
          {title}
        </h4>
        <p className={`font-nunito text-[10.5px] sm:text-[12px] mt-0.5 leading-none ${locked ? 'text-muted/30' : 'text-muted'}`}>
          {subtitle.split(' · ')[0]}
        </p>
      </div>

      {/* Recommended Ribbon */}
      {isRecommended && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-coral px-2.5 py-0.5 rounded-full border border-white/20 shadow-[0_4px_10px_var(--coral-glow)] z-20 flex items-center gap-1 shrink-0"
          style={{ marginTop: '8px', marginBottom: '8px' }}
        >
          <Icons.Sparkles size={9} className="text-white fill-current" />
          <span className="font-fredoka text-[9.5px] font-bold text-white uppercase tracking-wider">
            Recommended for you
          </span>
        </motion.div>
      )}
    </div>
  );
}
