import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map } from 'lucide-react';
import GreetingBlock from '../components/home/GreetingBlock';
import XPBar from '../components/home/XPBar';
import DailyCard from '../components/home/DailyCard';
import WorldMap from '../components/home/WorldMap';
import { useVexaStore } from '../store/useVexaStore';
import { WORLD_METADATA } from '../data/worlds';

export default function Home() {
  const updateStreak = useVexaStore((state) => state.updateStreak);
  const completedWorlds = useVexaStore((state) => state.completedWorlds);

  useEffect(() => {
    // Proactively check streak on app load/mount
    updateStreak();
  }, [updateStreak]);

  const activeWorld = WORLD_METADATA.find((w) => !completedWorlds.includes(w.id)) || WORLD_METADATA[WORLD_METADATA.length - 1];
  const activeWorldLabel = `World ${activeWorld.order} active`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-full pb-8 w-full bg-[#120A33]"
    >
      {/* Personalized Greeting */}
      <GreetingBlock />

      {/* Level & XP Gauge */}
      <XPBar />

      {/* Daily Reality Check (Featured Myth) */}
      <DailyCard />

      {/* Learning Path Section Header */}
      <div className="flex items-center justify-between px-5 mb-4">
        <div className="flex items-center gap-2">
          <Map size={16} style={{ color: 'var(--coral)' }} />
          <h2 className="font-fredoka text-lg font-600 text-white">Your Journey</h2>
        </div>
        <span className="font-nunito text-xs font-700 px-3 py-1 rounded-full"
          style={{
            color: 'var(--coral)',
            background: 'var(--coral-soft)',
          }}>
          {activeWorldLabel}
        </span>
      </div>

      {/* Interactive 7-World Map Zigzag Node Stream */}
      <WorldMap />
    </motion.div>
  );
}
