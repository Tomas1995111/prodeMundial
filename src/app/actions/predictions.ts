'use server'

import { createClient } from '@/lib/supabase/server'

export async function savePrediction(
  matchId: string,
  localGoals: number,
  awayGoals: number
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'No autenticado' }
  }

  const goals = Math.max(0, localGoals)
  const away = Math.max(0, awayGoals)

  const { error } = await supabase.from('predictions').upsert(
    {
      user_id: user.id,
      match_id: matchId,
      local_goals: goals,
      away_goals: away,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id, match_id',
      ignoreDuplicates: false,
    }
  )

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}
