type LeaderboardEntry = {
  user_id: string
  nombre_completo: string
  total_points: number
}

function MedalIcon({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-lg">🥇</span>
  if (rank === 2) return <span className="text-lg">🥈</span>
  if (rank === 3) return <span className="text-lg">🥉</span>
  return null
}

export function LeaderboardTable({
  entries,
  currentUserId,
}: {
  entries: LeaderboardEntry[]
  currentUserId: string
}) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="mb-3 text-4xl">🏆</span>
        <p className="text-lg font-medium text-zinc-400">
          Todavía no hay puntajes
        </p>
        <p className="mt-1 text-sm text-zinc-300">
          Los puntos aparecerán cuando haya resultados cargados.
        </p>
      </div>
    )
  }

  const maxPoints = entries[0].total_points

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-100 bg-zinc-50">
            <th className="w-10 px-4 py-3 text-left text-xs font-semibold text-zinc-400">
              #
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">
              Nombre
            </th>
            <th className="w-16 px-4 py-3 text-right text-xs font-semibold text-zinc-400">
              Pts
            </th>
            <th className="hidden px-4 py-3 sm:table-cell" />
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {entries.map((entry, index) => {
            const isCurrentUser = entry.user_id === currentUserId
            const barWidth =
              maxPoints > 0
                ? `${Math.round((entry.total_points / maxPoints) * 100)}%`
                : '0%'

            return (
              <tr
                key={entry.user_id}
                className={`transition-colors ${
                  isCurrentUser
                    ? 'bg-gradient-to-r from-primary/5 to-transparent'
                    : 'hover:bg-zinc-50'
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <MedalIcon rank={index + 1} />
                    {!MedalIcon({ rank: index + 1 }) && (
                      <span className="text-sm font-bold tabular-nums text-zinc-400">
                        {index + 1}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${
                        isCurrentUser ? 'text-primary font-semibold' : 'text-zinc-900'
                      }`}
                    >
                      {entry.nombre_completo}
                    </span>
                    {isCurrentUser && (
                      <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        vos
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      isCurrentUser ? 'text-primary' : 'text-zinc-900'
                    }`}
                  >
                    {entry.total_points}
                  </span>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCurrentUser
                          ? 'bg-gradient-to-r from-primary to-primary-dark'
                          : 'bg-zinc-300'
                      }`}
                      style={{ width: barWidth }}
                    />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
