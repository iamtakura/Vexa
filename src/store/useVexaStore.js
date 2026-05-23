import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WORLD_LESSONS } from '../data/worlds';
import { badges } from '../data/badges';
import { fetchProgress, pushProgress } from '../lib/progressSync';

export const LEVELS = [
  { level: 1, title: 'Curious Beginner',   xpRequired: 0    },
  { level: 2, title: 'Question Asker',      xpRequired: 100  },
  { level: 3, title: 'Myth Spotter',        xpRequired: 250  },
  { level: 4, title: 'Truth Seeker',        xpRequired: 500  },
  { level: 5, title: 'Reality Checker',     xpRequired: 900  },
  { level: 6, title: 'Body Expert',         xpRequired: 1400 },
  { level: 7, title: 'Consent Champion',    xpRequired: 2000 },
  { level: 8, title: 'Health Advocate',     xpRequired: 2800 },
  { level: 9, title: 'Relationship Master', xpRequired: 3800 },
  { level: 10, title: 'Vexa Graduate',      xpRequired: 5000 },
];

export const getLevelForXP = (xp) => {
  let activeLevel = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.xpRequired) {
      activeLevel = lvl;
    } else {
      break;
    }
  }
  return activeLevel;
};

// Helper to run badge evaluation
const evaluateBadges = (completedLessons, completedWorlds, xp, streak, currentEarned) => {
  const earned = [...currentEarned];
  let updated = false;

  for (const badge of badges) {
    if (earned.includes(badge.id)) continue;

    let conditionMet = false;
    const cond = badge.condition;

    if (cond.type === 'lessonComplete') {
      if (completedLessons.includes(cond.lessonId)) {
        conditionMet = true;
      }
    } else if (cond.type === 'xpTotal') {
      if (xp >= cond.value) {
        conditionMet = true;
      }
    } else if (cond.type === 'streakCount') {
      if (streak >= cond.value) {
        conditionMet = true;
      }
    } else if (cond.type === 'worldComplete') {
      if (completedWorlds.includes(cond.worldId)) {
        conditionMet = true;
      }
    }

    if (conditionMet) {
      earned.push(badge.id);
      updated = true;
    }
  }

  return { earned, updated };
};

