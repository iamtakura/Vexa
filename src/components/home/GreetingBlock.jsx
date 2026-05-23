import React from 'react';
import { useVexaStore } from '../../store/useVexaStore';

export default function GreetingBlock() {
  const username = useVexaStore((state) => state.username);

  const getTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="px-5 pb-5">
      {/* Time greeting — small, muted, understated */}
      <p className="font-nunito text-xs font-600 uppercase tracking-widest mb-1"
        style={{ color: 'var(--muted)' }}>
        {getTimeGreeting()}
      </p>
      
      {/* Name — large, bold, the real headline */}
      <h1 className="font-fredoka text-3xl font-700 leading-tight text-white">
        {username ? username : 'Curious Learner'}
        <span style={{ color: 'var(--coral)' }}>.</span>
      </h1>
      
      {/* Subtext — warm and motivating */}
      <p className="font-nunito text-sm mt-1" style={{ color: 'var(--muted)' }}>
        Ready to learn something real today?
      </p>
    </div>
  );
}
