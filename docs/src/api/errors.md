# 错误处理

API 错误代码和处理方法。

## 错误响应格式

所有错误响应遵循统一的格式：

```json
{
  "success": false,
  "code": 400,
  "message": "错误信息",
  "error": {
    "type": "ErrorType",
    "details": "详细错误信息"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_abc123"
}
```

## 错误代码列表

### 4xx 客户端错误

#### 400 Bad Request (请求错误)

**原因**:
- 缺少必需参数
- 参数格式不正确
- 请求体非法

**示例**:
```json
{
  "success": false,
  "code": 400,
  "message": "Bad Request",
  "error": {
    "type": "ValidationError",
    "details": "Missing required parameter: text"
  }
}
```

**解决方案**:
```javascript
// ❌ 错误
const response = await fetch('/api/complete', {
  method: 'POST',
  body: JSON.stringify({
    // 缺少 text 参数
  })
})

// ✅ 正确
const response = await fetch('/api/complete', {
  method: 'POST',
  body: JSON.stringify({
    text: '明月几时有，',  // 包含必需参数
    model: 'gpt-3.5-turbo'
  })
})
```

#### 401 Unauthorized (未授权)

**原因**:
- API 密钥缺失
- API 密钥无效
- API 密钥已过期

**示例**:
```json
{
  "success": false,
  "code": 401,
  "message": "Unauthorized",
  "error": {
    "type": "AuthenticationError",
    "details": "Invalid or missing API key"
  }
}
```

**解决方案**:
```javascript
// ✅ 添加授权头
const response = await fetch('/api/complete', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_VALID_API_KEY'
  }
})
```

#### 403 Forbidden (禁止访问)

**原因**:
- 账户被禁用
- 权限不足
- API 密钥权限限制

**示例**:
```json
{
  "success": false,
  "code": 403,
  "message": "Forbidden",
  "error": {
    "type": "PermissionError",
    "details": "Your account does not have access to this resource"
  }
}
```

#### 404 Not Found (未找到)

**原因**:
- 端点不存在
- 资源不存在
- URL 拼写错误

**示例**:
```json
{
  "success": false,
  "code": 404,
  "message": "Not Found",
  "error": {
    "type": "NotFoundError",
    "details": "Endpoint /api/invalid does not exist"
  }
}
```

**解决方案**:
```javascript
// ✅ 使用正确的端点
const response = await fetch('/api/complete', {
  method: 'POST'
})

// ❌ 拼写错误
const response = await fetch('/api/complet', {  // 少了 e
  method: 'POST'
})
```

#### 429 Too Many Requests (请求过多)

**原因**:
- 超过速率限制
- 请求频率过高

**示例**:
```json
{
  "success": false,
  "code": 429,
  "message": "Too Many Requests",
  "error": {
    "type": "RateLimitError",
    "details": "Rate limit exceeded. Retry after 60 seconds"
  },
  "retryAfter": 60
}
```

**解决方案**:
```javascript
// 实现重试逻辑
async function makeRequestWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options)
    
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After') || 60
      console.log(`Rate limited. Waiting ${retryAfter} seconds...`)
      await sleep(retryAfter * 1000)
      continue
    }
    
    return response
  }
}
```

### 5xx 服务器错误

#### 500 Internal Server Error (内部服务器错误)

**原因**:
- 服务器异常
- 数据库连接错误
- 未预期的服务器错误

**示例**:
```json
{
  "success": false,
  "code": 500,
  "message": "Internal Server Error",
  "error": {
    "type": "ServerError",
    "details": "An unexpected error occurred"
  }
}
```

**解决方案**:
1. 等待 30-60 秒后重试
2. 查看 Vercel 日志
3. 联系技术支持

#### 503 Service Unavailable (服务不可用)

**原因**:
- 服务器维护中
- 临时性服务中断
- 过载

**示例**:
```json
{
  "success": false,
  "code": 503,
  "message": "Service Unavailable",
  "error": {
    "type": "ServiceUnavailableError",
    "details": "Service is temporarily unavailable"
  }
}
```

## 常见错误及解决方案

### 缺少必需参数

```javascript
// ❌ 错误
const response = await fetch('/api/complete', {
  method: 'POST',
  body: JSON.stringify({})
})

// ✅ 正确
const response = await fetch('/api/complete', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    text: '明月几时有，',
    model: 'gpt-3.5-turbo'
  })
})
```

### 参数类型错误

```javascript
// ❌ 错误
const response = await fetch('/api/complete', {
  method: 'POST',
  body: JSON.stringify({
    text: 123,  // 应该是字符串
    maxTokens: '500'  // 应该是数字
  })
})

// ✅ 正确
const response = await fetch('/api/complete', {
  method: 'POST',
  body: JSON.stringify({
    text: '明月几时有，',  // 字符串
    maxTokens: 500  // 数字
  })
})
```

### CORS 错误

**问题**: `Access to XMLHttpRequest at 'https://...' from origin 'http://localhost:3000' has been blocked by CORS policy`

**解决方案**:
1. 在服务器端配置 CORS:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*')
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
```

2. 或在请求时使用代理

## 错误处理最佳实践

### 客户端错误处理

```typescript
async function callAPI(endpoint: string, data: any) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message)
    }

    return await response.json()
  } catch (error) {
    // 处理错误
    console.error('API Error:', error)
    throw error
  }
}
```

### 重试逻辑

```typescript
async function callWithRetry(
  endpoint: string,
  data: any,
  maxRetries = 3
): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await callAPI(endpoint, data)
    } catch (error: any) {
      if (attempt === maxRetries) throw error
      
      const delay = Math.pow(2, attempt) * 1000  // 指数退避
      console.log(`Retry attempt ${attempt}/${maxRetries} after ${delay}ms`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}
```

## 监控和日志

### 记录错误

```typescript
function logError(error: any) {
  console.error({
    timestamp: new Date().toISOString(),
    type: error.type,
    message: error.message,
    details: error.details,
    requestId: error.requestId,
    stack: error.stack
  })
}
```

## 相关文档

- [API 概览](/api/overview.html)
- [端点列表](/api/endpoints.html)
- [速率限制](/api/rate-limiting.html)
