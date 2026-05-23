// src/components/layout/PhoneFrame.jsx

import React, { useEffect, useState } from 'react';

const PhoneFrame = ({ children }) => {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // MOBILE — full screen, no frame
  if (viewportWidth < 480) {
    return (
      <div
        className="w-full min-h-screen flex flex-col relative overflow-hidden selection:bg-coral/30"
        style={{ background: 'var(--purple)' }}
      >
        {children}
      </div>
    );
  }

  // TABLET — centered card with shadow, no phone frame decoration
  if (viewportWidth < 1024) {
    return (
      <div
        className="min-h-screen flex items-start justify-center py-8 selection:bg-coral/30 w-full"
        style={{ background: 'var(--purple)' }}
      >
        <div
          className="w-full relative flex flex-col overflow-hidden"
          style={{
            maxWidth: '480px',
            minHeight: 'calc(100vh - 4rem)',
            background: 'var(--purple)',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,107,71,0.1)',
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  // DESKTOP — phone frame centered on dark background
  return (
    <div
      className="min-h-screen flex items-center justify-center relative selection:bg-coral/30 w-full"
      style={{ background: '#060e18' }}
    >
      {/* Desktop wrapper glow — added behind the phone frame */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 600px 400px at 50% 50%, rgba(255,107,71,0.06) 0%, transparent 70%)',
        }}
      />

      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: '390px',
          height: '844px',
          maxHeight: 'calc(100vh - 2rem)',
          maxWidth: 'calc(100vw - 2rem)',
          background: 'var(--purple)',
          borderRadius: '52px',
          border: '2px solid rgba(255,255,255,0.08)',
          boxShadow: '0 50px 130px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,107,71,0.12)',
        }}
      >
        {/* Notch — desktop only */}
        <div
          className="mx-auto flex-shrink-0 flex items-center justify-center relative"
          style={{
            width: '120px',
            height: '28px',
            background: '#0a0520',
            borderRadius: '0 0 18px 18px',
            zIndex: 50
          }}
        >
          <div className="w-2.5 h-2.5 bg-black rounded-full absolute left-4"></div>
          <div className="w-1.5 h-1.5 bg-[#120A33] rounded-full absolute right-8"></div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default PhoneFrame;
