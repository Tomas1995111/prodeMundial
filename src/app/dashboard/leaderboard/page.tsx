import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LeaderboardTable } from '@/components/leaderboard-table'
import { logout } from '@/app/actions/auth'

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
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-lg font-bold text-zinc-900">
                Prode Mundial 2026
              </h1>
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
              <span className="text-xs font-semibold text-zinc-900">
                Tabla
              </span>
              {process.env.ADMIN_EMAIL &&
                user.email === process.env.ADMIN_EMAIL && (
                  <Link
                    href="/admin"
                    className="text-xs font-medium text-zinc-500 hover:text-zinc-900"
                  >
                    Admin
                  </Link>
                )}
            </nav>
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
