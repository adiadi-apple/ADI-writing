# 环境配置

ADI Writer 所有可用的环境变量及其配置说明。

## 环境文件

项目使用以下环境文件：

- `.env` - 本地开发环境
- `.env.production` - 生产环境（Vercel）
- `.env.example` - 环境文件模板

## 必需环境变量

### OpenAI 配置

```env
VITE_OPENAI_API_KEY=sk_test_xxxxx
```

- **描述**: OpenAI API 密钥
- **获取方式**: https://platform.openai.com/api-keys
- **格式**: `sk-xxx`
- **作用**: 用于调用 OpenAI API 进行文本补全

### API 基础 URL

```env
VITE_API_BASE_URL=https://api.example.com
```

- **描述**: 后端 API 基础地址
- **本地开发**: `http://localhost:3000`
- **生产环境**: 您的 Vercel 域名
- **格式**: 完整的 URL，不需要尾部斜杠

## 可选环境变量

### 日志配置

```env
VITE_LOG_LEVEL=info
```

- **可选值**: `debug`, `info`, `warn`, `error`
- **默认值**: `info`
- **描述**: 控制日志输出级别

### 功能开关

```env
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CRASH_REPORTING=true
```

- **描述**: 启用/禁用各项功能
- **默认值**: `true`
- **格式**: `true` 或 `false`

### 性能配置

```env
VITE_REQUEST_TIMEOUT=30000
VITE_CACHE_TTL=3600
```

- **REQUEST_TIMEOUT**: 请求超时时间（毫秒）
- **CACHE_TTL**: 缓存有效期（秒）

## Vercel 特定变量

### 自动设置的变量

Vercel 会自动设置以下变量，无需手动配置：

```env
NODE_ENV=production
VERCEL=1
VERCEL_ENV=production
VERCEL_URL=xxx.vercel.app
VERCEL_GIT_COMMIT_SHA=xxx
```

### 构建相关

```env
VERCEL_ANALYTICS_ID=xxxxx
```

- **描述**: 用于 Vercel Analytics
- **自动生成**: 无需手动设置

## 环境特定配置

### 开发环境 (.env)

```env
VITE_OPENAI_API_KEY=sk_test_xxxxx
VITE_API_BASE_URL=http://localhost:3000
VITE_LOG_LEVEL=debug
VITE_ENABLE_ANALYTICS=false
```

### 生产环境 (.env.production)

```env
VITE_OPENAI_API_KEY=sk_prod_xxxxx
VITE_API_BASE_URL=https://your-app.vercel.app
VITE_LOG_LEVEL=warn
VITE_ENABLE_ANALYTICS=true
```

### 预览环境 (.env.preview)

```env
VITE_OPENAI_API_KEY=sk_preview_xxxxx
VITE_API_BASE_URL=https://preview.your-app.vercel.app
VITE_LOG_LEVEL=info
VITE_ENABLE_ANALYTICS=false
```

## 配置步骤

### 1. 创建环境文件

```bash
cp .env.example .env
cp .env.example .env.production
```

### 2. 编辑本地开发环境

编辑 `.env` 文件：

```env
VITE_OPENAI_API_KEY=sk_test_xxxxx
VITE_API_BASE_URL=http://localhost:3000
```

### 3. 验证配置

```bash
# 检查 env 文件是否有语法错误
pnpm run type-check
```

### 4. 重启开发服务器

```bash
pnpm dev
```

## Vercel 中配置环境变量

### 通过 Vercel 命令行

```bash
# 设置单个变量
vercel env add VITE_OPENAI_API_KEY

# 设置生产环境变量
vercel env add VITE_API_BASE_URL --environments production
```

### 通过 Vercel Dashboard

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择您的项目
3. 进入 Settings → Environment Variables
4. 点击 "Add New Variable"
5. 输入变量名和值
6. 选择应用环境（Production/Preview/Development）
7. 点击 "Add"

## 敏感信息安全

### 不要提交敏感信息

```bash
# 错误❌ - 不要这样做
git add .env.production
git commit -m "Add production keys"

# 正确✅ - 使用 .gitignore
echo ".env.production" >> .gitignore
```

### .gitignore 配置

```
# 环境变量
.env
.env.*.local
.env.production

# API 密钥相关
.env.*.key
secrets.json
```

### 访问环境变量

在代码中安全地访问环境变量：

```typescript
// ✅ 正确 - 使用 VITE_ 前缀
const apiKey = import.meta.env.VITE_OPENAI_API_KEY

// ❌ 错误 - 不要这样做
const apiKey = process.env.OPENAI_API_KEY
```

## 密钥管理最佳实践

### 🔐 安全建议

1. **定期轮换密钥**
   - 每季度更新一次生产密钥
   - 及时撤销泄露的密钥

2. **使用环境变量**
   - 从不在代码中硬编码密钥
   - 从不在日志中输出密钥

3. **版本控制**
   - 确保 `.env.production` 在 `.gitignore` 中
   - 使用 Vercel 管理生产密钥

4. **访问控制**
   - 限制谁可以访问生产环境变量
   - 使用团队权限管理

## 调试环境变量

### 查看当前环境变量

```bash
# 列出所有环境变量
env | grep VITE_

# 查看特定变量
echo $VITE_OPENAI_API_KEY
```

### 在开发中验证

```typescript
// 在 main.ts 中
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)
console.log('Log Level:', import.meta.env.VITE_LOG_LEVEL)
```

## 故障排除

### 环境变量不生效

**问题**: 更改 `.env` 后变量未更新

**解决方案**:
1. 停止开发服务器: `Ctrl+C`
2. 删除 `.vite` 缓存目录
3. 重启: `pnpm dev`

### 生产环境找不到变量

**问题**: Vercel 部署时找不到环境变量

**解决方案**:
1. 检查 Vercel Dashboard 中的变量名
2. 确保变量应用了正确的环境
3. 重新部署: `vercel --prod`

## 相关文档

- [快速开始](/guide/quickstart.html)
- [Vercel 部署](/guide/vercel-deployment.html)
- [本地开发](/guide/local-development.html)
