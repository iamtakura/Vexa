import React, { useEffect, useState } from 'react';
import { useVexaStore, LEVELS, getLevelForXP } from '../../store/useVexaStore';

export default function XPBar() {
  const xp = useVexaStore((state) => state.xp);
  const currentLvl = getLevelForXP(xp);
  const nextLvl = LEVELS[currentLvl.level] || null; // levels are 1-indexed
  const level = currentLvl.level;
  const levelTitle = currentLvl.title;
  const nextLevelXP = nextLvl ? nextLvl.xpRequired : xp;

  const [width, setWidth] = useState(0);

  const progressPercent = nextLevelXP > 0 ? Math.min(100, Math.max(0, (xp / nextLevelXP) * 100)) : 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(progressPercent);
    }, 150);
    return () => clearTimeout(timer);
  }, [progressPercent]);

  return (
    <div className="mx-5 mb-5 rounded-2xl p-4 sm:p-5"
      style={{
        background: 'var(--purple-card)',
        border: '1px solid rgba(255,107,71,0.3)',  // subtle coral border tint
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)'
      }}>
      
      {/* Top row */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-fredoka text-sm font-600" style={{ color: 'var(--coral)' }}>
          {levelTitle}
        </span>
        <span className="font-nunito text-xs font-600" style={{ color: 'var(--muted)' }}>
          <span className="text-white font-700">{xp}</span> / {nextLevelXP} XP
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${width}%`,
            background: 'linear-gradient(90deg, var(--coral), #ffaa80)'
          }} />
      </div>
      
      {/* Next level hint */}
      {nextLvl && (
        <p className="font-nunito text-xs mt-2 text-right" style={{ color: 'var(--muted)' }}>
          {nextLevelXP - xp} XP to Level {level + 1}
        </p>
      )}
    </div>
  );
}
