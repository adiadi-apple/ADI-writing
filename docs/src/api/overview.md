# API 概览

ADI Writer API 的完整文档和使用说明。

## 基础信息

### 基础 URL

- **开发环境**: `http://localhost:3001`
- **生产环境**: `https://your-app.vercel.app`

### 认证

所有 API 请求都需要在请求头中包含认证令牌：

```http
Authorization: Bearer YOUR_API_KEY
X-API-Key: YOUR_API_KEY
```

### 请求格式

所有请求应使用 JSON 格式：

```http
Content-Type: application/json
Accept: application/json
```

## 响应格式

### 成功响应 (2xx)

```json
{
  "success": true,
  "code": 200,
  "message": "Operation successful",
  "data": {
    "id": "123",
    "name": "Example"
  }
}
```

### 错误响应 (4xx, 5xx)

```json
{
  "success": false,
  "code": 400,
  "message": "Bad Request",
  "error": {
    "type": "ValidationError",
    "details": "Invalid input parameter"
  }
}
```

## 端点分类

### 文本处理

- `POST /api/complete` - 文本补全
- `POST /api/expand` - 文本扩展
- `POST /api/refine` - 文本润色
- `POST /api/summarize` - 文本总结

### 内容生成

- `POST /api/generate-story` - 生成故事
- `POST /api/generate-poetry` - 生成诗词
- `POST /api/generate-copy` - 生成文案

### 用户管理

- `GET /api/user/profile` - 获取用户信息
- `PUT /api/user/profile` - 更新用户信息
- `POST /api/user/logout` - 用户登出

## 请求示例

### 文本补全

```bash
curl -X POST https://your-app.vercel.app/api/complete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "text": "明月几时有，",
    "model": "gpt-3.5-turbo"
  }'
```

### 文本扩展

```bash
curl -X POST https://your-app.vercel.app/api/expand \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "text": "小时不识月，呼作白玉盘。",
    "length": "long"
  }'
```

## 速率限制

- **免费用户**: 60 请求/分钟
- **付费用户**: 600 请求/分钟

查看 [速率限制文档](/api/rate-limiting.html) 了解更多。

## 状态码

| 代码 | 说明 |
|------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 204 | 无内容 |
| 400 | 请求错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 未找到 |
| 429 | 超过速率限制 |
| 500 | 服务器错误 |

## SDK 和库

### JavaScript/TypeScript

```typescript
import { AdiWriterAPI } from 'adi-writer-sdk'

const client = new AdiWriterAPI({
  apiKey: 'your-api-key'
})

const response = await client.complete({
  text: '明月几时有，',
  model: 'gpt-3.5-turbo'
})
```

### Python

```python
from adi_writer import Client

client = Client(api_key='your-api-key')

response = client.complete(
    text='明月几时有，',
    model='gpt-3.5-turbo'
)
```

## 最佳实践

✅ **推荐做法**:
- 使用 HTTPS
- 在请求头中传递 API 密钥
- 实现重试逻辑
- 缓存响应数据

❌ **避免做法**:
- 在 URL 中传递 API 密钥
- 在客户端存储 API 密钥
- 忽略速率限制
- 没有错误处理

## 相关文档

- [端点列表](/api/endpoints.html)
- [错误处理](/api/errors.html)
- [速率限制](/api/rate-limiting.html)
