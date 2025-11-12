import axios from 'axios'
import type { AIRequest, AIResponse } from '../types'

// Determine the API base URL based on environment
const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    // Server-side
    return process.env.VITE_API_URL || 'http://localhost:3000'
  }

  // Client-side
  if (process.env.VITE_API_URL) {
    return process.env.VITE_API_URL
  }

  // Default to current domain's API
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5173'
  }

  // Use current domain for production
  return window.location.origin
}

class AIApiService {
  private apiBaseUrl: string = getApiBaseUrl()

  async processContent(request: AIRequest): Promise<AIResponse> {
    try {
      // Use backend API instead of direct API calls
      const backendUrl = `${this.apiBaseUrl}/api/process`

      const response = await axios.post(
        backendUrl,
        {
          provider: request.provider,
          content: request.content,
          mode: request.mode,
          apiKey: request.apiKey,
          customEndpoint: request.customEndpoint,
          customModel: request.customModel,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 60000, // 60 second timeout
        }
      )

      return {
        result: response.data.result,
        provider: response.data.provider,
        timestamp: response.data.timestamp,
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const data = error.response?.data

        let errorMessage = 'API 请求失败'

        if (status === 401 || status === 403) {
          errorMessage = data?.message || 'API 密钥无效或未授权'
        } else if (status === 429) {
          errorMessage = 'API 请求过于频繁，请稍后再试'
        } else if (status === 400) {
          errorMessage = data?.message || '请求参数无效'
        } else if (status === 504 || error.code === 'ECONNABORTED') {
          errorMessage = '请求超时，请检查网络连接'
        } else if (status === 503) {
          errorMessage = 'AI 服务暂时不可用，请稍后再试'
        } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
          errorMessage = '无法连接到 API 服务'
        } else {
          errorMessage = data?.message || error.message || '处理失败'
        }

        throw new Error(errorMessage)
      }

      throw new Error(error instanceof Error ? error.message : '未知错误')
    }
  }

  async getProviders() {
    try {
      const backendUrl = `${this.apiBaseUrl}/api/providers`

      const response = await axios.get(backendUrl, {
        timeout: 10000,
      })

      return response.data.providers
    } catch (error) {
      console.error('Failed to fetch providers:', error)
      // Return default providers if backend is not available
      return [
        {
          id: 'openai',
          name: 'OpenAI',
          description: 'GPT-4o Mini',
          url: 'https://platform.openai.com/api-keys',
          status: 'active',
        },
        {
          id: 'gemini',
          name: 'Google Gemini',
          description: 'Gemini 1.5 Flash',
          url: 'https://aistudio.google.com/app/apikey',
          status: 'active',
        },
        {
          id: 'deepseek',
          name: 'DeepSeek',
          description: 'DeepSeek Chat',
          url: 'https://platform.deepseek.com/api',
          status: 'active',
        },
        {
          id: 'thirdparty',
          name: 'Custom Service',
          description: 'Use your own API service or third-party provider',
          url: '#',
          status: 'active',
        },
      ]
    }
  }

  async listGeminiModels(apiKey: string) {
    try {
      const backendUrl = `${this.apiBaseUrl}/api/list-models`

      const response = await axios.get(backendUrl, {
        params: { apiKey },
        timeout: 30000,
      })

      return response.data.models || []
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data
        console.error('Failed to list Gemini models:', data?.message || error.message)
        throw new Error(data?.message || 'Failed to list available Gemini models')
      }
      throw error instanceof Error ? error : new Error('Failed to list models')
    }
  }

  setApiBaseUrl(url: string): void {
    this.apiBaseUrl = url
  }
}

export const aiApiService = new AIApiService()
