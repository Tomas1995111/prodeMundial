import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AdminMatchForm } from './admin-match-form'

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

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/auth/login')
  }

  if (!process.env.ADMIN_EMAIL || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/dashboard')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('nombre_completo')
    .eq('id', user.id)
    .single()

  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .order('match_date')

  const groups: Record<string, Match[]> = {}
  for (const match of matches ?? []) {
    const g = match.group_name
    if (!groups[g]) groups[g] = []
    groups[g].push(match)
  }

  const groupOrder = [
    'Grupo A', 'Grupo B', 'Grupo C', 'Grupo D', 'Grupo E', 'Grupo F',
    'Grupo G', 'Grupo H', 'Grupo I', 'Grupo J', 'Grupo K', 'Grupo L',
    'R32', 'R16', 'Cuartos', 'Semifinal', 'Tercer Puesto', 'Final',
  ]

  const sorted = Object.entries(groups).sort((a, b) => {
    const ia = groupOrder.indexOf(a[0])
    const ib = groupOrder.indexOf(b[0])
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib)
  })

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-lg font-bold text-zinc-900">Admin</h1>
              <p className="text-xs text-zinc-500">
                {profile?.nombre_completo || user.email}
              </p>
            </div>
            <nav className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-xs font-medium text-zinc-500 hover:text-zinc-900"
              >
                Pronósticos
              </Link>
              <Link
                href="/dashboard/leaderboard"
                className="text-xs font-medium text-zinc-500 hover:text-zinc-900"
              >
                Tabla
              </Link>
              <span className="text-xs font-semibold text-zinc-900">Admin</span>
            </nav>
          </div>
          <Link
            href="/dashboard"
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Volver
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <p className="mb-4 text-sm text-zinc-500">
          Cargá los resultados reales de los partidos. Los puntos se calculan automáticamente.
        </p>

        <div className="space-y-3">
          {sorted.map(([groupName, groupMatches]) => (
            <div
              key={groupName}
              className="rounded-xl border border-zinc-200 bg-zinc-50"
            >
              <div className="px-5 py-3">
                <span className="text-sm font-semibold text-zinc-900">
                  {groupName}
                </span>
              </div>

              <div className="space-y-2 border-t border-zinc-200 px-4 py-4">
                {groupMatches.map((match) => (
                  <AdminMatchForm key={match.id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
