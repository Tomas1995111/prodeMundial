import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard-header'
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

const GROUP_ORDER = [
  'Grupo A', 'Grupo B', 'Grupo C', 'Grupo D', 'Grupo E', 'Grupo F',
  'Grupo G', 'Grupo H', 'Grupo I', 'Grupo J', 'Grupo K', 'Grupo L',
  'R32', 'R16', 'Cuartos', 'Semifinal', 'Tercer Puesto', 'Final',
]

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

  const sorted = Object.entries(groups).sort((a, b) => {
    const ia = GROUP_ORDER.indexOf(a[0])
    const ib = GROUP_ORDER.indexOf(b[0])
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib)
  })

  return (
    <div className="min-h-screen bg-zinc-50">
      <DashboardHeader
        userName={profile?.nombre_completo || user.email}
        userEmail={user.email}
        activeTab="admin"
      />

      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span>💡</span>
          <span>
            Cargá los resultados reales de los partidos. Los puntos se calculan automáticamente.
          </span>
        </div>

        <div className="space-y-3">
          {sorted.map(([groupName, groupMatches]) => (
            <div
              key={groupName}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs"
            >
              <div className="border-b border-zinc-100 px-5 py-3">
                <span className="text-sm font-semibold text-zinc-900">
                  {groupName}
                </span>
              </div>

              <div className="space-y-2 px-4 py-4">
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
