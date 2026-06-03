'use client'

import { useActionState } from 'react'
import { updateMatchResult } from '@/app/actions/admin'

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

export function AdminMatchForm({ match }: { match: Match }) {
  const [state, formAction, pending] = useActionState(updateMatchResult, {
    error: null,
  })

  const dateStr = new Date(match.match_date).toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  const hasResult = match.local_score !== null && match.away_score !== null

  return (
    <form
      action={formAction}
      className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3"
    >
      <input type="hidden" name="matchId" value={match.id} />

      <div className="min-w-0 flex-1 text-right">
        <span className="text-sm font-medium text-zinc-900">
          {match.local_team}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          name="localScore"
          min="0"
          max="99"
          defaultValue={match.local_score ?? ''}
          className="w-12 rounded border border-zinc-300 px-2 py-1 text-center text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
        />
        <span className="text-xs font-bold text-zinc-400">vs</span>
        <input
          type="number"
          name="awayScore"
          min="0"
          max="99"
          defaultValue={match.away_score ?? ''}
          className="w-12 rounded border border-zinc-300 px-2 py-1 text-center text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
        />
      </div>

      <div className="min-w-0 flex-1">
        <span className="text-sm font-medium text-zinc-900">
          {match.away_team}
        </span>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
      >
        {pending ? '...' : hasResult ? 'Actualizar' : 'Guardar'}
      </button>

      <div className="hidden w-36 text-right text-xs text-zinc-400 sm:block">
        {dateStr}
      </div>

      {state?.error && (
        <div className="absolute -bottom-6 left-0 text-xs text-red-500">
          {state.error}
        </div>
      )}
    </form>
  )
}
