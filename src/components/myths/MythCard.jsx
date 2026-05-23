import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayCircle, User, Heart, Shield, ArrowRight } from 'lucide-react';
import { WORLD_LESSONS } from '../../data/worlds';

// Helper to resolve the correct world and lesson path
const getLessonPath = (lessonId) => {
  const worldId = Object.keys(WORLD_LESSONS).find((wId) => 
    WORLD_LESSONS[wId].includes(lessonId)
  );
  if (worldId) {
    return `/lesson/${worldId}/${lessonId}`;
  }
  return '/home';
};

// Map category key to Icon & Color
const getCategoryMeta = (category) => {
  switch (category) {
    case 'porn-media':
      return {
        icon: PlayCircle,
        label: 'Porn & Media',
        colorClass: 'text-coral',
        bgClass: 'bg-coral/10 border-coral/20',
      };
    case 'bodies':
      return {
        icon: User,
        label: 'Bodies & Anatomy',
        colorClass: 'text-sky-400',
        bgClass: 'bg-sky-400/10 border-sky-400/20',
      };
    case 'relationships':
      return {
        icon: Heart,
        label: 'Relationships',
        colorClass: 'text-pink-400',
        bgClass: 'bg-pink-400/10 border-pink-400/20',
      };
    case 'health':
      return {
        icon: Shield,
        label: 'Sexual Health',
        colorClass: 'text-emerald-400',
        bgClass: 'bg-emerald-400/10 border-emerald-400/20',
      };
    default:
      return {
        icon: Shield,
        label: 'General',
        colorClass: 'text-muted',
        bgClass: 'bg-purple-light/10 border-purple-light/20',
      };
  }
};

export default function MythCard({ mythObj }) {
  const navigate = useNavigate();
  const { id, category, myth, tag, lessonId } = mythObj;
  const meta = getCategoryMeta(category);
  const IconComponent = meta.icon;
  const lessonPath = getLessonPath(lessonId);

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(lessonPath)}
      className="p-5 rounded-3xl bg-purple-card border border-dim/50 hover:border-coral/40 transition-all duration-200 cursor-pointer select-none space-y-4 shadow-[0_8px_20px_rgba(0,0,0,0.15)] flex flex-col justify-between"
    >
      {/* Top row: Category tag & Busted status */}
      <div className="flex items-center justify-between gap-2">
        {/* Category Pill */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${meta.bgClass}`}>
          <IconComponent size={12} className={meta.colorClass} />
          <span className={`font-fredoka text-[9.5px] font-bold uppercase tracking-wider ${meta.colorClass}`}>
            {meta.label}
          </span>
        </div>

        {/* Busted Badge */}
        <span className="font-fredoka text-[10px] font-extrabold tracking-wider bg-error/15 text-error px-2.5 py-1 rounded-lg border border-error/20">
          {tag}
        </span>
      </div>

      {/* Myth Statement */}
      <p className="font-nunito text-[14px] font-semibold text-white leading-relaxed italic">
        "{myth}"
      </p>

      {/* Footer / CTA indicator */}
      <div className="flex items-center justify-between pt-1 text-[11px] font-bold font-fredoka uppercase text-muted hover:text-white transition-colors group">
        <span className="tracking-wider">Explore Reality</span>
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-light group-hover:bg-coral group-hover:text-white transition-colors">
          <ArrowRight size={13} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
}
