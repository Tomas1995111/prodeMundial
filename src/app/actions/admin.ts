'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateMatchResult(
  prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'No autenticado' }
  }

  if (!process.env.ADMIN_EMAIL || user.email !== process.env.ADMIN_EMAIL) {
    return { error: 'No autorizado' }
  }

  const matchId = formData.get('matchId') as string
  const localScore = parseInt(formData.get('localScore') as string, 10)
  const awayScore = parseInt(formData.get('awayScore') as string, 10)

  if (!matchId || isNaN(localScore) || isNaN(awayScore)) {
    return { error: 'Datos inválidos' }
  }

  const { error } = await supabase.rpc('admin_set_match_score', {
    p_match_id: matchId,
    p_local_score: Math.max(0, localScore),
    p_away_score: Math.max(0, awayScore),
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin')
  return { error: null }
}
