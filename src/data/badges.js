export const badges = [
  {
    id: 'badge-001',
    title: 'Reality Checker',
    description: 'Busted the core pornography performance myths.',
    icon: 'Sparkles',
    condition: { type: 'lessonComplete', lessonId: 'w3-l1' }
  },
  {
    id: 'badge-002',
    title: 'First Steps',
    description: 'Completed your very first Vexa anatomy lesson.',
    icon: 'BookOpen',
    condition: { type: 'lessonComplete', lessonId: 'w1-l1' }
  },
  {
    id: 'badge-003',
    title: 'Body Positive',
    description: 'Embraced body diversity and busted appearance myths.',
    icon: 'Smile',
    condition: { type: 'lessonComplete', lessonId: 'w3-l3' }
  },
  {
    id: 'badge-004',
    title: 'Knowledge Seeker',
    description: 'Accumulated over 100 XP learning real facts.',
    icon: 'Award',
    condition: { type: 'xpTotal', value: 100 }
  },
  {
    id: 'badge-005',
    title: 'Streak Starter',
    description: 'Maintained a 3-day learning streak.',
    icon: 'Flame',
    condition: { type: 'streakCount', value: 3 }
  },
  {
    id: 'badge-006',
    title: 'Streak Master',
    description: 'Maintained a 7-day learning streak.',
    icon: 'Zap',
    condition: { type: 'streakCount', value: 7 }
  },
  {
    id: 'badge-007',
    title: 'Consent Hero',
    description: 'Learned the active boundaries of communication.',
    icon: 'Shield',
    condition: { type: 'lessonComplete', lessonId: 'w2-l1' }
  },
  {
    id: 'badge-008',
    title: 'Vexa Graduate',
    description: 'Completed at least one full world in the map.',
    icon: 'Milestone',
    condition: { type: 'worldComplete', worldId: 'world-3' }
  },
  {
    id: 'badge-all-world3',
    title: 'Reality Checker',
    description: 'Completed all Reality Check lessons',
    icon: 'ShieldCheck',
    condition: {
      type: 'worldComplete',
      worldId: 'world-3'
    }
  }
];
