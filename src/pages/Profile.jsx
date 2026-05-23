import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Flame, Sparkles, BookOpen, Milestone, Settings, 
  Trash2, ShieldCheck, Heart, Info, AlertTriangle, ArrowRight, LogOut
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { useVexaStore, getLevelForXP } from '../store/useVexaStore';
import { badges } from '../data/badges';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

// Icon mapper helper
const LucideIcon = ({ name, size = 20, className = '' }) => {
  const IconComponent = Icons[name] || Icons.Award;
  return <IconComponent size={size} className={className} />;
};

export default function Profile() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { 
    username, xp, level, streak, completedLessons, 
    earnedBadges, clearProgress 
  } = useVexaStore();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  const activeLevel = getLevelForXP(xp);

  const handleReset = () => {
    clearProgress();
    setShowResetConfirm(false);
    // Force reload to go back to onboarding
    window.location.reload();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      clearProgress();
      setShowSignOutConfirm(false);
      navigate('/auth/login');
    } catch (err) {
      console.error('[Vexa Profile] SignOut error:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-full pb-8 w-full bg-[#120A33]"
    >
      {/* Profile Header Card */}
      <div className="relative p-6 pt-8 bg-gradient-to-b from-purple-mid/40 to-transparent border-b border-white/5 flex flex-col items-center text-center select-none">
        
        {/* Avatar Container with Level Ring */}
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full bg-coral/20 border-2 border-coral flex items-center justify-center shadow-lg shadow-coral/10">
            <User size={40} className="text-coral" />
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 bg-coral text-white border-2 border-[#120A33] px-2 py-0.5 rounded-full font-fredoka text-[11px] font-bold shadow-md">
            Lvl {level}
          </div>
        </div>

        {/* Username & Title */}
        <h2 className="font-fredoka text-xl font-bold text-white tracking-tight">
          {username || 'Curious Learner'}
        </h2>
        <span className="font-nunito text-[11.5px] text-coral font-extrabold uppercase tracking-widest mt-0.5 px-3 py-0.5 rounded-full bg-coral/10 border border-coral/20">
          {activeLevel.title}
        </span>
      </div>

      {/* Statistics Grid */}
      <div className="px-5 grid grid-cols-2 gap-3 select-none">
        {/* Streak Stat */}
        <div className="p-4 rounded-2xl bg-purple-card border border-dim/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center text-coral border border-coral/20">
            <Flame size={20} className="fill-current animate-pulse" />
          </div>
          <div>
            <span className="block font-fredoka text-base font-bold text-white leading-none">
              {streak} Days
            </span>
            <span className="font-nunito text-[10px] text-muted font-bold">
              Current Streak
            </span>
          </div>
        </div>

        {/* Total XP Stat */}
        <div className="p-4 rounded-2xl bg-purple-card border border-dim/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center text-yellow-400 border border-yellow-400/20">
            <Sparkles size={20} className="fill-current" />
          </div>
          <div>
            <span className="block font-fredoka text-base font-bold text-white leading-none">
              {xp}
            </span>
            <span className="font-nunito text-[10px] text-muted font-bold">
              Total XP Earned
            </span>
          </div>
        </div>

        {/* Completed Lessons Stat */}
        <div className="p-4 rounded-2xl bg-purple-card border border-dim/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-light/20 flex items-center justify-center text-[#B09CFF] border border-purple-light/35">
            <BookOpen size={20} />
          </div>
          <div>
            <span className="block font-fredoka text-base font-bold text-white leading-none">
              {completedLessons.length}
            </span>
            <span className="font-nunito text-[10px] text-muted font-bold">
              Lessons Beaten
            </span>
          </div>
        </div>

        {/* Next Level progress stat */}
        <div className="p-4 rounded-2xl bg-purple-card border border-dim/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center text-emerald-400 border border-emerald-400/20">
            <Milestone size={20} />
          </div>
          <div>
            <span className="block font-fredoka text-xs font-bold text-white leading-none uppercase">
              {activeLevel.level === 10 ? 'Graduate' : `Lvl ${activeLevel.level + 1}`}
            </span>
            <span className="font-nunito text-[10px] text-muted font-bold block mt-0.5">
              Next Rank Target
            </span>
          </div>
        </div>
      </div>

      {/* Badges Shelf section */}
      <div className="mt-6 select-none">
        <div className="px-5 mb-2 flex items-center justify-between">
          <h3 className="font-fredoka text-[13.5px] font-bold text-muted uppercase tracking-wider">
            Badges Gallery
          </h3>
          <span className="font-fredoka text-[11px] font-bold text-coral bg-coral/10 px-2 py-0.5 rounded-md">
            {earnedBadges.length} / {badges.length} Earned
          </span>
        </div>

        {/* Badges Shelf Horizontal List */}
        <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar px-5 py-3 w-full">
          {badges.map((badge) => {
            const isEarned = earnedBadges.includes(badge.id);

            return (
              <motion.button
                key={badge.id}
                whileHover={{ y: isEarned ? -2 : 0, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedBadge(badge)}
                className={`flex-shrink-0 w-24 p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center space-y-2 relative transition-all duration-200 ${
                  isEarned
                    ? 'bg-purple-card border-coral/30 hover:border-coral text-white shadow-md'
                    : 'bg-purple-card/45 border-dim/20 text-muted opacity-45 grayscale blur-[1.2px] hover:blur-none hover:opacity-75 transition-all'
                }`}
              >
                {/* Badge Icon Circle */}
                <div className={`w-11 h-11 rounded-full flex items-center justify-center border ${
                  isEarned
                    ? 'bg-coral text-white border-coral/35 shadow-inner'
                    : 'bg-purple-light/20 text-muted border-dim/15'
                }`}>
                  <LucideIcon name={badge.icon} size={18} />
                </div>

                <span className="font-fredoka text-[10px] font-bold truncate max-w-full leading-tight block">
                  {badge.title}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Badge detail disclosure drawer/panel */}
        <div className="px-5">
          <AnimatePresence mode="wait">
            {selectedBadge ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="p-4 rounded-2xl bg-purple-mid/30 border border-dim/30 flex items-start gap-3 mt-1.5 relative overflow-hidden"
              >
                {/* Decorative border accent */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  earnedBadges.includes(selectedBadge.id) ? 'bg-coral' : 'bg-muted'
                }`} />

                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
                  earnedBadges.includes(selectedBadge.id) 
                    ? 'bg-coral text-white border-coral/30'
                    : 'bg-purple-card text-muted border-dim/30'
                }`}>
                  <LucideIcon name={selectedBadge.icon} size={16} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-fredoka text-[12.5px] font-bold text-white">
                      {selectedBadge.title}
                    </h4>
                    <span className={`font-fredoka text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      earnedBadges.includes(selectedBadge.id)
                        ? 'bg-success/15 text-success border border-success/20'
                        : 'bg-white/5 text-muted border border-white/5'
                    }`}>
                      {earnedBadges.includes(selectedBadge.id) ? 'Earned' : 'Locked'}
                    </span>
                  </div>
                  <p className="font-nunito text-[11px] text-white/90 leading-relaxed pr-6">
                    {selectedBadge.description}
                  </p>
                  
                  {/* Lock Requirement */}
                  {!earnedBadges.includes(selectedBadge.id) && (
                    <div className="flex items-center gap-1 text-[9.5px] text-muted font-semibold pt-1 font-nunito border-t border-white/5 mt-1.5">
                      <Info size={11} className="text-coral" />
                      <span>Rule: {
                        selectedBadge.condition.type === 'lessonComplete' 
                          ? 'Finish Reality Check World 3 or specific modules'
                          : selectedBadge.condition.type === 'xpTotal'
                          ? `Accumulate ${selectedBadge.condition.value} XP`
                          : selectedBadge.condition.type === 'streakCount'
                          ? `Reach a ${selectedBadge.condition.value}-day learning streak`
                          : 'Complete specific Vexa World challenges'
                      }</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="py-5 text-center bg-purple-mid/10 rounded-2xl border border-dashed border-dim/20">
                <p className="font-nunito text-[11px] text-muted italic flex items-center justify-center gap-1.5">
                  <Info size={13} />
                  <span>Tap any badge card to see unlocking rules</span>
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Settings list options */}
      <div className="mt-6 select-none">
        <div className="px-5 mb-2">
          <h3 className="font-fredoka text-[13.5px] font-bold text-muted uppercase tracking-wider">
            System Settings
          </h3>
        </div>

        <div className="px-5 space-y-2.5">
          {/* Clear progress toggle */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-purple-card/75 border border-dim/35 hover:bg-error/10 hover:border-error/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-error/10 text-error flex items-center justify-center border border-error/20 group-hover:bg-error group-hover:text-white transition-colors">
                <Trash2 size={16} />
              </div>
              <div className="text-left">
                <span className="block font-fredoka text-[13px] font-bold text-white group-hover:text-error transition-colors">
                  Reset Learning Progress
                </span>
                <span className="block font-nunito text-[10.5px] text-muted">
                  Wipes your XP, streak history, and earned badges.
                </span>
              </div>
            </div>
            <ArrowRight size={14} className="text-muted group-hover:text-error transition-colors" />
          </button>

          {/* Sign Out toggle */}
          <button
            onClick={() => setShowSignOutConfirm(true)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-purple-card/75 border border-dim/35 hover:bg-white/5 hover:border-white/20 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-light/20 text-muted flex items-center justify-center border border-dim/15 group-hover:bg-purple-light/30 group-hover:text-white transition-colors">
                <LogOut size={16} />
              </div>
              <div className="text-left">
                <span className="block font-fredoka text-[13px] font-bold text-white group-hover:text-white transition-colors">
                  Sign Out of Account
                </span>
                <span className="block font-nunito text-[10.5px] text-muted">
                  Saves and secures your learning history to the cloud.
                </span>
              </div>
            </div>
            <ArrowRight size={14} className="text-muted group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      {/* Privacy Guarantee Trust Box */}
      <div className="mx-5 mt-6 p-4 rounded-2xl bg-gradient-to-tr from-purple-mid/45 to-[#241355]/45 border border-white/5 space-y-2 select-none">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-coral fill-coral/10 animate-pulse" />
          <span className="font-fredoka text-[12.5px] font-bold text-white">
            100% Privacy Guarantee
          </span>
        </div>
        <p className="font-nunito text-[11px] text-muted leading-relaxed">
          Your sex education is completely your own. Vexa works entirely offline. All answers, badges, and learning logs are kept safe, encrypted, and saved locally inside your web browser. No data ever leaves your device.
        </p>
      </div>

      {/* Confirmation Reset Modal Overlay */}
      <AnimatePresence>
        {showResetConfirm && (
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
              className="bg-[#1C1145] border border-dim rounded-3xl p-6 text-center shadow-2xl w-full max-w-[310px] space-y-4"
            >
              {/* Warning graphic */}
              <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto border border-error/20">
                <AlertTriangle size={24} />
              </div>
              
              <h3 className="font-fredoka text-lg font-bold text-white leading-tight">
                Wipe All Progress?
              </h3>
              
              <p className="font-nunito text-muted text-[12px] leading-relaxed px-2">
                This action is irreversible. You will lose your current level, all your badges, and your current learning streak.
              </p>
              
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  onClick={handleReset}
                  variant="ghost"
                  className="w-full text-error hover:bg-error/10 font-bold"
                >
                  Yes, Reset Progress
                </Button>
                <Button
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Sign Out Modal Overlay */}
      <AnimatePresence>
        {showSignOutConfirm && (
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
              className="bg-[#1C1145] border border-dim rounded-3xl p-6 text-center shadow-2xl w-full max-w-[310px] space-y-4"
            >
              {/* LogOut graphic */}
              <div className="w-12 h-12 rounded-full bg-purple-light/20 text-muted flex items-center justify-center mx-auto border border-dim/15">
                <LogOut size={24} className="text-white" />
              </div>
              
              <h3 className="font-fredoka text-lg font-bold text-white leading-tight">
                Sign Out?
              </h3>
              
              <p className="font-nunito text-muted text-[12px] leading-relaxed px-2">
                Are you sure? Your progress is saved to your account.
              </p>
              
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  className="w-full text-white hover:bg-white/5 font-bold"
                >
                  Sign Out
                </Button>
                <Button
                  onClick={() => setShowSignOutConfirm(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
