'use client'

import { GroupSection } from './group-section'

type Match = {
  id: string
  local_team: string
  away_team: string
  match_date: string
  group_name: string
  status: string
}

type PredictionsMap = Map<string, { local_goals: number; away_goals: number }>

type GroupedMatches = Record<string, Match[]>

export function PredictionsList({
  groups,
  predictions,
}: {
  groups: GroupedMatches
  predictions: PredictionsMap
}) {
  const groupOrder = [
    'Grupo A',
    'Grupo B',
    'Grupo C',
    'Grupo D',
    'Grupo E',
    'Grupo F',
    'Grupo G',
    'Grupo H',
    'Grupo I',
    'Grupo J',
    'Grupo K',
    'Grupo L',
    'R32',
    'R16',
    'Cuartos',
    'Semifinal',
    'Tercer Puesto',
    'Final',
  ]

  const sorted = Object.entries(groups).sort((a, b) => {
    const ia = groupOrder.indexOf(a[0])
    const ib = groupOrder.indexOf(b[0])
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib)
  })

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-zinc-400">No hay partidos disponibles</p>
        <p className="mt-1 text-sm text-zinc-300">
          Los partidos aparecerán aquí una vez que estén cargados.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sorted.map(([groupName, groupMatches]) => (
        <GroupSection
          key={groupName}
          title={groupName}
          matches={groupMatches}
          predictions={predictions}
          defaultOpen={groupName.startsWith('Grupo')}
        />
      ))}
    </div>
  )
}
