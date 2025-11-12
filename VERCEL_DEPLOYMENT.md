# Vercel 一键部署指南

本文档说明如何使用 Vercel 进行一键部署 H5 AI Writer 项目，包括前端和后端服务。

## 部署架构

本项目采用前后分离架构：

- **前端**: Vue 3 + TypeScript 应用（部署在 Vercel 静态托管）
- **后端**: Serverless Functions（API 路由处理）
- **优势**:
  - ✅ API 密钥存储在服务器端，安全性更高
  - ✅ 统一的 API 接口
  - ✅ 自动扩展和负载均衡
  - ✅ 集成日志和监控

## 快速开始

### 前置要求

1. Vercel 账户（免费注册）
2. GitHub 账户
3. AI 提供商的 API 密钥（**可选** - 部署时可以跳过）：
   - OpenAI API Key
   - Google Gemini API Key
   - DeepSeek API Key

**注意：** 您可以先部署应用而不配置任何 API 密钥，用户可以在前端输入。或稍后在 Vercel 仪表板中添加环境变量。

### 一键部署

#### 方法 1：使用 Vercel 按钮（最简单）

如果在 GitHub 上添加了部署按钮，点击后会自动：
1. Fork 项目到您的仓库
2. 连接到 Vercel
3. 设置环境变量
4. 自动部署

（需要在 README.md 中添加部署按钮）

#### 方法 2：通过 Vercel CLI

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 克隆项目
git clone https://github.com/your-username/h5-ai-writer.git
cd h5-ai-writer

# 3. 部署到 Vercel
vercel
```

#### 方法 3：连接 GitHub（推荐）

1. **准备工作**
   - Fork 本项目到您的 GitHub
   - 在 Vercel 中登录

2. **添加项目**
   - 访问 https://vercel.com/new
   - 选择 "Import Git Repository"
   - 搜索并选择您的 `h5-ai-writer` 仓库
   - 点击 "Import"

3. **配置环境变量**（可选）
   - 在 "Environment Variables" 部分添加（全部可选）：

   ```
   OPENAI_API_KEY=your_openai_api_key
   GEMINI_API_KEY=your_gemini_api_key
   DEEPSEEK_API_KEY=your_deepseek_api_key
   ```

   - 或者只添加需要的 API 密钥
   - 或者完全跳过，用户可以在前端输入

4. **部署**
   - 点击 "Deploy"
   - 等待部署完成（通常 1-3 分钟）

5. **完成**
   - 部署完成后获得唯一的 Vercel URL
   - 自动分配 HTTPS 证书
   - 自动配置 CDN

## 环境变量配置

### 配置是完全可选的

应用支持两种工作模式：

1. **用户输入模式**（推荐快速开始）
   - 不配置任何环境变量
   - 用户在前端输入 API 密钥
   - 密钥保存在用户浏览器本地

2. **服务器模式**（推荐团队使用）
   - 在 Vercel 环境变量中配置密钥
   - 后端使用这些密钥调用 AI API
   - 用户无需输入密钥，更方便

### 在 Vercel 仪表板中配置

1. 进入项目 Settings
2. 点击 Environment Variables
3. 添加以下变量（全部可选）：

| 变量名 | 值 | 说明 |
|------|---|------|
| `OPENAI_API_KEY` | `sk-...` | OpenAI API 密钥（可选） |
| `GEMINI_API_KEY` | `AIz...` | Google Gemini API 密钥（可选） |
| `DEEPSEEK_API_KEY` | `sk-...` | DeepSeek API 密钥（可选） |

### 获取 API 密钥

#### OpenAI
1. 访问 https://platform.openai.com/api-keys
2. 创建新的 API 密钥
3. 复制密钥

#### Google Gemini
1. 访问 https://aistudio.google.com/app/apikey
2. 点击 "Create API key"
3. 选择或创建项目
4. 复制 API 密钥

#### DeepSeek
1. 访问 https://platform.deepseek.com/api
2. 进入账户设置
3. 创建新的 API 密钥
4. 复制密钥

## 项目结构

```
h5-ai-writer/
├── src/                    # 前端源代码
├── api/                    # Serverless API 函数
│   ├── process.ts         # 主 AI 处理端点
│   ├── health.ts          # 健康检查端点
│   └── providers.ts       # 提供商信息端点
├── vercel.json            # Vercel 配置
├── vite.config.ts         # Vite 构建配置
├── package.json           # 项目依赖
└── index.html             # HTML 入口
```

## API 端点

部署后可用的 API 端点：

### 处理内容
```
POST /api/process
```

**请求体：**
```json
{
  "provider": "openai",
  "content": "要处理的文本",
  "mode": "expand",
  "apiKey": "user-provided-api-key"
}
```

**响应：**
```json
{
  "result": "处理后的文本",
  "provider": "openai",
  "timestamp": 1699858800000
}
```

### 获取提供商列表
```
GET /api/providers
```

**响应：**
```json
{
  "providers": [
    {
      "id": "openai",
      "name": "OpenAI",
      "description": "GPT-3.5 Turbo",
      "url": "https://platform.openai.com/api-keys",
      "status": "active"
    },
    ...
  ]
}
```

### 健康检查
```
GET /api/health
```

**响应：**
```json
{
  "status": "ok",
  "timestamp": "2024-11-12T12:00:00Z",
  "service": "H5 AI Writer API",
  "version": "1.0.0"
}
```

## 本地测试

在部署前测试后端服务：

```bash
# 1. 安装依赖
npm install

