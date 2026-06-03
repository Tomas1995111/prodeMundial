export function StatusBadge({
  status,
  locked,
}: {
  status: string
  locked?: boolean
}) {
  if (status === 'finalizado') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
        ✅ Finalizado
      </span>
    )
  }
  if (status === 'en_vivo' || status === 'live') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
        🔴 En vivo
      </span>
    )
  }
  if (locked) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">
        🔒 Cerrado
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
      ⚽ Próximo
    </span>
  )
}
