// src/data/worlds.js

// WORLD METADATA — loads synchronously, needed for the map on Home screen
// Keep this lightweight — no slides data here
export const WORLD_METADATA = [
  { id: 'world-1', title: 'Know Your Body',          subtitle: 'Anatomy · Puberty · The Cycle',      icon: 'HeartPulse',   order: 1 },
  { id: 'world-2', title: 'Consent & Communication', subtitle: 'Boundaries · Signals · Respect',     icon: 'HandHeart',    order: 2 },
  { id: 'world-3', title: 'Reality Check',           subtitle: 'Porn · Media · Myths',               icon: 'ShieldCheck',  order: 3 },
  { id: 'world-4', title: 'Sexual Health',           subtitle: 'STIs · Contraception · Care',        icon: 'Stethoscope',  order: 4 },
  { id: 'world-5', title: 'Relationships',           subtitle: 'Dynamics · Identity · Trust',        icon: 'Users',        order: 5 },
  { id: 'world-6', title: 'Identity & Pleasure',     subtitle: 'Orientation · Self · Expression',    icon: 'Sparkles',     order: 6 },
  { id: 'world-7', title: 'The Cycle Deep Dive',     subtitle: 'Phases · Conditions · Tracking',     icon: 'Activity',     order: 7 },
]

// Synchronous lightweight mapping of world IDs to their lesson IDs
export const WORLD_LESSONS = {
  'world-1': ['w1-l1', 'w1-l2', 'w1-l3', 'w1-l4', 'w1-l5', 'w1-l6'],
  'world-2': ['w2-l1', 'w2-l2', 'w2-l3', 'w2-l4', 'w2-l5', 'w2-l6'],
  'world-3': ['w3-l1', 'w3-l2', 'w3-l3', 'w3-l4', 'w3-l5', 'w3-l6', 'w3-l7', 'w3-l8'],
  'world-4': ['w4-l1', 'w4-l2', 'w4-l3', 'w4-l4', 'w4-l5', 'w4-l6', 'w4-l7'],
  'world-5': ['w5-l1', 'w5-l2', 'w5-l3', 'w5-l4', 'w5-l5', 'w5-l6', 'w5-l7'],
  'world-6': ['w6-l1', 'w6-l2', 'w6-l3', 'w6-l4', 'w6-l5', 'w6-l6', 'w6-l7'],
  'world-7': ['w7-l1', 'w7-l2', 'w7-l3', 'w7-l4', 'w7-l5', 'w7-l6', 'w7-l7'],
}

// DYNAMIC LOADER — call this only when a lesson is actually opened
export const loadWorld = async (worldId) => {
  switch (worldId) {
    case 'world-1': return (await import('./worlds/world1')).world1
    case 'world-2': return (await import('./worlds/world2')).world2
    case 'world-3': return (await import('./worlds/world3')).world3
    case 'world-4': return (await import('./worlds/world4')).world4
    case 'world-5': return (await import('./worlds/world5')).world5
    case 'world-6': return (await import('./worlds/world6')).world6
    case 'world-7': return (await import('./worlds/world7')).world7
    default: throw new Error(`Unknown worldId: ${worldId}`)
  }
}

// LESSON LOADER — call this when navigating to /lesson/:worldId/:lessonId
export const loadLesson = async (worldId, lessonId) => {
  const world = await loadWorld(worldId)
  const lesson = world.lessons.find(l => l.id === lessonId)
  if (!lesson) throw new Error(`Lesson ${lessonId} not found in ${worldId}`)
  return lesson
}
