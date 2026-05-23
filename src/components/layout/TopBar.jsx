import React from 'react';
import { Flame, Trophy } from 'lucide-react';
import { useVexaStore, getLevelForXP } from '../../store/useVexaStore';
import { useNavigate } from 'react-router-dom';

export default function TopBar() {
  const { xp, streak } = useVexaStore();
  const navigate = useNavigate();
  const currentLevel = getLevelForXP(xp);
  const level = currentLevel.level;

  const pillStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    background: 'var(--purple-light)',
    border: '1px solid rgba(255,107,71,0.25)',
    borderRadius: '99px',
    padding: '5px 12px',
    fontSize: '13px',
    fontFamily: 'Nunito',
    fontWeight: '700',
    color: 'var(--white)',
    cursor: 'pointer',
    userSelect: 'none'
  };

  return (
    <div className="top-bar-safe flex items-center justify-between px-5 pt-3 pb-3 bg-purple-mid border-b border-dim/50 sticky top-0 z-40 select-none flex-shrink-0" style={{ background: 'var(--purple)' }}>
      {/* Vexa Logo */}
      <div 
        className="font-fredoka text-2xl font-bold text-coral cursor-pointer tracking-wider hover:scale-105 active:scale-95 transition-transform"
        onClick={() => navigate('/home')}
      >
        vexa
      </div>

      {/* Stats pill group */}
      <div className="flex items-center gap-2">
        {/* Streak Pill */}
        <div style={pillStyle} onClick={() => navigate('/profile')}>
          <Flame size={14} style={{ color: 'var(--coral)' }} />
          <span>{streak}</span>
        </div>

        {/* Level / XP Pill */}
        <div style={pillStyle} onClick={() => navigate('/profile')}>
          <Trophy size={14} style={{ color: 'var(--coral)' }} />
          <span>Lvl {level}</span>
        </div>
      </div>
    </div>
  );
}
