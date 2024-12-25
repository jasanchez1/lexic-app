export function calculateYearsOfExperience(startDate: Date): string {
  const ageDifMs = Date.now() - startDate.getTime()
  const ageDate = new Date(ageDifMs)
  const yearsOfXP = Math.abs(ageDate.getUTCFullYear() - 1970)
  return `${yearsOfXP} ${yearsOfXP === 1 ? 'año' : 'años'}`
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
