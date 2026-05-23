import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout & Frame Components
import PhoneFrame from './components/layout/PhoneFrame';
import TopBar from './components/layout/TopBar';
import BottomNav from './components/layout/BottomNav';

// Onboarding Pages
import Welcome from './pages/onboarding/Welcome';
import AgeSelect from './pages/onboarding/AgeSelect';
import Motivations from './pages/onboarding/Motivations';
import HonestQuestion from './pages/onboarding/HonestQuestion';
import SetupComplete from './pages/onboarding/SetupComplete';

// Core Pages
import Home from './pages/Home';
import Lesson from './pages/Lesson';
import Myths from './pages/Myths';
import Ask from './pages/Ask';
import Profile from './pages/Profile';

// Store
import { useVexaStore } from './store/useVexaStore';

// Auth Pages & Context
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import { useAuth } from './contexts/AuthContext';

// Route Guards
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const onboardingComplete = useVexaStore((state) => state.onboardingComplete);
  
  if (loading) {
    return (
      <div className="flex-1 bg-[#120A33] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-coral border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  
  if (!onboardingComplete) {
    return <Navigate to="/onboarding/welcome" replace />;
  }
  
  return children;
};

const OnboardingRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const onboardingComplete = useVexaStore((state) => state.onboardingComplete);
  
  if (loading) {
    return (
      <div className="flex-1 bg-[#120A33] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-coral border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  
  if (onboardingComplete) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const onboardingComplete = useVexaStore((state) => state.onboardingComplete);
  
  if (loading) {
    return (
      <div className="flex-1 bg-[#120A33] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-coral border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to={onboardingComplete ? "/home" : "/onboarding/welcome"} replace />;
  }
  
  return children;
};

function AppContent() {
  const location = useLocation();
  
  // Decide whether to show TopBar and BottomNav based on page path
  const showNavAndBar = ['/home', '/myths', '/ask', '/profile'].includes(location.pathname);

  return (
    <PhoneFrame>
      {showNavAndBar && <TopBar />}
      
      {/* Dynamic viewport: scrollable for content feeds, strictly fixed for onboarding/lessons to prevent layout squeezes */}
      <div className={`flex-1 flex flex-col ${
        showNavAndBar ? 'overflow-y-auto no-scrollbar' : 'overflow-hidden'
      } relative w-full min-h-0`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Redirect root to /home or /onboarding */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Navigate to="/home" replace />
                </ProtectedRoute>
              } 
            />

            {/* Auth Routes */}
            <Route path="/auth/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/auth/signup" element={<AuthRoute><Signup /></AuthRoute>} />

            {/* Onboarding Flow */}
            <Route path="/onboarding/welcome" element={<OnboardingRoute><Welcome /></OnboardingRoute>} />
            <Route path="/onboarding/age" element={<OnboardingRoute><AgeSelect /></OnboardingRoute>} />
            <Route path="/onboarding/motivations" element={<OnboardingRoute><Motivations /></OnboardingRoute>} />
            <Route path="/onboarding/source" element={<OnboardingRoute><HonestQuestion /></OnboardingRoute>} />
            <Route path="/onboarding/complete" element={<OnboardingRoute><SetupComplete /></OnboardingRoute>} />

            {/* Core Application Screens */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/lesson/:worldId/:lessonId" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
            <Route path="/myths" element={<ProtectedRoute><Myths /></ProtectedRoute>} />
            <Route path="/ask" element={<ProtectedRoute><Ask /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>

      {showNavAndBar && <BottomNav />}
    </PhoneFrame>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
