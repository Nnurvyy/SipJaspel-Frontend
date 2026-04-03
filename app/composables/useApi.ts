import { useRuntimeConfig } from '#app'

export const useApi = <T>(url: string, options?: any) => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBase

  return useFetch<T>(url, {
    baseURL: apiBaseUrl as string,
    ...options,
  })
}