# 2. 设置环境变量
cp .env.example .env.local
# 编辑 .env.local 添加 API 密钥

# 3. 运行开发服务器
npm run dev

# 4. 在另一个终端运行 Vercel 开发环境
vercel dev
```

## 自动部署

每当推送代码到 GitHub 时，Vercel 会自动：
1. 触发构建
2. 运行测试（如果配置）
3. 部署到生产环境
4. 生成新的部署 URL

## 监控和日志

### 查看日志

1. **Vercel 仪表板**
   - 进入项目
   - 点击 "Deployments"
   - 点击具体的部署
   - 查看构建日志和函数日志

2. **实时日志**
   ```bash
   vercel logs --tail
   ```

### 性能监控

- Vercel 内置 Real User Monitoring (RUM)
- 自动跟踪性能指标
- 可配置告警

## 自定义域名

1. 进入项目设置
2. 点击 "Domains"
3. 添加自定义域名
4. 按照指示配置 DNS
5. 自动配置 SSL/TLS 证书

## 安全性考虑

### 后端 API 优势

✅ **API 密钥保护**
- 密钥存储在 Vercel 环境变量中
- 不暴露给客户端
- 请求来自服务器，降低滥用风险

✅ **CORS 保护**
- 自动配置 CORS 头
- 可在 API 函数中自定义

✅ **请求验证**
- 服务器端输入验证
- 防止恶意请求

✅ **速率限制**
- 可配置请求频率限制
- Vercel 内置 DDoS 保护

### 建议措施

1. **定期轮换 API 密钥**
   ```bash
   # 定期更新 Vercel 环境变量
   ```

2. **启用 Vercel 安全特性**
   - 启用 Protected Branches
   - 配置 Branch Protection Rules

3. **监控异常活动**
   - 定期检查 API 日志
   - 设置告警

## 故障排除

### 部署失败

```
Error: Failed to build
```

**解决方案：**
- 检查 Node.js 版本兼容性
- 运行 `npm install` 确保依赖完整
- 查看构建日志详细信息

### API 请求超时

```
504 Gateway Timeout
```

**解决方案：**
- 检查 API 密钥有效性
- 确保网络连接正常
- 减少请求内容长度

### 环境变量未设置

```
Unauthorized: API key is required. Provide it in request or configure it in Vercel environment variables.
```

**解决方案：**
- 方案 A：用户在前端输入 API 密钥
- 方案 B：在 Vercel 中设置环境变量
- 方案 C：重新部署以应用新变量
- 检查变量名称是否正确

## 成本估算

### Vercel 免费计划

✅ **包括：**
- 无限项目和部署
- 50GB 带宽/月
- Serverless Functions（100GB/月）
- 无缝 Git 集成
- 自动 HTTPS

❌ **不包括：**
- 超过限制需付费

### AI API 成本

根据使用量和提供商：
- OpenAI: $0.0005/1K tokens (输入), $0.0015/1K tokens (输出)
- Gemini: 免费配额 + 按需付费
- DeepSeek: 按需付费

## 性能优化

### 前端优化

- Vite 自动代码分割
- 生产构建自动最小化
- CDN 分发资源

### 后端优化

- Serverless Functions 自动扩展
- 智能缓存策略
- 连接池优化

### 建议

1. **启用边缘缓存**
   - 在 Vercel 中配置缓存头
   
2. **使用 CDN**
   - Vercel 自动使用 Vercel Edge Network

3. **监控性能**
   - 使用 Web Vitals 监控
   - 定期检查性能指标

## 升级和维护

### 自动更新

```bash
# 本地更新依赖
npm update

# 推送到 GitHub
git push

# Vercel 自动部署
```

### 手动部署

```bash
# 使用 Vercel CLI
vercel --prod
```

## 常见问题

### Q: 可以在 Vercel 免费计划上运行吗？
A: 是的，完全可以。Vercel 免费计划包括 Serverless Functions 和无限部署。

### Q: 后端函数有冷启动延迟吗？
A: 首次请求可能有 1-2 秒延迟，之后会保持温暖。

### Q: 可以自定义 API 端点吗？
A: 是的，可以在 `api/` 目录中添加更多函数。

### Q: 如何监控 API 使用情况？
A: 可以在 Vercel 仪表板中查看 Serverless Function 使用情况。

### Q: 支持 WebSocket 吗？
A: Vercel Serverless Functions 不支持 WebSocket，但 Vercel Edge Functions 可能支持。

## 相关资源

### 项目文档
- [云函数完整指南](CLOUD_FUNCTIONS_DEPLOYMENT.md) - 云函数详细文档和 API 使用
- [后端架构说明](BACKEND_ARCHITECTURE.md) - 后端设计和实现
- [常见问题解答](BACKEND_FAQ.md) - 50+ 问答

### 官方文档
- [Vercel 官方文档](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/serverless-functions/introduction)
- [Vercel 环境变量](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)（参考）

## 下一步

1. ✅ 配置 GitHub 仓库
2. ✅ 连接 Vercel
3. ✅ 添加环境变量
4. ✅ 触发部署
5. ✅ 测试应用
6. ✅ 配置自定义域名（可选）

---

祝您部署顺利！🚀

有任何问题，欢迎提交 Issue。
