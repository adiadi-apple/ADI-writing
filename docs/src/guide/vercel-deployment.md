# Vercel 部署指南

完整的 Vercel 部署配置和最佳实践。

## 部署架构

```
┌─────────────────────┐
│  GitHub Repository  │
│   (Main Branch)     │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  Vercel Build       │
│  (Automatic)        │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  Production URL     │
│  *.vercel.app       │
└─────────────────────┘
```

## Vercel 配置文件

### vercel.json

```json
{
  "version": 2,
  "buildCommand": "pnpm run build",
  "outputDirectory": "apps/main/dist",
  "env": {
    "VITE_OPENAI_API_KEY": "@openai_key",
    "VITE_API_BASE_URL": "@api_base_url"
  },
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 60,
      "memory": 512
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```

## 环境变量配置

### 必需的环境变量

| 变量名 | 描述 | 示例 |
|--------|------|------|
| `VITE_OPENAI_API_KEY` | OpenAI API 密钥 | `sk-xxx` |
| `VITE_API_BASE_URL` | API 基础 URL | `https://xxx.vercel.app` |

### 可选的环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `NODE_ENV` | 环境模式 | `production` |
| `VITE_LOG_LEVEL` | 日志级别 | `info` |

## 部署步骤

### 1. 准备仓库

确保您的仓库有正确的结构：

```
├── apps/
│   └── main/
│       ├── src/
│       ├── dist/
│       └── package.json
├── api/
├── docs/
├── vercel.json
└── package.json
```

### 2. 连接 GitHub

1. 访问 [vercel.com/new](https://vercel.com/new)
2. 点击"Select a Git Repository"
3. 授权 GitHub
4. 选择您的仓库

### 3. 配置构建设置

设置以下选项：

- **Build Command**: `pnpm run build`
- **Output Directory**: `apps/main/dist`
- **Install Command**: `pnpm install --frozen-lockfile`

### 4. 添加环境变量

1. 在 Vercel Dashboard 中
2. 进入 Project Settings → Environment Variables
3. 添加必要的环境变量

### 5. 部署

点击"Deploy"按钮。Vercel 会自动：
- 检出代码
- 安装依赖
- 构建项目
- 部署到 CDN

## 自动部署

### Git 集成

Vercel 自动监听 Git 事件：

- **Push to main**: 自动部署到 Production
- **Push to other branches**: 预览部署

### Webhooks

配置 GitHub webhooks 以触发自定义构建逻辑：

```bash
curl -X POST https://api.vercel.com/v1/integrations/deploy-hooks \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -d '{"name":"Build Trigger","ref":"main"}'
```

## 性能优化

### 构建优化

```json
{
  "buildCommand": "pnpm run build && pnpm run optimize",
  "outputDirectory": "apps/main/dist",
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

### 缓存策略

- 启用 HTTP 缓存头
- 使用 immutable 文件名
- 启用 Gzip 压缩

## 监控和日志

### Vercel Analytics

1. 在 Vercel Dashboard 中启用 Analytics
2. 查看实时流量和性能数据
3. 设置告警规则

### 日志查看

```bash
# 查看构建日志
vercel logs --follow

# 查看函数日志
vercel logs --function api/hello
```

## 故障排除

### 构建失败

检查以下内容：
1. 依赖是否正确安装
2. 构建命令是否正确
3. 环境变量是否完整

### 运行时错误

1. 查看 Vercel Logs
2. 检查函数超时设置
3. 验证 API 端点配置

## 最佳实践

✅ **推荐做法**：
- 使用环境变量管理敏感信息
- 定期更新依赖
- 监控构建时间
- 设置 GitHub 分支保护

❌ **避免做法**：
- 提交敏感信息到仓库
- 在构建过程中下载大文件
- 使用过多的环保变量

## 相关文档

- [环境配置](/guide/environment.html)
- [部署清单](/guide/deployment-checklist.html)
- [故障排除](/faq/troubleshooting.html)
