import { useRuntimeConfig, useFetch } from '#app'
import type { MaybeRefOrGetter } from 'vue'

export const useApi = <T>(url: MaybeRefOrGetter<string>, options?: any) => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBase

  return useFetch<T>(url, {
    baseURL: apiBaseUrl as string,
    ...options,
  })
}
