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

  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('status, match_date')
    .eq('id', matchId)
    .single()

  if (matchError || !match) {
    return { error: 'Partido no encontrado' }
  }

  if (match.status === 'finalizado') {
    return { error: 'El partido ya finalizó, no se puede modificar el pronóstico' }
  }

  const matchTime = new Date(match.match_date).getTime()
  const twoHoursBefore = matchTime - 2 * 60 * 60 * 1000
  if (Date.now() >= twoHoursBefore) {
    return { error: 'El plazo venció 2 horas antes del partido' }
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
