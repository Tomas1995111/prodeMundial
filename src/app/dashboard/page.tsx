import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'
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
    console.error('Auth error:', authError?.message)
    redirect('/auth/login')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: matches, error: matchesError } = await supabase
    .from('matches')
    .select('*')
    .order('match_date')

  const { data: userPredictions, error: predictionsError } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', user.id)

  if (matchesError) console.error('Matches query error:', matchesError.message)
  if (predictionsError) console.error('Predictions query error:', predictionsError.message)
  if (profileError) console.error('Profile query error:', profileError.message)

  console.log('Matches count:', matches?.length ?? 0)
  console.log('Predictions count:', userPredictions?.length ?? 0)

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
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-lg font-bold text-zinc-900">
              Prode Mundial 2026
            </h1>
            <p className="text-xs text-zinc-500">
              {profile?.nombre_completo || user.email}
            </p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <PredictionsList groups={groups} predictions={predictionsMap} />
      </main>
    </div>
  )
}
