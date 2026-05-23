import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { Award, Flame, Check, Sparkles } from 'lucide-react';
import { badges } from '../../data/badges';

export default function LessonComplete({ 
  xpGained, 
  correctCount, 
  totalCount, 
  badgeIdEarned, 
  onFinish 
}) {
  const [xpCount, setXpCount] = useState(0);
  const [showBadgeEarned, setShowBadgeEarned] = useState(false);
  const earnedBadge = badges.find(b => b.id === badgeIdEarned) || null;

  useEffect(() => {
    // Satisfying XP count-up animation
    if (xpGained <= 0) return;
    
    let current = 0;
    const duration = 1000; // 1s total
    const increment = Math.ceil(xpGained / 25);
    const stepTime = duration / (xpGained / increment);
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= xpGained) {
        setXpCount(xpGained);
        clearInterval(timer);
        
        // After XP counts up, if they earned a badge, show the popup!
        if (earnedBadge) {
          setTimeout(() => setShowBadgeEarned(true), 400);
        }
      } else {
        setXpCount(current);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [xpGained, earnedBadge]);

  return (
    <div className="flex-1 flex flex-col justify-between px-6 py-8 h-full bg-[#120A33] relative overflow-hidden select-none">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-coral opacity-40"
            initial={{ x: 195, y: 800 }}
            animate={{
              x: Math.random() * 320 + 20,
              y: Math.random() * 500 + 100,
              scale: Math.random() * 1.5 + 0.5,
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              repeat: Infinity,
              delay: Math.random() * 0.5
            }}
          />
        ))}
      </div>

      {/* Celebration Header */}
      <div className="text-center space-y-2 mt-4 z-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full bg-[#FF6B47]/20 border-2 border-coral flex items-center justify-center mx-auto shadow-[0_8px_24px_rgba(255,107,71,0.25)]"
        >
          <Award size={40} className="text-coral fill-coral/10" />
        </motion.div>

        <h2 className="font-fredoka text-3xl font-extrabold text-white tracking-wide">
          Lesson Complete!
        </h2>
        <p className="font-nunito text-muted text-[13px] px-6">
          Amazing work. You are building healthy understanding, step by step.
        </p>
      </div>

      {/* Score Grid Cards */}
      <div className="grid grid-cols-2 gap-4 my-6 z-10">
        {/* XP earned card */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-purple-card border border-dim rounded-2xl p-4 text-center flex flex-col items-center justify-center gap-1 shadow-md"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-coral/20">
            <Flame size={16} className="text-coral fill-coral/10 animate-pulse" />
          </div>
          <span className="font-fredoka text-2xl font-bold text-coral">
            +{xpCount}
          </span>
          <span className="font-nunito text-[11px] font-bold text-muted uppercase tracking-wider">
            XP Gained
          </span>
        </motion.div>

        {/* Accuracy tally card */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-purple-card border border-dim rounded-2xl p-4 text-center flex flex-col items-center justify-center gap-1 shadow-md"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/20">
            <Check size={16} className="text-success" />
          </div>
          <span className="font-fredoka text-2xl font-bold text-success">
            {correctCount} / {totalCount}
          </span>
          <span className="font-nunito text-[11px] font-bold text-muted uppercase tracking-wider">
            Correct Answers
          </span>
        </motion.div>
      </div>

      {/* Badge Award Modal Popup overlay */}
      <AnimatePresence>
        {showBadgeEarned && earnedBadge && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0E062B]/85 flex items-center justify-center p-6 z-50 select-none"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              className="bg-purple border-2 border-coral rounded-3xl p-6 text-center shadow-[0_20px_50px_rgba(255,107,71,0.3)] w-full max-w-[310px] space-y-5"
            >
              {/* Badge visual */}
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="w-20 h-20 rounded-full bg-coral flex items-center justify-center shadow-[0_6px_20px_var(--coral-glow)]"
                >
                  <Sparkles size={36} className="text-white fill-white/10" />
                </motion.div>
              </div>

              <div className="space-y-1">
                <span className="font-fredoka text-[11px] font-bold text-coral uppercase tracking-widest block leading-none">
                  Badge Unlocked!
                </span>
                <h3 className="font-fredoka text-xl font-bold text-white leading-tight">
                  {earnedBadge.title}
                </h3>
                <p className="font-nunito text-[12.5px] text-muted leading-relaxed px-2">
                  {earnedBadge.description}
                </p>
              </div>

              <Button
                onClick={() => setShowBadgeEarned(false)}
                className="w-full shadow-sm"
              >
                Awesome!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue CTA */}
      <div className="pb-4 z-10">
        <Button
          onClick={onFinish}
          className="w-full shadow-[0_8px_24px_rgba(255,107,71,0.25)]"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
