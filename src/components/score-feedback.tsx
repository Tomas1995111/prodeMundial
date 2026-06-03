export function ScoreFeedback({
  matchLocalScore,
  matchAwayScore,
  predLocalGoals,
  predAwayGoals,
}: {
  matchLocalScore: number | null
  matchAwayScore: number | null
  predLocalGoals: number | null
  predAwayGoals: number | null
}) {
  if (
    matchLocalScore === null ||
    matchAwayScore === null ||
    predLocalGoals === null ||
    predAwayGoals === null
  ) {
    return null
  }

  const exact =
    predLocalGoals === matchLocalScore && predAwayGoals === matchAwayScore
  const winner =
    Math.sign(predLocalGoals - predAwayGoals) ===
    Math.sign(matchLocalScore - matchAwayScore)

  if (exact) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
        +5 exacto
      </span>
    )
  }
  if (winner) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
        +3 resultado
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
      +0
    </span>
  )
}
