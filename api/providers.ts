import type { VercelRequest, VercelResponse } from '@vercel/node'

interface ProviderInfo {
  id: string
  name: string
  description: string
  url: string
  icon: string
  status: string
}

export default (req: VercelRequest, res: VercelResponse) => {
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
    })
  }

  const providers: ProviderInfo[] = [
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'GPT-4o Mini - State-of-the-art language model',
      url: 'https://platform.openai.com/api-keys',
      icon: '🔐',
      status: 'active',
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      description: 'Gemini 1.5 Flash - Powerful multimodal model',
      url: 'https://aistudio.google.com/app/apikey',
      icon: '🌐',
      status: 'active',
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      description: 'DeepSeek Chat - Advanced reasoning model',
      url: 'https://platform.deepseek.com/api',
      icon: '🚀',
      status: 'active',
    },
    {
      id: 'thirdparty',
      name: 'Custom Service',
      description: 'Use your own API service or third-party provider',
      url: '#',
      icon: '⚙️',
      status: 'active',
    },
  ]

  res.status(200).json({
    providers,
    timestamp: new Date().toISOString(),
  })
}
