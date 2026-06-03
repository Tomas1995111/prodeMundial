import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
          Prode Mundial
        </h1>
        <p className="text-lg text-zinc-500">
          Registrate, predicí los resultados y sumá puntos
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/auth/register"
            className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Crear cuenta
          </Link>
          <Link
            href="/auth/login"
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