export const useVexaStore = create(
  persist(
    (set, get) => ({
      // Onboarding State
      onboardingComplete: false,
      ageGroup: null,              // 'teen' | 'youngAdult'
      motivations: [],             // array of selected motivation keys
      sexEdSource: null,           // 'school' | 'friends' | 'porn' | 'parents' | 'nowhere'
      username: '',

      // Progress State
      xp: 0,
      level: 1,
      streak: 0,
      lastActiveDate: null,
      completedLessons: [],        // array of lesson IDs
      completedWorlds: [],         // array of world IDs
      earnedBadges: [],            // array of badge IDs

      // Actions
      setAgeGroup: (ageGroup) => set({ ageGroup }),
      setMotivations: (motivations) => set({ motivations }),
      setSexEdSource: (sexEdSource) => set({ sexEdSource }),
      setUsername: (username) => set({ username }),
      completeOnboarding: async (data, userId) => {
        const today = new Date().toDateString();
        set({
          username: data.username || 'Curious Learner',
          ageGroup: data.ageGroup,
          motivations: data.motivations,
          sexEdSource: data.sexEdSource,
          onboardingComplete: true,
          lastActiveDate: today,
          streak: 1, // Start streak on onboarding complete
          xp: 0,
          level: 1,
          completedLessons: [],
          completedWorlds: [],
          earnedBadges: []
        });

        // Trigger check in case onboarding gives streak badge
        const state = get();
        const badgeCheck = evaluateBadges(
          state.completedLessons,
          state.completedWorlds,
          state.xp,
          state.streak,
          state.earnedBadges
        );
        if (badgeCheck.updated) {
          set({ earnedBadges: badgeCheck.earned });
        }

        if (userId) {
          await get().syncToSupabase(userId);
        }
      },

      completeLesson: async (lessonId, xpEarned, userId) => {
        const completedLessons = [...get().completedLessons];
        if (!completedLessons.includes(lessonId)) {
          completedLessons.push(lessonId);
        }

        // Calculate XP and level
        const newXP = get().xp + xpEarned;
        const newLvl = getLevelForXP(newXP).level;

        // Check if any world has been completed
        const completedWorlds = [...get().completedWorlds];
        Object.keys(WORLD_LESSONS).forEach((worldId) => {
          if (completedWorlds.includes(worldId)) return;
          
          const lessonIds = WORLD_LESSONS[worldId];
          const allCompleted = lessonIds.every((lessonId) => 
            completedLessons.includes(lessonId)
          );
          if (allCompleted) {
            completedWorlds.push(worldId);
          }
        });

        // Update streak logic on completion if not already active today
        const today = new Date().toDateString();
        let newStreak = get().streak;
        let newLastActiveDate = get().lastActiveDate;

        if (newLastActiveDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toDateString();

          if (newLastActiveDate === yesterdayStr) {
            newStreak += 1;
          } else {
            newStreak = 1; // reset/start
          }
          newLastActiveDate = today;
        }

        set({
          completedLessons,
          completedWorlds,
          xp: newXP,
          level: newLvl,
          streak: newStreak,
          lastActiveDate: newLastActiveDate
        });

        // Check badges
        const state = get();
        const badgeCheck = evaluateBadges(
          state.completedLessons,
          state.completedWorlds,
          state.xp,
          state.streak,
          state.earnedBadges
        );
        if (badgeCheck.updated) {
          set({ earnedBadges: badgeCheck.earned });
        }

        if (userId) {
          await get().syncToSupabase(userId);
        }
      },

      addXP: async (amount, userId) => {
        const newXP = get().xp + amount;
        const newLvl = getLevelForXP(newXP).level;
        set({ xp: newXP, level: newLvl });

        // Check badges
        const state = get();
        const badgeCheck = evaluateBadges(
          state.completedLessons,
          state.completedWorlds,
          state.xp,
          state.streak,
          state.earnedBadges
        );
        if (badgeCheck.updated) {
          set({ earnedBadges: badgeCheck.earned });
        }

        if (userId) {
          await get().syncToSupabase(userId);
        }
      },

      updateStreak: async (userId) => {
        const today = new Date().toDateString();
        const last = get().lastActiveDate;

        if (last === today) return; // No change

        let newStreak = get().streak;
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (last === yesterdayStr) {
          newStreak += 1;
        } else {
          newStreak = 1; // Reset or restart
        }

        set({
          lastActiveDate: today,
          streak: newStreak
        });

        // Check badges
        const state = get();
        const badgeCheck = evaluateBadges(
          state.completedLessons,
          state.completedWorlds,
          state.xp,
          state.streak,
          state.earnedBadges
        );
        if (badgeCheck.updated) {
          set({ earnedBadges: badgeCheck.earned });
        }

        if (userId) {
          await get().syncToSupabase(userId);
        }
      },

      awardBadge: async (badgeId, userId) => {
        const earnedBadges = [...get().earnedBadges];
        if (!earnedBadges.includes(badgeId)) {
          earnedBadges.push(badgeId);
          set({ earnedBadges });
          
          if (userId) {
            await get().syncToSupabase(userId);
          }
        }
      },

      hydrateFromSupabase: async (userId) => {
        const progress = await fetchProgress(userId)
        if (progress) {
          set({
            username: progress.username,
            ageGroup: progress.age_group,
            motivations: progress.motivations,
            sexEdSource: progress.sex_ed_source,
            onboardingComplete: progress.onboarding_complete,
            xp: progress.xp,
            level: progress.level,
            streak: progress.streak,
            lastActiveDate: progress.last_active_date,
            completedLessons: progress.completed_lessons,
            completedWorlds: progress.completed_worlds,
            earnedBadges: progress.earned_badges,
          })
        }
      },

      syncToSupabase: async (userId) => {
        const state = get()
        await pushProgress(userId, state)
      },

      clearProgress: () => {
        set({
          onboardingComplete: false,
          ageGroup: null,
          motivations: [],
          sexEdSource: null,
          username: '',
          xp: 0,
          level: 1,
          streak: 0,
          lastActiveDate: null,
          completedLessons: [],
          completedWorlds: [],
          earnedBadges: []
        });
      }
    }),
    {
      name: 'vexa_user',
    }
  )
);
