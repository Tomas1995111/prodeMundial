import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard-header'
import { PredictionsList } from '@/components/predictions-list'

type Match = {
  id: string
  local_team: string
  away_team: string
  match_date: string
  group_name: string
  status: string
  local_score: number | null
  away_score: number | null
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .order('match_date')

  const { data: userPredictions } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', user.id)

  const predictionsMap = new Map(
    (userPredictions ?? []).map((p) => [p.match_id, p])
  )

  const groups: Record<string, Match[]> = {}
  for (const match of matches ?? []) {
    const g = match.group_name
    if (!groups[g]) groups[g] = []
    groups[g].push(match)
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <DashboardHeader
        userName={profile?.nombre_completo || user.email}
        userEmail={user.email}
        activeTab="pronosticos"
      />

      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-4 flex items-start gap-2 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
          <span className="mt-0.5 shrink-0">🗓️</span>
          <span>
            Tenés hasta <strong>2 horas antes</strong> de cada partido para hacer
            o modificar tu pronóstico. Pasado ese plazo, el partido se cierra
            automáticamente.
          </span>
        </div>

        <PredictionsList groups={groups} predictions={predictionsMap} />
      </main>
    </div>
  )
}
