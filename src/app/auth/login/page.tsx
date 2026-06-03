'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import Link from 'next/link'

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, { error: null })

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-night to-night-light px-4">
      <div className="w-full max-w-sm animate-fade-in space-y-6 rounded-2xl border border-zinc-800 bg-white p-8 shadow-xl shadow-black/10">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark text-xl shadow-sm">
            ⚽
          </div>
          <h1 className="text-xl font-bold text-zinc-900">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Ingresá tus datos para continuar
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm shadow-xs transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm shadow-xs transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {state?.error && (
            <p className="animate-fade-in text-sm text-red-600">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50"
          >
            {pending ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500">
          ¿No tenés cuenta?{' '}
          <Link
            href="/auth/register"
            className="font-semibold text-primary hover:text-primary-dark"
          >
            Registrate
          </Link>
        </p>
      </div>
    </div>
  )
}
