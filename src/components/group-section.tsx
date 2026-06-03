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
  local_score: number | null
  away_score: number | null
}

type Prediction = {
  local_goals: number
  away_goals: number
}

type PredictionsMap = Map<string, Prediction>

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
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-zinc-50"
      >
        <span className="text-sm font-semibold text-zinc-900">{title}</span>
        <svg
          className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? 'max-h-[9999px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-2 border-t border-zinc-100 px-4 py-4">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              prediction={predictions.get(match.id) ?? null}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
