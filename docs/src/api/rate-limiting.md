# 速率限制

API 速率限制政策和处理方法。

## 速率限制规则

### 免费用户

- **请求限制**: 60 请求/分钟
- **令牌限制**: 50,000 令牌/天
- **并发请求**: 5

### 付费用户 (Pro)

- **请求限制**: 600 请求/分钟
- **令牌限制**: 500,000 令牌/天
- **并发请求**: 50

### 企业用户

- **请求限制**: 自定义
- **令牌限制**: 自定义
- **并发请求**: 自定义

## 检查限制状态

每个响应都包含限制相关的响应头：

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1705318800
X-RateLimit-Used: 15
```

| 响应头 | 说明 |
|--------|------|
| `X-RateLimit-Limit` | 时间窗口内的请求限制 |
| `X-RateLimit-Remaining` | 剩余请求数 |
| `X-RateLimit-Reset` | 限制重置的 Unix 时间戳 |
| `X-RateLimit-Used` | 已使用的请求数 |

## 超过限制

当超过速率限制时，API 返回 429 状态码：

```json
{
  "success": false,
  "code": 429,
  "message": "Too Many Requests",
  "error": {
    "type": "RateLimitError",
    "details": "Rate limit exceeded"
  },
  "retryAfter": 60
}
```

## 处理速率限制

### 检查限制状态

```typescript
async function checkRateLimit(response: Response) {
  const limit = parseInt(response.headers.get('X-RateLimit-Limit') || '0')
  const remaining = parseInt(response.headers.get('X-RateLimit-Remaining') || '0')
  const reset = parseInt(response.headers.get('X-RateLimit-Reset') || '0')

  console.log(`Requests: ${remaining}/${limit}`)
  console.log(`Reset at: ${new Date(reset * 1000).toISOString()}`)

  if (remaining < 10) {
    console.warn('Warning: Approaching rate limit')
  }
}
```

### 实现指数退避

```typescript
async function callWithExponentialBackoff(
  endpoint: string,
  data: any,
  maxAttempts = 5
): Promise<any> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(data)
      })

      if (response.status === 429) {
        const retryAfter = parseInt(
          response.headers.get('Retry-After') || 
          response.headers.get('X-RateLimit-Reset') || 
          '60'
        )
        
        const delay = retryAfter * 1000
        console.log(`Rate limited. Waiting ${delay}ms before retry...`)
        
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }

      return await response.json()
    } catch (error) {
      if (attempt === maxAttempts) throw error
      
      const delay = Math.pow(2, attempt) * 1000
      console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}
```

### 批量请求

```typescript
async function batchRequests(
  requests: any[],
  concurrency = 5,
  delayMs = 500
): Promise<any[]> {
  const results: any[] = []
  
  for (let i = 0; i < requests.length; i += concurrency) {
    const batch = requests.slice(i, i + concurrency)
    
    const batchResults = await Promise.all(
      batch.map(req => callAPI('/api/complete', req))
    )
    
    results.push(...batchResults)
    
    // 批次之间延迟
    if (i + concurrency < requests.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }
  
  return results
}
```

## 优化请求

### 1. 批量处理

```typescript
// ❌ 低效 - 60 个单独请求
for (const text of texts) {
  await fetch('/api/complete', { body: JSON.stringify({ text }) })
}

// ✅ 高效 - 批量请求
await batchRequests(
  texts.map(text => ({ text })),
  concurrency = 10,
  delayMs = 1000
)
```

### 2. 缓存结果

```typescript
const cache = new Map<string, any>()

async function getCompletion(text: string): Promise<any> {
  if (cache.has(text)) {
    return cache.get(text)
  }

  const result = await fetch('/api/complete', {
    body: JSON.stringify({ text })
  })

  cache.set(text, result)
  return result
}
```

### 3. 预聚合数据

```typescript
// ❌ 低效 - 多个小请求
for (const item of items) {
  await processItem(item)
}

// ✅ 高效 - 一个大请求
await processBatch(items)
```

## 升级计划

要提高限制，可以升级您的计划：

### 免费计划

- 60 请求/分钟
- 50,000 令牌/天
- 基础支持

### Pro 计划

- 600 请求/分钟 (+1000%)
- 500,000 令牌/天 (+1000%)
- 优先支持

### 企业计划

- 无限制
- 专业支持
- 自定义集成

**升级**: 访问 [账户设置](/user/settings.html) 选择计划

## 限制的恢复

### 分钟限制

每个整分钟重置一次：

```
00:00 - 00:59: 60 请求
01:00 - 01:59: 60 请求 (新窗口)
```

### 每日限制

每天午夜 UTC 重置：

```
2024-01-15 00:00:00 - 23:59:59: 50,000 令牌
2024-01-16 00:00:00 - 23:59:59: 50,000 令牌 (新窗口)
```

## 最佳实践

✅ **推荐做法**:
1. **监控限制** - 定期检查 `X-RateLimit-Remaining`
2. **实现重试** - 使用指数退避策略
3. **批量处理** - 合并多个请求
4. **缓存结果** - 避免重复请求
5. **异步处理** - 使用消息队列处理批量请求

❌ **避免做法**:
1. **忽略限制** - 不检查 `Retry-After`
2. **无限重试** - 无延迟的立即重试
3. **单个请求** - 逐个处理大量请求
4. **重复查询** - 相同的查询多次请求
5. **阻塞等待** - 同步等待限制重置

## 错误处理

```typescript
async function handleRateLimit(response: Response) {
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After')
    const resetTime = response.headers.get('X-RateLimit-Reset')
    
    // 显示用户友好的错误信息
    const waitTime = Math.ceil(
      (parseInt(resetTime) * 1000 - Date.now()) / 1000
    )
    
    console.error(
      `Rate limit exceeded. Please wait ${waitTime} seconds.`
    )
    
    // 自动重试
    return new Promise((resolve) => {
      setTimeout(() => {
        // 重新调用原请求
        resolve(fetch(/* ... */))
      }, parseInt(retryAfter) * 1000)
    })
  }
}
```

## 监控和告警

### 设置告警

```typescript
const ALERT_THRESHOLD = 10  // 剩余请求数阈值

async function monitorRateLimit() {
  const response = await fetch('/api/health')
  const remaining = parseInt(
    response.headers.get('X-RateLimit-Remaining') || '0'
  )

  if (remaining < ALERT_THRESHOLD) {
    sendAlert(`Rate limit critical: ${remaining} requests remaining`)
  }
}
```

## 相关文档

- [API 概览](/api/overview.html)
- [错误处理](/api/errors.html)
- [端点列表](/api/endpoints.html)
