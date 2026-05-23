import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Sparkles, MessageCircle, User } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/home', label: 'Learn', icon: BookOpen },
    { path: '/myths', label: 'Myths', icon: Sparkles },
    { path: '/ask', label: 'Ask', icon: MessageCircle },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav 
      className="bottom-nav-safe flex items-center justify-around flex-shrink-0 sticky bottom-0 z-40 select-none w-full"
      style={{
        background: 'var(--purple-mid)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        minHeight: '64px',
      }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <button
            key={item.path}
            onClick={() => {
              if (!isActive) {
                navigate(item.path);
              }
            }}
            className="flex flex-col items-center justify-center flex-1 min-h-[44px] min-w-[44px] transition-all duration-200"
            aria-label={item.label}
          >
            <Icon 
              size={20} 
              className={`transition-colors duration-200 ${
                isActive 
                  ? 'text-coral fill-coral' 
                  : 'text-muted hover:text-white'
              }`}
            />
            <span 
              className={`font-nunito text-[11px] font-bold mt-1 transition-colors duration-200 ${
                isActive ? 'text-coral' : 'text-muted'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
