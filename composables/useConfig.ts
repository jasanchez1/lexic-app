import { useRuntimeConfig } from '#app'

export const useConfig = () => {
  const config = useRuntimeConfig()
  return config
}
