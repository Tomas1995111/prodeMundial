import Link from 'next/link'
import { logout } from '@/app/actions/auth'

export function DashboardHeader({
  userName,
  userEmail,
  activeTab,
}: {
  userName: string
  userEmail?: string
  activeTab: 'pronosticos' | 'tabla' | 'admin'
}) {
  const isAdmin = !!(
    process.env.ADMIN_EMAIL &&
    userEmail &&
    userEmail === process.env.ADMIN_EMAIL
  )

  const tabs = [
    { id: 'pronosticos' as const, label: 'Pronósticos', href: '/dashboard' },
    { id: 'tabla' as const, label: 'Tabla', href: '/dashboard/leaderboard' },
    ...(isAdmin ? [{ id: 'admin' as const, label: 'Admin', href: '/admin' }] : []),
  ]

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white shadow-xs">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-dark text-sm font-bold text-white shadow-xs">
              P
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-zinc-900">
                Prode Mundial 2026
              </h1>
              <p className="text-xs text-zinc-500">{userName}</p>
            </div>
          </Link>
          <nav className="flex items-center gap-1">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-all hover:bg-zinc-100 hover:border-zinc-400"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </header>
  )
}
