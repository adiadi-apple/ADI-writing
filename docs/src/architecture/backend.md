# 后端架构

Vercel Serverless Functions 后端架构设计。

## 函数结构

```
api/
├── hello.ts           # 健康检查
├── complete.ts        # 文本补全
├── expand.ts          # 文本扩展
├── refine.ts          # 文本润色
├── middleware/
│   ├── auth.ts        # 身份验证
│   ├── validate.ts    # 数据验证
│   └── rateLimit.ts   # 速率限制
└── utils/
    ├── openai.ts      # OpenAI 集成
    ├── cache.ts       # 缓存工具
    └── logger.ts      # 日志工具
```

## 请求生命周期

```
请求进入
  ↓
CORS 检查
  ↓
身份认证 (middleware/auth)
  ↓
数据验证 (middleware/validate)
  ↓
速率限制检查 (middleware/rateLimit)
  ↓
缓存查找
  ↓
业务逻辑处理
  ↓
调用 OpenAI API
  ↓
数据处理
  ↓
缓存存储
  ↓
响应返回
```

## 关键服务

### 认证服务

```typescript
// API Key 验证
function verifyApiKey(key: string): boolean {
  // 检查格式
  // 查询数据库
  // 验证权限
}
```

### 速率限制服务

```typescript
// 基于 IP 或用户的速率限制
class RateLimiter {
  checkLimit(identifier: string): boolean
  recordRequest(identifier: string): void
  getRemaining(identifier: string): number
}
```

### 缓存服务

```typescript
// Redis 缓存
class CacheService {
  get(key: string): any
  set(key: string, value: any, ttl: number): void
  del(key: string): void
  clear(): void
}
```

## 错误处理

### 统一错误响应

```typescript
interface ApiResponse<T> {
  success: boolean
  code: number
  message: string
  data?: T
  error?: {
    type: string
    details: string
  }
}
```

### 常见错误代码

- 400: 请求错误
- 401: 未授权
- 403: 禁止访问
- 429: 超过限制
- 500: 服务器错误

## 日志系统

### 日志级别

```typescript
logger.debug('详细信息')    // 开发调试
logger.info('信息')         // 一般信息
logger.warn('警告')         // 潜在问题
logger.error('错误')        // 错误发生
```

### 日志存储

- **开发**: 控制台输出
- **生产**: Vercel Logs + 外部服务 (如 Sentry)

## 性能优化

### 缓存策略

```typescript
// 多层缓存
1. 内存缓存 (极快)
2. Redis 缓存 (快)
3. 数据库查询 (慢)
```

### 并发处理

```typescript
// 使用 Promise.all 并行处理
const [result1, result2] = await Promise.all([
  fetchData1(),
  fetchData2()
])
```

## 环境配置

### 环境变量

```env
NODE_ENV=production
OPENAI_API_KEY=sk-xxx
DATABASE_URL=postgresql://xxx
REDIS_URL=redis://xxx
RATE_LIMIT_WINDOW=60000
```

## 监控告警

### 指标监控

- API 响应时间
- 错误率
- 请求数
- 并发数

### 告警规则

- 错误率 > 1%
- 响应时间 > 1000ms
- 500 错误持续 5 分钟

## 相关文档

- [系统架构](/architecture/index.html)
- [前端架构](/architecture/frontend.html)
- [API 文档](/api/overview.html)
