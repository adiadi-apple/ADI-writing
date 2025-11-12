import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ApiConfig } from '../types'
import { STORAGE_KEYS } from '../config/constants'

const STORAGE_KEY = STORAGE_KEYS.API_CONFIG

export const useAppStore = defineStore('app', () => {
  const apiConfig = ref<ApiConfig | null>(null)
  const isConfigured = computed(() => apiConfig.value !== null)

  const loadConfig = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        apiConfig.value = JSON.parse(stored)
      } catch {
        apiConfig.value = null
      }
    }
  }

  const saveConfig = (config: ApiConfig) => {
    apiConfig.value = config
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  }

  const clearConfig = () => {
    apiConfig.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  const updateApiKey = (apiKey: string) => {
    if (apiConfig.value) {
      apiConfig.value.apiKey = apiKey
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apiConfig.value))
    }
  }

  return {
    apiConfig,
    isConfigured,
    loadConfig,
    saveConfig,
    clearConfig,
    updateApiKey,
  }
})
