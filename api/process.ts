import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

interface ProcessRequest {
  provider: 'openai' | 'gemini' | 'deepseek' | 'thirdparty'
  content: string
  mode: 'expand' | 'polish'
  apiKey?: string
  customEndpoint?: string
  customModel?: string
}

interface ProcessResponse {
  result: string
  provider: string
  timestamp: number
}

interface ErrorResponse {
  error: string
  message: string
  code?: string
}

const SYSTEM_PROMPT = `你和用户一起结对写作来解决他们的问题。你是一位世界一流的专业AI作家助手。
你的任务是根据用户输入的消息，回答用户的问题。

范围限制：
1. 拒绝所有非文学相关问题
2. 避免任何政治内容和极端露骨的情色描写
3. 必须虚构所有国家、地名、机构名称等

输出要求：
1. 禁止一切与推动剧情无关的描述
2. 每一句的长度不宜过长
3. 禁止使用过度修饰的词汇
4. 绝不编造信息
5. 正文输出的结尾不要有展望总结式语句，留下悬念即可`

const EXPAND_MODE_PROMPT = `请对以下内容进行扩写。要求：
1. 增加细节描写和心理活动
2. 丰富对话和人物互动
3. 补充场景描写
4. 字数增加50%以上
5. 保持原意不变`

const POLISH_MODE_PROMPT = `请对以下内容进行润色。要求：
1. 改进表达方式
2. 增强可读性
3. 修正语法错误
4. 优化措辞
5. 保持字数基本不变`

async function callOpenAI(
  apiKey: string,
  content: string,
  mode: 'expand' | 'polish'
): Promise<string> {
  const modePrompt = mode === 'expand' ? EXPAND_MODE_PROMPT : POLISH_MODE_PROMPT

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `${modePrompt}\n\n内容：\n${content}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  )

  return response.data.choices[0].message.content
}

async function callGemini(
  apiKey: string,
  content: string,
  mode: 'expand' | 'polish'
): Promise<string> {
  const modePrompt = mode === 'expand' ? EXPAND_MODE_PROMPT : POLISH_MODE_PROMPT

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      contents: [
        {
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\n${modePrompt}\n\n内容：\n${content}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  )

  const candidates = response.data.candidates
  if (candidates && candidates.length > 0) {
    const resultContent = candidates[0].content.parts[0].text
    return resultContent
  }
  throw new Error('No content in response')
}

async function callDeepSeek(
  apiKey: string,
  content: string,
  mode: 'expand' | 'polish'
): Promise<string> {
  const modePrompt = mode === 'expand' ? EXPAND_MODE_PROMPT : POLISH_MODE_PROMPT

  const response = await axios.post(
    'https://api.deepseek.com/chat/completions',
    {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `${modePrompt}\n\n内容：\n${content}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  )

  return response.data.choices[0].message.content
}

async function callThirdParty(
  apiKey: string,
  content: string,
  mode: 'expand' | 'polish',
  customEndpoint: string,
  customModel: string
): Promise<string> {
  const modePrompt = mode === 'expand' ? EXPAND_MODE_PROMPT : POLISH_MODE_PROMPT

  const response = await axios.post(
    customEndpoint,
    {
      model: customModel,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `${modePrompt}\n\n内容：\n${content}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  )

  return response.data.choices[0].message.content
}

async function processContent(
  provider: string,
  apiKey: string,
  content: string,
  mode: string,
  customEndpoint?: string,
  customModel?: string
): Promise<string> {
  switch (provider) {
    case 'openai':
      return await callOpenAI(apiKey, content, mode as 'expand' | 'polish')
    case 'gemini':
      return await callGemini(apiKey, content, mode as 'expand' | 'polish')
    case 'deepseek':
      return await callDeepSeek(apiKey, content, mode as 'expand' | 'polish')
    case 'thirdparty':
      if (!customEndpoint || !customModel) {
        throw new Error('Custom endpoint and model are required for third-party provider')
      }
      return await callThirdParty(apiKey, content, mode as 'expand' | 'polish', customEndpoint, customModel)
    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }
}

export default async (req: VercelRequest, res: VercelResponse) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST requests are allowed',
    } as ErrorResponse)
  }

  try {
    const { provider, content, mode, apiKey, customEndpoint, customModel } = req.body as ProcessRequest

    // Validation
    if (!provider || !content || !mode) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'provider, content, and mode are required',
      } as ErrorResponse)
    }

    if (!['openai', 'gemini', 'deepseek', 'thirdparty'].includes(provider)) {
      return res.status(400).json({
        error: 'Invalid provider',
        message: `Provider must be one of: openai, gemini, deepseek, thirdparty`,
        code: 'INVALID_PROVIDER',
      } as ErrorResponse)
    }

    if (provider === 'thirdparty' && (!customEndpoint || !customModel)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'customEndpoint and customModel are required for thirdparty provider',
        code: 'INVALID_REQUEST',
      } as ErrorResponse)
    }

    if (!['expand', 'polish'].includes(mode)) {
      return res.status(400).json({
        error: 'Invalid mode',
        message: `Mode must be one of: expand, polish`,
        code: 'INVALID_MODE',
      } as ErrorResponse)
    }

    if (content.trim().length === 0) {
      return res.status(400).json({
        error: 'Empty content',
        message: 'Content cannot be empty',
        code: 'EMPTY_CONTENT',
      } as ErrorResponse)
    }

    // Try to get API key from request or environment variables
    let finalApiKey = apiKey?.trim() || ''

    // If no API key in request, try environment variables
    if (!finalApiKey) {
      switch (provider) {
        case 'openai':
          finalApiKey = process.env.OPENAI_API_KEY || ''
          break
        case 'gemini':
          finalApiKey = process.env.GEMINI_API_KEY || ''
          break
        case 'deepseek':
          finalApiKey = process.env.DEEPSEEK_API_KEY || ''
          break
      }
    }

    if (!finalApiKey) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: `API key for ${provider} is required. Provide it in request or configure it in Vercel environment variables.`,
        code: 'MISSING_API_KEY',
      } as ErrorResponse)
    }

    // Process content
    const result = await processContent(provider, finalApiKey, content, mode, customEndpoint, customModel)

    return res.status(200).json({
      result,
      provider,
      timestamp: Date.now(),
    } as ProcessResponse)
  } catch (error) {
    console.error('API Error:', error)

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
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        statusCode = 503
        errorMessage = 'Service unavailable'
        errorCode = 'SERVICE_UNAVAILABLE'
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
