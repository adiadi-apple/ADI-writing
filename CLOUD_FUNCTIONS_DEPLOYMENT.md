# 云函数部署指南

本文档详细说明如何在 Vercel 上部署 H5 AI Writer 的云函数（Serverless Functions），包括一键部署、配置、测试和常见问题。

## 📋 目录

1. [快速开始](#快速开始)
2. [云函数架构](#云函数架构)
3. [部署方式](#部署方式)
4. [环境变量配置](#环境变量配置)
5. [API 文档](#api-文档)
6. [本地测试](#本地测试)
7. [生产部署](#生产部署)
8. [监控和调试](#监控和调试)
9. [常见问题](#常见问题)
10. [性能优化](#性能优化)

---

## 快速开始

### 最简单的方式：一键部署（无需API密钥）

1. **点击部署按钮**

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fh5-ai-writer&env=OPENAI_API_KEY,GEMINI_API_KEY,DEEPSEEK_API_KEY&envDescription=AI%20API%20Keys&envLink=https://h5-ai-writer.vercel.app)

2. **授权 Vercel 访问 GitHub**

3. **跳过环境变量配置**（可选）
   - 部署可以在没有 API 密钥的情况下完成
   - 用户稍后可以在前端输入 API 密钥
   - 或者在 Vercel 仪表板中添加环境变量

4. **点击部署**

5. **等待完成**（通常 2-5 分钟）

6. **获得您的应用 URL** - 立即开始使用！

### 后续添加 API 密钥

如果部署后想添加 API 密钥到服务器环境变量：

1. 进入 Vercel 项目仪表板
2. Settings → Environment Variables
3. 添加以下变量（可选）：
   - `OPENAI_API_KEY`
   - `GEMINI_API_KEY`
   - `DEEPSEEK_API_KEY`
4. Redeploy 项目

---

## 云函数架构

### 目录结构

```
api/
├── process.ts       # 主处理函数：处理 AI 内容扩写和润色
├── health.ts        # 健康检查函数：验证服务状态
└── providers.ts     # 提供商信息函数：获取支持的 AI 提供商列表
```

### 函数职责

| 函数 | 路由 | 方法 | 功能 |
|------|------|------|------|
| `process.ts` | `/api/process` | POST | 处理文本内容（扩写/润色） |
| `health.ts` | `/api/health` | GET | 服务健康检查 |
| `providers.ts` | `/api/providers` | GET | 获取可用的 AI 提供商 |

### 工作流程

```
用户请求
    ↓
Vercel Edge（路由）
    ↓
Serverless Function
    ├── 验证请求
    ├── 获取 API 密钥（请求/环境变量）
    ├── 调用 AI API
    └── 返回结果
    ↓
用户接收响应
```

---

## 部署方式

### 方式 1：Vercel GUI（推荐）

**最简单，无需命令行**

```
1. 访问 https://vercel.com/new
2. 点击 "Import Git Repository"
3. 输入仓库 URL
4. 点击 Import
5. （可选）配置环境变量
6. 点击 Deploy
```

**优点：**
- ✅ 图形化界面，易于操作
- ✅ 无需本地工具
- ✅ 可以在网页上管理所有配置

### 方式 2：Vercel CLI

**适合开发者和自动化**

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 克隆项目
git clone https://github.com/your-username/h5-ai-writer.git
cd h5-ai-writer

# 3. 登录 Vercel
vercel login

# 4. 部署
vercel --prod

# 5. 查看部署进度
vercel logs --tail
```

**优点：**
- ✅ 快速部署
- ✅ 可以自动化
- ✅ 完整的日志输出

### 方式 3：GitHub 自动部署

**最自动，修改自动部署**

```
1. Fork 项目到 GitHub
2. 连接到 Vercel
3. 每次 push 时自动部署
4. 完全零接触
```

**优点：**
- ✅ CI/CD 自动化
- ✅ 每次提交自动部署
- ✅ 回滚功能

---

## 环境变量配置

### 选项 1：可选配置（推荐新用户）

在部署时**不配置**任何 API 密钥：
- 应用可以正常部署
- 用户在前端输入 API 密钥
- 密钥保存在用户浏览器本地

**步骤：**
1. 在部署向导中跳过环境变量
2. 点击 Deploy
3. 应用上线后，用户在界面上输入 API 密钥使用

### 选项 2：部署时配置（推荐团队用户）

在 Vercel 仪表板中预配置 API 密钥：

**通过 GUI：**
1. 进入项目 → Settings
2. 点击 Environment Variables
3. 添加变量：

```
OPENAI_API_KEY = sk-your-openai-key
GEMINI_API_KEY = AIzaSy-your-gemini-key
DEEPSEEK_API_KEY = sk-your-deepseek-key
```

4. 保存并重新部署

**通过 CLI：**
```bash
vercel env add OPENAI_API_KEY
# 按提示输入密钥值

vercel env add GEMINI_API_KEY
vercel env add DEEPSEEK_API_KEY

# 重新部署
vercel --prod
```

### 环境变量使用优先级

```
1. 请求中的 API 密钥（最高优先级）
   ↓
2. Vercel 环境变量
   ↓
3. 返回错误（最低优先级）
```

这意味着：
- 如果用户在请求中提供 API 密钥，使用该密钥
- 如果没有，尝试使用环境变量
- 如果都没有，返回错误提示用户配置密钥

### 获取 API 密钥

#### OpenAI

1. 访问 https://platform.openai.com/api-keys
2. 登录账户
3. 点击 "Create new secret key"
4. 复制密钥
5. 保存到安全位置

#### Google Gemini

1. 访问 https://aistudio.google.com/app/apikey
2. 点击 "Create API key"
3. 选择或创建项目
4. 复制密钥
5. 保存到安全位置

#### DeepSeek

1. 访问 https://platform.deepseek.com/api
2. 登录账户
3. 进入 "API Keys" 页面
4. 点击 "Create New Key"
5. 复制密钥
6. 保存到安全位置

---

## API 文档

### 1. 处理内容 API

**端点：** `POST /api/process`

**功能：** 使用 AI 模型处理文本内容（扩写或润色）

**请求体：**

```json
{
  "provider": "openai",
  "content": "这是要处理的文本内容",
  "mode": "expand",
  "apiKey": "sk-optional-user-provided-key"
}
```

**参数说明：**

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `provider` | string | ✓ | AI 提供商：`openai`、`gemini`、`deepseek` |
| `content` | string | ✓ | 要处理的文本内容（不能为空） |
| `mode` | string | ✓ | 处理模式：`expand`（扩写）或 `polish`（润色） |
| `apiKey` | string | ✗ | API 密钥（可选，使用环境变量作为备选） |

**响应成功（200）：**

```json
{
  "result": "处理后的文本内容...",
  "provider": "openai",
  "timestamp": 1699858800000
}
```

**响应错误示例：**

```json
{
  "error": "MISSING_API_KEY",
  "message": "API key for openai is required. Provide it in request or configure it in Vercel environment variables.",
  "code": "MISSING_API_KEY"
}
```

**错误代码：**

| 代码 | HTTP 状态 | 说明 |
|------|----------|------|
| `MISSING_API_KEY` | 401 | API 密钥未提供或为空 |
| `INVALID_PROVIDER` | 400 | 不支持的 AI 提供商 |
| `INVALID_MODE` | 400 | 不支持的处理模式 |
| `EMPTY_CONTENT` | 400 | 内容为空 |
| `AUTH_ERROR` | 401 | API 密钥无效或权限不足 |
| `RATE_LIMIT` | 429 | API 速率限制 |
| `TIMEOUT` | 504 | 请求超时 |
| `SERVICE_UNAVAILABLE` | 503 | 服务不可用 |
| `INTERNAL_ERROR` | 500 | 服务器错误 |

**cURL 示例：**

```bash
curl -X POST https://your-app.vercel.app/api/process \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai",
    "content": "写一个有趣的故事开头",
    "mode": "expand",
    "apiKey": "sk-your-key"
  }'
```

**JavaScript 示例：**

```javascript
const response = await fetch('https://your-app.vercel.app/api/process', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    provider: 'openai',
    content: '要处理的内容',
    mode: 'expand',
    apiKey: 'sk-your-key', // 可选
  }),
})

const data = await response.json()
console.log(data.result)
```

### 2. 获取提供商列表 API

**端点：** `GET /api/providers`

**功能：** 获取支持的 AI 提供商信息

**请求：** 无请求体

**响应成功（200）：**

```json
{
  "providers": [
    {
      "id": "openai",
      "name": "OpenAI",
      "description": "GPT-3.5 Turbo - State-of-the-art language model",
      "url": "https://platform.openai.com/api-keys",
      "icon": "🔐",
      "status": "active"
    },
    {
      "id": "gemini",
      "name": "Google Gemini",
      "description": "Google AI Studio - Powerful multimodal model",
      "url": "https://aistudio.google.com/app/apikey",
      "icon": "🌐",
      "status": "active"
    },
    {
      "id": "deepseek",
      "name": "DeepSeek",
      "description": "DeepSeek API - Advanced reasoning model",
      "url": "https://platform.deepseek.com/api",
      "icon": "🚀",
      "status": "active"
    }
  ],
  "timestamp": "2024-11-12T12:00:00Z"
}
```

**cURL 示例：**

```bash
curl https://your-app.vercel.app/api/providers
```

### 3. 健康检查 API

**端点：** `GET /api/health`

**功能：** 检查服务是否正常运行

**请求：** 无请求体

**响应成功（200）：**

```json
{
  "status": "ok",
  "timestamp": "2024-11-12T12:00:00Z",
  "service": "H5 AI Writer API",
  "version": "1.0.0"
}
```

**cURL 示例：**

```bash
curl https://your-app.vercel.app/api/health
```

---

## 本地测试

### 前置要求

- Node.js 16+
- npm/yarn/pnpm
- Git

### 测试步骤

#### 1. 克隆项目

```bash
git clone https://github.com/your-username/h5-ai-writer.git
cd h5-ai-writer
```

#### 2. 安装依赖

```bash
npm install
# 或
yarn install
```

#### 3. 配置环境变量

```bash
# 复制示例文件
cp .env.example .env.local

# 编辑文件，添加 API 密钥（可选）
# nano .env.local
# 或在编辑器中打开

# 内容如下（可选）：
# OPENAI_API_KEY=sk-your-key
# GEMINI_API_KEY=AIz-your-key
# DEEPSEEK_API_KEY=sk-your-key
```

#### 4. 本地运行

```bash
# 方式 A：使用 Vercel CLI 本地开发
npm install -g vercel
vercel dev

# 方式 B：使用 npm
npm run dev
```

#### 5. 测试 API

**打开新终端，测试各个端点：**

```bash
# 测试健康检查
curl http://localhost:3000/api/health

# 测试获取提供商
curl http://localhost:3000/api/providers

# 测试处理 API
curl -X POST http://localhost:3000/api/process \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai",
    "content": "写一个故事",
    "mode": "expand",
    "apiKey": "sk-your-key"
  }'
```

#### 6. 调试

**查看实时日志：**

```bash
# Vercel 开发环境
vercel logs --tail

# 或从项目根目录查看
tail -f .vercel/log
```

---

## 生产部署

### 部署前检查清单

- [ ] 代码已经过测试
- [ ] 所有依赖已安装（`package.json` 正确）
- [ ] TypeScript 类型检查通过
- [ ] 没有控制台错误
- [ ] 所有 API 端点工作正常

### 部署步骤

#### 使用 Vercel GUI（最简单）

1. 访问 https://vercel.com/new
2. 连接 GitHub 账户
3. 选择 `h5-ai-writer` 仓库
4. 点击 "Import"
5. （可选）配置环境变量
6. 点击 "Deploy"
7. 等待完成（2-5 分钟）

#### 使用 Vercel CLI

```bash
# 登录
vercel login

# 部署到生产
vercel --prod

# 查看部署进度
vercel logs --tail

# 查看部署日志
vercel deployments
```

#### GitHub 自动部署

```bash
# 1. 推送到 GitHub
git push origin main

# 2. Vercel 自动部署（如果已连接）

# 3. 检查部署状态
# 在 GitHub PR 或 Commit 中查看部署链接
```

### 部署后验证

```bash
# 1. 获取您的 Vercel URL（从部署日志或仪表板）
# https://your-app-name.vercel.app

# 2. 测试 API 端点
curl https://your-app-name.vercel.app/api/health

# 3. 测试前端
# 在浏览器中打开应用 URL
```

---

## 监控和调试

### 查看部署日志

**通过 Vercel 仪表板：**

1. 登录 https://vercel.com
2. 选择项目
3. 点击 "Deployments"
4. 选择具体部署
5. 查看"Build"和"Functions"日志

**通过 CLI：**

```bash
# 查看实时日志
vercel logs --tail

# 查看特定函数的日志
vercel logs /api/process --tail
```

### 常见问题排查

#### 部署失败

**症状：** "Failed to build" 错误

**排查：**
```bash
# 1. 检查本地构建
npm run build

# 2. 检查 TypeScript
npm run type-check

# 3. 查看详细日志
vercel logs --tail

# 4. 检查 package.json 依赖
npm install

# 5. 重新部署
vercel --prod
```

#### 函数超时

**症状：** 504 Gateway Timeout

**原因：**
- API 响应缓慢
- 网络问题
- API 密钥无效

**解决：**
```bash
# 1. 检查 API 密钥有效性
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# 2. 测试网络连接
ping api.openai.com

# 3. 查看函数日志
vercel logs /api/process --tail
```

#### 环境变量未生效

**症状：** API 密钥始终为空

**解决：**
```bash
# 1. 验证环境变量已设置
vercel env list

# 2. 重新部署以应用变量
vercel --prod --force

# 3. 检查变量名拼写
# OPENAI_API_KEY (正确)
# openai_api_key (错误)
```

### 性能监控

**通过 Vercel 仪表板：**

1. 进入项目 Analytics
2. 查看：
   - 请求数
   - 响应时间
   - 错误率
   - 冷启动时间

**常见性能指标：**

| 指标 | 健康值 | 警告值 |
|------|-------|-------|
| 冷启动 | < 1s | > 3s |
| 响应时间 | < 500ms | > 2s |
| 错误率 | < 1% | > 5% |

---

## 常见问题

### Q: 可以在 Vercel 免费计划上运行吗？

**A:** 是的，完全可以。Vercel 免费计划包括：
- 无限项目
- 无限部署
- 50GB 带宽/月
- 100GB Serverless Functions/月
- 足以满足个人使用

### Q: 部署时可以不填 API 密钥吗？

**A:** 可以。应用支持两种模式：
1. **前端输入模式**（默认）：用户在界面上输入 API 密钥
2. **服务器环境模式**（可选）：在 Vercel 环境变量中配置

可以先部署应用，稍后再添加环境变量。

### Q: 用户在前端输入的 API 密钥安全吗？

**A:** 是的，安全。因为：
1. 密钥从浏览器直接发送到后端
2. 后端使用密钥调用 AI API
3. 密钥不会被存储或记录
4. 所有通信都使用 HTTPS 加密

### Q: 云函数有冷启动延迟吗？

**A:** 有，但不严重：
- 第一次请求：1-2 秒（冷启动）
- 后续请求：< 500ms（热启动）

保持应用每小时被访问一次可以避免冷启动。

### Q: 可以自定义 API 端点吗？

**A:** 可以。在 `api/` 目录中添加新的 `.ts` 文件：

```bash
# 创建新端点
touch api/custom.ts
```

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default (req: VercelRequest, res: VercelResponse) => {
  res.status(200).json({ message: 'Hello from custom API' })
}
```

重新部署后，新端点可在 `/api/custom` 访问。

### Q: 如何修改提示词？

**A:** 编辑 `api/process.ts` 中的提示词常量：

```typescript
const SYSTEM_PROMPT = `你的新提示词...`
const EXPAND_MODE_PROMPT = `扩写提示词...`
const POLISH_MODE_PROMPT = `润色提示词...`
```

修改后提交到 GitHub，Vercel 会自动部署。

### Q: 支持其他 AI 提供商吗？

**A:** 可以。在 `api/process.ts` 中添加新的函数：

```typescript
async function callNewProvider(apiKey: string, content: string, mode: string): Promise<string> {
  // 实现调用新 AI 提供商的逻辑
}
```

然后在 `processContent` 函数中添加 case。

### Q: 可以设置 API 速率限制吗？

**A:** Vercel 提供基础的速率限制。如需更高级的限制，可以：
1. 使用 Vercel 中间件
2. 添加额外的验证逻辑
3. 集成第三方服务（如 Redis）

### Q: 如何回滚到旧版本？

**A:** 在 Vercel 仪表板中：
1. 进入 Deployments
2. 找到想要的版本
3. 点击"...更多"
4. 选择"Promote to Production"

或通过 CLI：
```bash
vercel deployments list
vercel rollback
```

### Q: 支持 WebSocket 吗？

**A:** Vercel Serverless Functions 不支持 WebSocket。如果需要实时通信，可以考虑：
1. 使用 Vercel Edge Functions
2. 迁移到 Next.js
3. 使用 WebSocket 服务（如 Firebase）

---

## 性能优化

### 前端优化

```typescript
// 1. 请求去重
const cache = new Map()
async function processCached(key: string, fn: Function) {
  if (cache.has(key)) return cache.get(key)
  const result = await fn()
  cache.set(key, result)
  return result
}

// 2. 错误重试
async function retryFetch(url: string, options: any, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options)
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
}

// 3. 超时控制
async function fetchWithTimeout(url: string, timeout = 30000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  try {
    return await fetch(url, { signal: controller.signal })
  } finally {
    clearTimeout(timeoutId)
  }
}
```

### 后端优化

```typescript
// 1. 连接复用
const axiosInstance = axios.create({
  timeout: 30000,
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
})

// 2. 并发控制
async function parallelRequests(tasks: Function[], maxConcurrent = 5) {
  const results = []
  for (let i = 0; i < tasks.length; i += maxConcurrent) {
    const batch = tasks.slice(i, i + maxConcurrent)
    results.push(...await Promise.all(batch.map(t => t())))
  }
  return results
}

// 3. 缓存策略
const cache = new Map<string, { data: any; timestamp: number }>()
function getCached(key: string, maxAge = 3600000) {
  const item = cache.get(key)
  if (item && Date.now() - item.timestamp < maxAge) {
    return item.data
  }
  return null
}
```

### 成本优化

**降低账单的方法：**

1. **减少 API 调用**
   - 实现客户端缓存
   - 合并多个请求
   - 使用便宜的模型

2. **优化函数执行**
   - 减少执行时间
   - 使用流式响应
   - 避免不必要的计算

3. **监控使用量**
   - 定期检查账单
   - 设置成本告警
   - 优化高成本的操作

**成本估算示例：**
```
假设每月 1000 次请求：
- Vercel：免费（在免费配额内）
- OpenAI：$0.50-2（取决于使用量）
- Gemini：免费-$0.10（免费配额充足）
- DeepSeek：$0.10-0.50

总计：每月 $0.60-2.60（非常便宜）
```

---

## 相关资源

### 官方文档

- [Vercel 官方文档](https://vercel.com/docs)
- [Vercel Functions 文档](https://vercel.com/docs/serverless-functions/introduction)
- [Vercel 环境变量](https://vercel.com/docs/concepts/projects/environment-variables)

### AI API 文档

- [OpenAI API 文档](https://platform.openai.com/docs/api-reference)
- [Google Gemini 文档](https://ai.google.dev/tutorials/python_quickstart)
- [DeepSeek API 文档](https://platform.deepseek.com/api-docs)

### 项目文档

- [项目概览](README.md)
- [快速开始](QUICKSTART.md)
- [部署指南](DEPLOYMENT.md)
- [后端架构](BACKEND_ARCHITECTURE.md)
- [常见问题](BACKEND_FAQ.md)

---

## 下一步

1. ✅ 部署应用到 Vercel
2. ✅ 测试所有 API 端点
3. ✅ 配置自定义域名（可选）
4. ✅ 设置监控和告警
5. ✅ 邀请用户使用

---

## 支持和反馈

如有问题或建议：

- 📧 提交 GitHub Issue
- 💬 讨论区留言
- 🐛 报告 Bug

**祝部署顺利！** 🚀

---

**最后更新：** 2024年11月
**维护者：** H5 AI Writer 团队
