import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard-header'
import { LeaderboardTable } from '@/components/leaderboard-table'

export default async function LeaderboardPage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('nombre_completo')
    .eq('id', user.id)
    .single()

  const { data: leaderboard } = await supabase.rpc('get_leaderboard')

  return (
    <div className="min-h-screen bg-zinc-50">
      <DashboardHeader
        userName={profile?.nombre_completo || user.email}
        userEmail={user.email}
        activeTab="tabla"
      />

      <main className="mx-auto max-w-4xl px-4 py-6">
        <h2 className="mb-4 text-sm font-semibold text-zinc-900">
          Tabla de posiciones
        </h2>
        <LeaderboardTable
          entries={(leaderboard ?? []) as LeaderboardEntry[]}
          currentUserId={user.id}
        />
      </main>
    </div>
  )
}

type LeaderboardEntry = {
  user_id: string
  nombre_completo: string
  total_points: number
}
