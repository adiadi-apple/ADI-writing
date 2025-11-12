import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

interface ModelInfo {
  name: string
  displayName: string
  description: string
  version: string
  inputTokenLimit: number
  outputTokenLimit: number
  supportedGenerationMethods: string[]
}

interface ListModelsResponse {
  models: ModelInfo[]
  timestamp: number
}

interface ErrorResponse {
  error: string
  message: string
  code?: string
}

async function listGeminiModels(apiKey: string): Promise<ModelInfo[]> {
  try {
    // Try v1beta first (has more models), fall back to v1
    let response
    try {
      response = await axios.get(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      )
    } catch (error) {
      // Fall back to v1 if v1beta is not available
      response = await axios.get(
        `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      )
    }

    const models = response.data.models || []
    return models.map((model: any) => ({
      name: model.name,
      displayName: model.displayName,
      description: model.description,
      version: model.version,
      inputTokenLimit: model.inputTokenLimit,
      outputTokenLimit: model.outputTokenLimit,
      supportedGenerationMethods: model.supportedGenerationMethods || [],
    }))
  } catch (error) {
    throw new Error(`Failed to list Gemini models: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export default async (req: VercelRequest, res: VercelResponse) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only GET requests are allowed',
    } as ErrorResponse)
  }

  try {
    const apiKey = req.query.apiKey as string

    if (!apiKey || apiKey.trim().length === 0) {
      // Try to get from environment variable
      const envKey = process.env.GEMINI_API_KEY
      if (!envKey) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'API key is required. Provide it as query parameter ?apiKey=xxx or configure GEMINI_API_KEY in environment variables.',
          code: 'MISSING_API_KEY',
        } as ErrorResponse)
      }

      const models = await listGeminiModels(envKey)
      return res.status(200).json({
        models: models.filter(m => m.supportedGenerationMethods.includes('generateContent')),
        timestamp: Date.now(),
      } as ListModelsResponse)
    }

    const models = await listGeminiModels(apiKey)

    // Filter to only models that support generateContent
    const supportedModels = models.filter(m => m.supportedGenerationMethods.includes('generateContent'))

    return res.status(200).json({
      models: supportedModels,
      timestamp: Date.now(),
    } as ListModelsResponse)
  } catch (error) {
    console.error('List Models Error:', error)

    let statusCode = 500
    let errorMessage = 'Internal server error'
    let errorCode = 'INTERNAL_ERROR'

    if (error instanceof axios.AxiosError) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        statusCode = 401
        errorMessage = 'Invalid API key or unauthorized'
        errorCode = 'AUTH_ERROR'
      } else if (error.response?.status === 429) {
        statusCode = 429
        errorMessage = 'Rate limit exceeded'
        errorCode = 'RATE_LIMIT'
      } else if (error.code === 'ECONNABORTED') {
        statusCode = 504
        errorMessage = 'Request timeout'
        errorCode = 'TIMEOUT'
      } else {
        errorMessage = error.response?.data?.error?.message || error.message || 'API error'
      }
    } else if (error instanceof Error) {
      errorMessage = error.message
    }

    return res.status(statusCode).json({
      error: errorCode,
      message: errorMessage,
    } as ErrorResponse)
  }
}
