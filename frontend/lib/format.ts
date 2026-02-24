export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "-"
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    // Try parsing "DD/MM/YYYY" format
    const parts = dateStr.split("/")
    if (parts.length === 3) {
      const parsed = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
      if (!isNaN(parsed.getTime())) {
        return new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(parsed)
      }
    }
    return dateStr
  }
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return "-"
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    return dateStr
  }
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export const MESES = [
  "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]
