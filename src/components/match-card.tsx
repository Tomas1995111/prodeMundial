'use client'

import { useRef, useState, useEffect } from 'react'
import { savePrediction } from '@/app/actions/predictions'

type Match = {
  id: string
  local_team: string
  away_team: string
  match_date: string
  group_name: string
  status: string
}

type Prediction = {
  local_goals: number
  away_goals: number
}

export function MatchCard({
  match,
  prediction,
}: {
  match: Match
  prediction: Prediction | null
}) {
  const [localGoals, setLocalGoals] = useState(
    prediction?.local_goals?.toString() ?? ''
  )
  const [awayGoals, setAwayGoals] = useState(
    prediction?.away_goals?.toString() ?? ''
  )
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>(
    'idle'
  )

  const localRef = useRef(localGoals)
  const awayRef = useRef(awayGoals)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    localRef.current = localGoals
  }, [localGoals])

  useEffect(() => {
    awayRef.current = awayGoals
  }, [awayGoals])

  useEffect(() => {
    if (saveStatus === 'saved') {
      const t = setTimeout(() => setSaveStatus('idle'), 2000)
      return () => clearTimeout(t)
    }
  }, [saveStatus])

  const debouncedSave = () => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      const local = parseInt(localRef.current, 10)
      const away = parseInt(awayRef.current, 10)
      if (isNaN(local) || isNaN(away)) return

      setSaveStatus('saving')
      const { error } = await savePrediction(match.id, local, away)
      if (!error) {
        setSaveStatus('saved')
      } else {
        setSaveStatus('idle')
      }
    }, 600)
  }

  const handleLocalChange = (value: string) => {
    setLocalGoals(value)
    debouncedSave()
  }

  const handleAwayChange = (value: string) => {
    setAwayGoals(value)
    debouncedSave()
  }

  const dateStr = new Date(match.match_date).toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3">
      <div className="min-w-0 flex-1 text-right">
        <span className="text-sm font-medium text-zinc-900">
          {match.local_team}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          max="99"
          value={localGoals}
          onChange={(e) => handleLocalChange(e.target.value)}
          className="w-12 rounded border border-zinc-300 px-2 py-1 text-center text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
        />
        <span className="text-xs font-bold text-zinc-400">vs</span>
        <input
          type="number"
          min="0"
          max="99"
          value={awayGoals}
          onChange={(e) => handleAwayChange(e.target.value)}
          className="w-12 rounded border border-zinc-300 px-2 py-1 text-center text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
        />
      </div>

      <div className="min-w-0 flex-1">
        <span className="text-sm font-medium text-zinc-900">
          {match.away_team}
        </span>
      </div>

      <div className="w-16 text-right">
        {saveStatus === 'saving' && (
          <span className="text-xs text-zinc-400">...</span>
        )}
        {saveStatus === 'saved' && (
          <span className="text-xs text-green-600">✓ Guardado</span>
        )}
      </div>

      <div className="hidden w-32 text-right text-xs text-zinc-400 sm:block">
        {dateStr}
      </div>
    </div>
  )
}
