export function calculateYearsOfExperience(startDate: Date): string {
  const startYear = startDate.getFullYear()
  const currentYear = new Date().getFullYear()
  const years = currentYear - startYear

  return years === 1 ? '1 año' : `${years} años`
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)

  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre'
  ]

  const month = months[date.getMonth()]
  const year = date.getFullYear()

  return `${month} ${year}`
}
