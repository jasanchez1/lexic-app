export function calculateYearsOfExperience(startDate: Date): string {
  const ageDifMs = Date.now() - startDate.getTime()
  const ageDate = new Date(ageDifMs)
  const yearsOfXP = Math.abs(ageDate.getUTCFullYear() - 1970)
  return `${yearsOfXP} ${yearsOfXP === 1 ? 'año' : 'años'}`
}
