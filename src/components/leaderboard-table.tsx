type LeaderboardEntry = {
  user_id: string
  nombre_completo: string
  total_points: number
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
        <p className="text-lg font-medium text-zinc-400">
          Todavía no hay puntajes
        </p>
        <p className="mt-1 text-sm text-zinc-300">
          Los puntos aparecerán cuando haya resultados cargados.
        </p>
      </div>
    )
  }

  const maxPoints = entries.length > 0 ? entries[0].total_points : 0

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-100">
            <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 w-12">
              #
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500">
              Nombre
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 w-20">
              Pts
            </th>
            <th className="hidden sm:table-cell px-4 py-3 w-32" />
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
                className={`${isCurrentUser ? 'bg-zinc-900 text-white' : 'bg-white'}`}
              >
                <td
                  className={`px-4 py-3 text-sm font-bold ${
                    isCurrentUser ? 'text-white' : 'text-zinc-900'
                  }`}
                >
                  {index + 1}
                </td>
                <td className="px-4 py-3 text-sm font-medium">
                  <span
                    className={
                      isCurrentUser ? 'text-white' : 'text-zinc-900'
                    }
                  >
                    {entry.nombre_completo}
                  </span>
                  {isCurrentUser && (
                    <span className="ml-2 text-xs text-zinc-400">(vos)</span>
                  )}
                </td>
                <td
                  className={`px-4 py-3 text-right text-sm font-bold tabular-nums ${
                    isCurrentUser ? 'text-white' : 'text-zinc-900'
                  }`}
                >
                  {entry.total_points}
                </td>
                <td className="hidden sm:table-cell px-4 py-3">
                  <div className="h-2 w-full rounded-full bg-zinc-100">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isCurrentUser
                          ? 'bg-white/70'
                          : 'bg-zinc-900'
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
