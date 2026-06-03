'use client'

import { useState } from 'react'
import { MatchCard } from './match-card'

type Match = {
  id: string
  local_team: string
  away_team: string
  match_date: string
  group_name: string
  status: string
}

type PredictionsMap = Map<string, { local_goals: number; away_goals: number }>

export function GroupSection({
  title,
  matches,
  predictions,
  defaultOpen,
}: {
  title: string
  matches: Match[]
  predictions: PredictionsMap
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen ?? false)

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-left"
      >
        <span className="text-sm font-semibold text-zinc-900">{title}</span>
        <span className="text-xs text-zinc-400">
          {open ? '▲' : '▼'}
        </span>
      </button>

      {open && (
        <div className="space-y-2 border-t border-zinc-200 px-4 py-4">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              prediction={predictions.get(match.id) ?? null}
            />
          ))}
        </div>
      )}
    </div>
  )
}
