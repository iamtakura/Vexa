import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Info } from 'lucide-react';
import { myths } from '../data/myths';
import FilterTabs from '../components/myths/FilterTabs';
import MythCard from '../components/myths/MythCard';
import DailyCard from '../components/home/DailyCard';

export default function Myths() {
  const [activeTab, setActiveTab] = useState('all');

  // Filter logic
  const filteredMyths = activeTab === 'all'
    ? myths
    : myths.filter((m) => m.category === activeTab);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-full pb-8 w-full bg-[#120A33]"
    >
      {/* Screen Header */}
      <div className="px-5 pt-6 pb-2 select-none">
        <h1 className="font-fredoka text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>Myth Busters</span>
          <Sparkles size={20} className="text-coral fill-coral/10 animate-pulse" />
        </h1>
        <p className="font-nunito text-[13px] text-muted font-medium mt-1 leading-relaxed">
          Demolishing common misconceptions with verified, shame-free scientific facts.
        </p>
      </div>

      {/* Featured Daily Reality Check */}
      <DailyCard />

      {/* Filter Tabs Header */}
      <div className="px-5 mt-4 mb-2 select-none">
        <h3 className="font-fredoka text-[13px] font-bold text-muted uppercase tracking-wider">
          Filter Categories
        </h3>
      </div>

      {/* Sticky-like Horizontal filter bar */}
      <div className="sticky top-0 z-20 bg-[#120A33]/95 backdrop-blur-md py-1 border-b border-white/5">
        <FilterTabs activeTab={activeTab} onSelect={setActiveTab} />
      </div>

      {/* Myths Stack */}
      <div className="px-5 mt-4 space-y-4">
        {filteredMyths.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredMyths.map((myth, idx) => (
              <motion.div
                key={myth.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
              >
                <MythCard mythObj={myth} />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-purple-card flex items-center justify-center border border-dim text-muted">
              <Info size={20} />
            </div>
            <p className="font-nunito text-[13px] text-muted">
              No myths found in this category.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
