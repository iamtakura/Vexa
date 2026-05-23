import { supabase } from './supabase'

// Pull progress from Supabase and return it
export const fetchProgress = async (userId) => {
  const { data, error } = await supabase
    .from('vexa_progress')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('[Vexa Sync] Fetch error:', error)
    return null
  }
  return data
}

// Push current Zustand state to Supabase
export const pushProgress = async (userId, state) => {
  const { error } = await supabase
    .from('vexa_progress')
    .upsert({
      user_id: userId,
      username: state.username,
      age_group: state.ageGroup,
      motivations: state.motivations,
      sex_ed_source: state.sexEdSource,
      onboarding_complete: state.onboardingComplete,
      xp: state.xp,
      level: state.level,
      streak: state.streak,
      last_active_date: state.lastActiveDate,
      completed_lessons: state.completedLessons,
      completed_worlds: state.completedWorlds,
      earned_badges: state.earnedBadges,
    }, { onConflict: 'user_id' })

  if (error) console.error('[Vexa Sync] Push error:', error)
}
