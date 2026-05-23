import React from 'react';

export default function FilterTabs({ activeTab, onSelect }) {
  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'porn-media', label: 'Porn & Media' },
    { key: 'bodies', label: 'Bodies' },
    { key: 'consent', label: 'Consent' },
    { key: 'relationships', label: 'Relationships' },
    { key: 'health', label: 'Health' },
    { key: 'identity', label: 'Identity' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-5 py-2 select-none shrink-0 w-full">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => onSelect(tab.key)}
            className={`px-4 py-2 rounded-full font-nunito text-[11.5px] font-bold whitespace-nowrap transition-all duration-200 min-h-[36px] border ${
              isActive
                ? 'bg-coral border-coral text-white shadow-[0_4px_10px_var(--coral-glow)]'
                : 'bg-purple-card hover:bg-purple-light/55 border-dim text-muted'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
