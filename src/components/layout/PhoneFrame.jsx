// src/components/layout/PhoneFrame.jsx

import React from 'react';
import { Map, Zap, MessageCircle, Trophy } from 'lucide-react';

const PhoneFrame = ({ children }) => {
  return (
    <>
      {/* MOBILE & TABLET — full screen, no frame decoration */}
      <div 
        className="lg:hidden w-full min-h-screen min-h-[100dvh] flex flex-col relative"
        style={{ background: 'var(--purple)', overflowX: 'hidden' }}
      >
        {children}
      </div>

      {/* DESKTOP — beautiful two-panel layout */}
      <div 
        className="hidden lg:flex min-h-screen w-full relative selection:bg-coral/30"
        style={{ background: '#060e18' }}
      >
        {/* Background Ambient Glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 800px 500px at 60% 50%, rgba(255,107,71,0.05) 0%, transparent 70%)',
            zIndex: 0
          }}
        />

        {/* LEFT PANEL — branding & informative dashboard columns */}
        <div 
          className="flex-1 flex flex-col items-center justify-center px-12 relative z-10"
          style={{ maxWidth: '500px' }}
        >
          {/* Subtle Ambient glow behind left panel */}
          <div 
            className="absolute pointer-events-none"
            style={{
              width: '400px', 
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,107,71,0.06) 0%, transparent 70%)',
              left: '-100px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              zIndex: 0
            }}
          />

          <div className="relative z-10 flex flex-col items-center select-none text-center">
            {/* Vexa Logo */}
            <div 
              className="font-fredoka text-5xl font-700 mb-6 tracking-wide"
              style={{ color: 'white' }}
            >
              vex<span style={{ color: 'var(--coral)' }}>a</span>
            </div>

            {/* Tagline */}
            <p 
              className="font-fredoka text-2xl font-600 text-center mb-4 text-white leading-tight"
            >
              Everything they<br />didn't teach you.
            </p>

            {/* Description */}
            <p 
              className="font-nunito text-[13.5px] text-center mb-8 leading-relaxed"
              style={{ color: 'var(--muted)', maxWidth: '320px' }}
            >
              Real sex ed. No shame. No filter. 47 lessons across 7 worlds — from anatomy to healthy relationships.
            </p>

            {/* Feature lists */}
            <div className="flex flex-col items-center space-y-3 w-full">
              {[
                { icon: Map, text: '7 worlds, 47 lessons' },
                { icon: Zap, text: 'Daily myth-busting' },
                { icon: MessageCircle, text: 'AI chat assistant' },
                { icon: Trophy, text: 'XP & achievements' }
              ].map(({ icon: Icon, text }) => (
                <div 
                  key={text}
                  className="font-nunito text-xs font-700 px-4 py-2.5 rounded-full flex items-center justify-center gap-2 text-white border border-white/5 shadow-md w-60 select-none bg-purple-card/45 backdrop-blur-md"
                >
                  <Icon size={14} style={{ color: 'var(--coral)' }} className="fill-coral/10" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — mobile simulated device mock frame */}
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div 
            className="relative flex flex-col overflow-hidden"
            style={{
              width: '390px',
              height: '844px',
              maxHeight: 'calc(100vh - 2rem)',
              background: 'var(--purple)',
              borderRadius: '52px',
              border: '2px solid rgba(255,255,255,0.08)',
              boxShadow: '0 50px 130px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,107,71,0.12)',
            }}
          >
            {/* Notch */}
            <div 
              className="mx-auto flex-shrink-0 flex items-center justify-center relative z-50"
              style={{
                width: '120px', 
                height: '28px',
                background: '#0a0520',
                borderRadius: '0 0 18px 18px'
              }}
            >
              <div className="w-2.5 h-2.5 bg-black rounded-full absolute left-4"></div>
              <div className="w-1.5 h-1.5 bg-[#120A33] rounded-full absolute right-8"></div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default PhoneFrame;
