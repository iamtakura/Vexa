import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { myths } from '../../data/myths';

export default function DailyCard() {
  const navigate = useNavigate();

  const getDailyMyth = () => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return myths[dayOfYear % myths.length];
  };

  const myth = getDailyMyth();

  const handleBustMyth = () => {
    navigate(`/lesson/${myth.worldId}/${myth.lessonId}`);
  };

  return (
    <motion.div
      animate={{
        y: [0, -6, 0]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleBustMyth}
      className="mx-5 mb-5 min-h-[120px] p-5 sm:p-6 relative overflow-hidden cursor-pointer select-none will-change-transform"
      style={{
        background: 'linear-gradient(135deg, var(--coral) 0%, #e03e1a 100%)',
        boxShadow: '0 10px 30px rgba(255,107,71,0.35)',
        borderRadius: '22px'
      }}
    >
      {/* Decorative circle */}
      <div 
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.08)' }} 
      />
      
      {/* Tag */}
      <p className="font-nunito text-xs font-700 uppercase tracking-widest opacity-80 mb-1 flex items-center gap-1">
        <Zap size={12} className="text-white fill-current" /> Daily Reality Check
      </p>
      
      {/* Myth question — rotate daily */}
      <p 
        className="font-fredoka text-lg sm:text-xl font-600 leading-snug mb-4 text-white"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {myth.myth}
      </p>
      
      {/* CTA */}
      <div 
        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-nunito font-700"
        style={{ background: 'rgba(255,255,255,0.22)' }}
      >
        Bust this myth
        <ChevronRight size={14} />
      </div>
    </motion.div>
  );
}
