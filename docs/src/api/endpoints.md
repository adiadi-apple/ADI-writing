# API 端点列表

所有可用的 API 端点的详细文档。

## 文本补全

### POST /api/complete

执行文本补全操作。

**请求体**:
```json
{
  "text": "string (必需) - 要补全的文本",
  "model": "string (可选) - 使用的模型，默认: gpt-3.5-turbo",
  "maxTokens": "number (可选) - 最大生成令牌数，默认: 500",
  "temperature": "number (可选) - 温度参数 (0-2)，默认: 0.7"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "comp_123",
    "originalText": "明月几时有，",
    "completedText": "明月几时有，把酒问青天。",
    "usage": {
      "promptTokens": 10,
      "completionTokens": 15,
      "totalTokens": 25
    }
  }
}
```

**示例代码**:
```javascript
const response = await fetch('/api/complete', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    text: '明月几时有，',
    model: 'gpt-3.5-turbo',
    maxTokens: 500
  })
})

const data = await response.json()
console.log(data.data.completedText)
```

## 文本扩展

### POST /api/expand

扩展文本内容。

**请求体**:
```json
{
  "text": "string (必需) - 要扩展的文本",
  "length": "short | medium | long (可选) - 扩展长度，默认: medium",
  "style": "string (可选) - 风格，如: poetic, narrative, descriptive"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "exp_456",
    "originalText": "明月几时有。",
    "expandedText": "...",
    "expandRatio": 2.5
  }
}
```

## 文本润色

### POST /api/refine

润色和改进文本。

**请求体**:
```json
{
  "text": "string (必需) - 要润色的文本",
  "target": "string (可选) - 目标, 如: formal, casual, poetic",
  "focus": "array (可选) - 重点改进方面，如: grammar, tone, clarity"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "ref_789",
    "originalText": "这个东西很好用",
    "refinedText": "该产品使用便利，性能卓越。",
    "improvements": {
      "grammar": 1,
      "tone": 1,
      "clarity": 2
    }
  }
}
```

## 文本总结

### POST /api/summarize

生成文本摘要。

**请求体**:
```json
{
  "text": "string (必需) - 要总结的文本",
  "ratio": "number (可选) - 压缩比例 (0-1)，默认: 0.3",
  "style": "string (可选) - 摘要风格: bullet, paragraph, abstract"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "sum_012",
    "originalLength": 1500,
    "summaryLength": 450,
    "summary": "..."
  }
}
```

## 故事生成

### POST /api/generate-story

生成创意故事。

**请求体**:
```json
{
  "prompt": "string (必需) - 故事提示",
  "genre": "string (可选) - 类型: fantasy, sci-fi, romance, thriller",
  "length": "short | medium | long (可选) - 长度，默认: medium",
  "tone": "string (可选) - 语调: humorous, serious, mysterious"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "story_345",
    "prompt": "一个关于冒险的故事",
    "story": "...",
    "wordCount": 1200,
    "genre": "fantasy"
  }
}
```

## 诗词生成

### POST /api/generate-poetry

生成诗词。

**请求体**:
```json
{
  "theme": "string (必需) - 主题",
  "form": "string (可选) - 形式: ci, fu, jueju, lushi",
  "style": "string (可选) - 风格: classical, modern",
  "rhyme": "string (可选) - 韵脚"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "poetry_678",
    "theme": "月亮",
    "form": "jueju",
    "poetry": "...",
    "explanation": "..."
  }
}
```

## 文案生成

### POST /api/generate-copy

生成营销文案。

**请求体**:
```json
{
  "product": "string (必需) - 产品名称或描述",
  "target": "string (可选) - 目标受众",
  "type": "string (可选) - 文案类型: headline, description, testimonial",
  "tone": "string (可选) - 语调: professional, casual, playful"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "copy_901",
    "product": "AI Writer",
    "copies": [
      "AI驱动的创意写作助手",
      "让您的想象无限延伸"
    ]
  }
}
```

## 用户管理

### GET /api/user/profile

获取用户信息。

**请求头**:
```
Authorization: Bearer YOUR_API_KEY
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "User Name",
    "plan": "pro",
    "apiUsage": {
      "thisMonth": 5000,
      "limit": 100000
    }
  }
}
```

### PUT /api/user/profile

更新用户信息。

**请求体**:
```json
{
  "name": "string (可选)",
  "email": "string (可选)",
  "preferences": {
    "theme": "light | dark",
    "language": "zh-CN | en-US"
  }
}
```

### POST /api/user/logout

用户登出。

## 健康检查

### GET /api/health

检查 API 服务状态。

**响应示例**:
```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0"
}
```

## 相关文档

- [API 概览](/api/overview.html)
- [错误处理](/api/errors.html)
- [速率限制](/api/rate-limiting.html)
