'use client'

import { useActionState } from 'react'
import { updateMatchResult } from '@/app/actions/admin'
import { flagUrl } from '@/lib/flags'

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
    timeZone: 'America/Argentina/Buenos_Aires',
  })

  const hasResult = match.local_score !== null && match.away_score !== null

  return (
    <form
      action={formAction}
      className="relative flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 transition-all hover:border-zinc-300"
    >
      <input type="hidden" name="matchId" value={match.id} />

      <div className="min-w-0 flex-1 text-right">
        <span className="text-sm font-medium text-zinc-900">
          {flagUrl(match.local_team) && (
            <img src={flagUrl(match.local_team)} width="18" alt="" className="-mt-0.5 inline-block align-middle" />
          )}{' '}
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
          className="w-12 rounded-lg border border-zinc-300 px-2 py-1.5 text-center text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="text-xs font-bold text-zinc-300">vs</span>
        <input
          type="number"
          name="awayScore"
          min="0"
          max="99"
          defaultValue={match.away_score ?? ''}
          className="w-12 rounded-lg border border-zinc-300 px-2 py-1.5 text-center text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </div>

      <div className="min-w-0 flex-1">
        <span className="text-sm font-medium text-zinc-900">
          {flagUrl(match.away_team) && (
            <img src={flagUrl(match.away_team)} width="18" alt="" className="-mt-0.5 inline-block align-middle" />
          )}{' '}
          {match.away_team}
        </span>
      </div>

      <button
        type="submit"
        disabled={pending}
        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all active:scale-[0.97] disabled:opacity-50 ${
          hasResult
            ? 'border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10'
            : 'border border-zinc-300 text-zinc-700 hover:bg-zinc-100'
        }`}
      >
        {pending ? '…' : hasResult ? 'Actualizar' : 'Guardar'}
      </button>

      <span className="hidden text-xs text-zinc-400 sm:block">{dateStr}</span>

      {state?.error && (
        <div className="absolute -bottom-6 left-0 text-xs text-red-500">
          {state.error}
        </div>
      )}
    </form>
  )
}
