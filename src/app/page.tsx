import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-night via-night to-night-light px-4">
      <div className="pointer-events-none absolute -inset-40 bg-[radial-gradient(circle_at_50%_30%,rgba(22,163,74,0.15),transparent_70%)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-primary/5 to-transparent" />

      <div className="relative w-full max-w-md space-y-8 text-center animate-fade-in">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark shadow-lg shadow-primary/25">
            <span className="text-4xl">⚽</span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Prode Mundial <span className="text-gold">2026</span>
          </h1>
          <p className="text-base text-zinc-400">
            Registrate, predicí los resultados de todos los partidos
            y competí con tus amigos
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/auth/register"
            className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
          >
            Crear cuenta gratis
          </Link>
          <Link
            href="/auth/login"
            className="rounded-xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-300 transition-all hover:border-zinc-500 hover:text-white hover:bg-white/5 active:scale-[0.98]"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-6 text-center text-xs text-zinc-600">
        Mundial 2026 · 48 selecciones · 104 partidos
      </footer>
    </div>
  )
}
