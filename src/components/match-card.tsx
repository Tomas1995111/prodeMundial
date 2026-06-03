'use client'

import { useRef, useState, useEffect } from 'react'
import { savePrediction } from '@/app/actions/predictions'
import { StatusBadge } from './status-badge'
import { ScoreFeedback } from './score-feedback'
import { flag } from '@/lib/flags'

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

const TWO_HOURS = 2 * 60 * 60 * 1000

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

  const isFinished = match.status === 'finalizado'
  const matchTime = new Date(match.match_date).getTime()
  const [now] = useState(() => Date.now())
  const isLocked = isFinished || now >= matchTime - TWO_HOURS

  const debouncedSave = () => {
    if (isLocked) return
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
    if (isLocked) return
    setLocalGoals(value)
    debouncedSave()
  }

  const handleAwayChange = (value: string) => {
    if (isLocked) return
    setAwayGoals(value)
    debouncedSave()
  }

  const dateStr = new Date(match.match_date).toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires',
  })

  const inputClasses =
    'w-12 rounded-lg border px-2 py-1.5 text-center text-sm transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none' +
    (isLocked
      ? ' border-zinc-200 bg-zinc-100 text-zinc-400 cursor-not-allowed'
      : ' border-zinc-300 bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20')

  return (
    <div
      className={`group relative flex items-center gap-3 rounded-lg border bg-white px-4 py-3 transition-all ${
        isLocked
          ? 'border-zinc-200 opacity-80'
          : 'border-zinc-200 hover:border-zinc-300 hover:shadow-xs'
      }`}
    >
      {isFinished && match.local_score !== null && match.away_score !== null && (
        <div className="absolute -left-px top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
      )}

      <div className="min-w-0 flex-1 text-right">
        <span className="text-sm font-medium text-zinc-900">
          {flag(match.local_team)} {match.local_team}
        </span>
      </div>

      <div className="flex flex-col items-center gap-1">
        {isFinished && match.local_score !== null && match.away_score !== null && (
          <span className="text-xs font-semibold tabular-nums text-primary">
            {match.local_score} – {match.away_score}
          </span>
        )}
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            max="99"
            value={localGoals}
            onChange={(e) => handleLocalChange(e.target.value)}
            disabled={isLocked}
            className={inputClasses}
          />
          <span className="text-xs font-bold text-zinc-300">vs</span>
          <input
            type="number"
            min="0"
            max="99"
            value={awayGoals}
            onChange={(e) => handleAwayChange(e.target.value)}
            disabled={isLocked}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <span className="text-sm font-medium text-zinc-900">
          {flag(match.away_team)} {match.away_team}
        </span>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <StatusBadge status={match.status} locked={isLocked && !isFinished} />
          {isFinished && (
            <ScoreFeedback
              matchLocalScore={match.local_score}
              matchAwayScore={match.away_score}
              predLocalGoals={prediction?.local_goals ?? null}
              predAwayGoals={prediction?.away_goals ?? null}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isLocked && saveStatus === 'saving' && (
            <span className="animate-fade-in text-xs text-zinc-400">
              guardando…
            </span>
          )}
          {!isLocked && saveStatus === 'saved' && (
            <span className="animate-fade-in text-xs text-green-600">
              ✓ guardado
            </span>
          )}
          <span
            className={`hidden text-xs sm:block ${
              isLocked && !isFinished ? 'text-zinc-400' : 'text-zinc-400'
            }`}
          >
            {isLocked && !isFinished && '🔒 '}
            {dateStr}
          </span>
        </div>
      </div>
    </div>
  )
}
