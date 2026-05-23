import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

// Data & Store
import { loadLesson } from '../data/worlds';
import { useVexaStore } from '../store/useVexaStore';
import { badges } from '../data/badges';

// Slide Components
import HookSlide from '../components/lesson/slides/HookSlide';
import TrueFalseSlide from '../components/lesson/slides/TrueFalseSlide';
import MultiChoiceSlide from '../components/lesson/slides/MultiChoiceSlide';
import ScenarioSlide from '../components/lesson/slides/ScenarioSlide';
import StatDropSlide from '../components/lesson/slides/StatDropSlide';

// Complete Screen
import LessonComplete from '../components/lesson/LessonComplete';
import Button from '../components/ui/Button';
import LessonErrorBoundary from '../components/lesson/LessonErrorBoundary';

import { useAuth } from '../contexts/AuthContext';

export default function Lesson() {
  const { worldId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { completeLesson, earnedBadges } = useVexaStore();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [evaluated, setEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [errorsCount, setErrorsCount] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [perfectLesson, setPerfectLesson] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [lessonDone, setLessonDone] = useState(false);
  const [earnedBadgeId, setEarnedBadgeId] = useState(null);

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    loadLesson(worldId, lessonId)
      .then(data => {
        // Validate slides array
        if (!Array.isArray(data.slides)) {
          if (!cancelled) {
            setError('Invalid lesson data')
            setLoading(false)
          }
          return
        }

        if (!cancelled) {
          setLesson(data)
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [worldId, lessonId])

  if (loading) return (
    <div className="flex-1 flex items-center justify-center"
      style={{ background: 'var(--purple)' }}>
      <div className="w-12 h-12 rounded-full animate-pulse"
        style={{ background: 'var(--coral)' }} />
    </div>
  )

  if (error || !lesson) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6"
      style={{ background: 'var(--purple)' }}>
      <p className="font-nunito text-sm text-center"
        style={{ color: 'var(--muted)' }}>
        Couldn't load this lesson — go back and try again.
      </p>
      <button onClick={() => navigate('/home')}
        className="font-nunito font-700 px-6 py-3 rounded-full text-white"
        style={{ background: 'var(--coral)' }}>
        Back to Home
      </button>
    </div>
  )

  const { title, slides, xpReward } = lesson;
  const totalSlides = slides.length;

  const currentSlide = slides[currentIdx];
  const isQuizSlide = ['truefalse', 'multichoice', 'scenario'].includes(currentSlide.type);

  // 3. Evaluation Handler
  const handleCheck = () => {
    if (evaluated) return;

    let correct = false;
    
    if (currentSlide.type === 'truefalse') {
      correct = selectedAnswer === currentSlide.answer;
    } else if (currentSlide.type === 'multichoice') {
      correct = selectedAnswer === currentSlide.correctIndex;
    } else if (currentSlide.type === 'scenario') {
      // Scenario is exploratory - picking any choice is correct / helpful!
      correct = true;
    }

    setIsCorrect(correct);
    setEvaluated(true);

    if (isQuizSlide) {
      if (correct) {
        setCorrectAnswers((c) => c + 1);
      } else {
        setErrorsCount((e) => e + 1);
        setPerfectLesson(false);
      }
    }
  };

  // 4. Slide Navigation
  const handleContinue = () => {
    // If not evaluated yet and it's a quiz slide, do check first
    if (!evaluated && isQuizSlide) {
      handleCheck();
      return;
    }

    // Go to next slide or finish lesson
    if (currentIdx < totalSlides - 1) {
      setCurrentIdx((idx) => idx + 1);
      setSelectedAnswer(null);
      setEvaluated(false);
      setIsCorrect(false);
    } else {
      // Complete lesson in store
      const finalXPEarned = perfectLesson ? 35 : xpReward;
      
      // Keep track of what badges user had BEFORE completing
      const badgesBefore = [...earnedBadges];
      
      completeLesson(lessonId, finalXPEarned, user?.id);

      // Check if a badge was earned during this step
      setTimeout(() => {
        const badgesAfter = useVexaStore.getState().earnedBadges;
        const newlyEarned = badgesAfter.find(b => !badgesBefore.includes(b));
        if (newlyEarned) {
          setEarnedBadgeId(newlyEarned);
        }
        setLessonDone(true);
      }, 50);
    }
  };

  const handleBackStep = () => {
    if (currentIdx > 0 && !evaluated) {
      setCurrentIdx((idx) => idx - 1);
      setSelectedAnswer(null);
      setEvaluated(false);
      setIsCorrect(false);
    }
  };

  // 5. Back Confirm logic
  const handleBackArrow = () => {
    if (currentIdx === 0 || lessonDone) {
      navigate('/home');
    } else {
      setShowConfirm(true);
    }
  };

  // Evaluation Panel Copies
  const getFeedbackCopy = () => {
    if (currentSlide.type === 'scenario') {
      const selectedOpt = currentSlide.options[selectedAnswer];
      return selectedOpt?.outcome || "Thanks for sharing!";
    }
    return isCorrect 
      ? ["Exactly right!", "You got it!", "Spot on!", "Perfect!"][currentIdx % 4]
      : ["Not quite — here's why:", "Good try! Let's review the facts:"][currentIdx % 2];
  };

  const renderSlide = (slide) => {
    if (!slide || !slide.type) {
      return null
    }

    switch (slide.type) {
      case 'hook':
        return <HookSlide heading={slide.heading} subtext={slide.subtext} />
      case 'truefalse':
        return (
          <TrueFalseSlide 
            statement={slide.statement} 
            answer={slide.answer} 
            explanation={slide.explanation}
            selected={selectedAnswer}
            onSelect={setSelectedAnswer}
            evaluated={evaluated}
            isCorrect={isCorrect}
          />
        )
      case 'multichoice':
        return (
          <MultiChoiceSlide 
            question={slide.question} 
            options={slide.options} 
            correctIndex={slide.correctIndex} 
            explanation={slide.explanation}
            selected={selectedAnswer}
            onSelect={setSelectedAnswer}
            evaluated={evaluated}
            isCorrect={isCorrect}
          />
        )
      case 'scenario':
        return (
          <ScenarioSlide 
            situation={slide.situation} 
            options={slide.options} 
            selected={selectedAnswer}
            onSelect={setSelectedAnswer}
            evaluated={evaluated}
          />
        )
      case 'statdrop':
        return <StatDropSlide stat={slide.stat} context={slide.context} />
      default:
        return null
    }
  }

  if (lessonDone) {
    const finalXPEarned = perfectLesson ? 35 : xpReward;
    return (
      <LessonComplete
        xpGained={finalXPEarned}
        correctCount={correctAnswers}
        totalCount={slides.filter(s => ['truefalse', 'multichoice'].includes(s.type)).length}
        badgeIdEarned={earnedBadgeId}
        onFinish={() => navigate('/home')}
      />
    );
  }

  // Progress Ratio
  const progressPercent = (currentIdx / totalSlides) * 100;

  return (
    <div className="flex-1 flex flex-col justify-between min-h-0 bg-[#120A33] text-white relative">
      {/* Top Header: Back arrow & Progress bar */}
      <div className="px-4 py-3 flex items-center justify-between gap-3 bg-purple-mid border-b border-dim/50 sticky top-0 z-30 min-h-[48px]">
        <button
          onClick={handleBackArrow}
          className="flex items-center justify-center w-[40px] h-[40px] rounded-full hover:bg-purple-light text-white transition-colors"
          aria-label="Exit lesson"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Progress bar */}
        <div className="flex-1 h-2.5 bg-purple-light/50 rounded-full overflow-hidden border border-dim">
          <div 
            className="h-full bg-coral rounded-full progress-bar-fill shadow-[0_0_6px_var(--coral-glow)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Slide Counter */}
        <span className="font-nunito text-[11px] font-semibold text-muted shrink-0 w-8 text-right">
          {currentIdx + 1} / {totalSlides}
        </span>
      </div>

      {/* Main Slide Panel Container */}
      <div 
        className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar py-4 relative"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            className="flex-1 flex flex-col justify-center"
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.25 }}
          >
            <LessonErrorBoundary currentSlide={currentSlide}>
              {renderSlide(currentSlide)}
            </LessonErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Footer & Feedback Slide Up drawer */}
      <div className="sticky bottom-0 z-40 bg-purple-mid border-t border-dim flex flex-col p-4 space-y-3 select-none">
        
        {/* Dynamic evaluation banner */}
        <AnimatePresence>
          {evaluated && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`rounded-2xl p-4 border flex flex-col gap-1.5 transition-all overflow-hidden ${
                currentSlide.type === 'scenario'
                  ? 'bg-coral-soft/10 border-coral/30 text-white'
                  : isCorrect
                    ? 'bg-success/10 border-success/30 text-success'
                    : 'bg-error/10 border-error/30 text-error'
              }`}
            >
              <div className="flex items-center gap-2 font-fredoka text-[14.5px] font-bold">
                {currentSlide.type === 'scenario' ? (
                  <Sparkles size={18} className="text-coral fill-current" />
                ) : isCorrect ? (
                  <CheckCircle2 size={18} className="text-success fill-success/10" />
                ) : (
                  <AlertCircle size={18} className="text-error" />
                )}
                <span>
                  {currentSlide.type === 'scenario' ? 'Scenario Feedback' : isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              
              <p className="font-nunito text-[12px] font-medium leading-relaxed opacity-90 pl-6">
                {getFeedbackCopy()}
              </p>
              
              {/* Myth busted explanation */}
              {isQuizSlide && currentSlide.type !== 'scenario' && (
                <div className="mt-1 border-t border-white/5 pt-2 pl-6">
                  <span className="font-fredoka text-[10px] font-bold uppercase tracking-wider block text-white/50 mb-0.5">
                    Real Context:
                  </span>
                  <p className="font-nunito text-[11px] text-white/80 leading-relaxed italic">
                    {currentSlide.explanation}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          {/* Back a slide button (only if not evaluated and not at start) */}
          {currentIdx > 0 && !evaluated && (
            <button
              onClick={handleBackStep}
              className="flex items-center justify-center border border-dim rounded-full min-h-[48px] px-4 font-nunito font-semibold text-[13px] text-muted hover:text-white transition-colors"
            >
              Back
            </button>
          )}
          
          <Button
            onClick={handleContinue}
            disabled={isQuizSlide && selectedAnswer === null}
            className="flex-1 shadow-sm font-fredoka uppercase tracking-wider text-[13px]"
          >
            {!evaluated && isQuizSlide ? 'Check' : 'Continue'}
          </Button>
        </div>
      </div>

      {/* Confirmation Exit Drawer Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center p-6 z-50 select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-purple border border-dim rounded-3xl p-6 text-center shadow-2xl w-full max-w-[310px] space-y-4"
            >
              <h3 className="font-fredoka text-xl font-bold text-white">
                Quit Lesson?
              </h3>
              <p className="font-nunito text-muted text-[13px] leading-relaxed px-2">
                You're in the middle of a great learning streak! Are you sure you want to exit? You will lose this lesson's progress.
              </p>
              
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  onClick={() => navigate('/home')}
                  variant="ghost"
                  className="w-full text-error hover:text-error/80 font-bold"
                >
                  Yes, Quit
                </Button>
                <Button
                  onClick={() => setShowConfirm(false)}
                  className="w-full"
                >
                  Keep Learning
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
