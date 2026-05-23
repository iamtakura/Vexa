import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function OnboardingLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Map paths to steps 1-5
  const getStep = () => {
    switch (location.pathname) {
      case '/onboarding/welcome': return 1;
      case '/onboarding/age': return 2;
      case '/onboarding/motivations': return 3;
      case '/onboarding/source': return 4;
      case '/onboarding/complete': return 5;
      default: return 1;
    }
  };

  const currentStep = getStep();

  const handleBack = () => {
    switch (currentStep) {
      case 2: navigate('/onboarding/welcome'); break;
      case 3: navigate('/onboarding/age'); break;
      case 4: navigate('/onboarding/motivations'); break;
      case 5: navigate('/onboarding/source'); break;
      default: break;
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between min-h-0 relative w-full">
      {/* Top Header: Back Button & Progress Dots - fixed at top */}
      <div className="flex-shrink-0 flex items-center justify-between min-h-[44px] px-6 pt-4 pb-2">
        {/* Back Button (only shown on step 2, 3, 4) */}
        {currentStep > 1 && currentStep < 5 ? (
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-[44px] h-[44px] rounded-full hover:bg-purple-light text-white transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={24} />
          </button>
        ) : (
          <div className="w-[44px] h-[44px]" /> // Spacer
        )}

        {/* Onboarding Progress Dots */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((step) => {
            const isActive = step === currentStep;
            const isCompleted = step < currentStep;

            return (
              <div
                key={step}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'w-6 bg-coral shadow-[0_0_8px_var(--coral-glow)]' 
                    : isCompleted 
                      ? 'w-2.5 bg-coral/65' 
                      : 'w-2.5 bg-muted/40'
                }`}
              />
            );
          })}
        </div>

        {/* Spacer for centering progress dots */}
        <div className="w-[44px] h-[44px]" />
      </div>

      {/* Scrollable Screen Content */}
      <div className="flex-1 overflow-y-auto min-h-0 px-6 py-2 no-scrollbar relative flex flex-col">
        {children}
      </div>
    </div>
  );
}
