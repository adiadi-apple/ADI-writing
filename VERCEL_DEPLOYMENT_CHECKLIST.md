# Vercel 部署检查清单

在部署到 Vercel 之前，请确保完成以下检查。

## ✅ 本地验证

### 1. 依赖和构建

- [ ] Node.js 版本 18+ (`node -v`)
- [ ] pnpm 版本 8+ (`pnpm -v`)
- [ ] 所有依赖已安装 (`pnpm install`)
- [ ] 本地开发运行正常 (`pnpm dev`)
- [ ] 本地构建成功 (`pnpm build`)
- [ ] 没有 TypeScript 错误 (`pnpm type-check`)
- [ ] 没有 Lint 错误 (`pnpm lint`)

### 2. 主应用验证

- [ ] 主应用在 `apps/main/` 目录
- [ ] `apps/main/package.json` 配置正确
- [ ] `apps/main/vite.config.ts` 存在
- [ ] 构建输出在 `apps/main/dist/`
- [ ] `pnpm build:main` 成功
- [ ] `pnpm preview` 可以访问应用

### 3. 文档验证

- [ ] 文档在 `docs/` 目录
- [ ] `docs/package.json` 配置正确
- [ ] `docs/.vuepress/config.ts` 存在
- [ ] `pnpm dev:docs` 正常运行
- [ ] 文档在 http://localhost:8080 可访问
- [ ] `pnpm build:docs` 成功
- [ ] 构建输出在 `docs/.vuepress/dist/`

### 4. API 函数验证

- [ ] API 文件在 `api/` 目录
- [ ] Vercel 函数配置正确
- [ ] 没有构建错误

## 🔐 环境变量配置

### 必需的环境变量

- [ ] `VITE_OPENAI_API_KEY` - OpenAI API 密钥（或在前端配置）
- [ ] `VITE_API_BASE_URL` - API 基础 URL（可选，如果有后端）

### 在 Vercel Dashboard 中配置

1. 创建项目后进入 Settings
2. 找到 Environment Variables
3. 添加以下变量：
   - Key: `VITE_OPENAI_API_KEY`
   - Value: 您的 OpenAI API 密钥
   - Environments: 勾选 Production, Preview, Development

## 🔨 Vercel 配置文件

### vercel.json 验证

- [ ] `vercel.json` 文件存在于根目录
- [ ] `buildCommand` 设置为 `pnpm run build:main`
- [ ] `outputDirectory` 设置为 `apps/main/dist`
- [ ] 环境变量配置正确
- [ ] Rewrite 规则配置正确

**示例内容：**
```json
{
  "version": 2,
  "buildCommand": "pnpm run build:main",
  "outputDirectory": "apps/main/dist",
  "env": {
    "VITE_OPENAI_API_KEY": "@openai_key"
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    },
    {
      "source": "/:path*",
      "destination": "/index.html"
    }
  ]
}
```

## 📁 .gitignore 验证

- [ ] `.gitignore` 包含 `node_modules/`
- [ ] `.gitignore` 包含 `dist/`
- [ ] `.gitignore` 包含 `.env`
- [ ] `.gitignore` 包含 `.env.local`
- [ ] 不应该提交的文件都被忽略

## 🔄 Git 提交

- [ ] 所有代码已提交
- [ ] 没有未提交的更改
- [ ] 分支已推送到 GitHub
- [ ] Commit 消息清晰有意义

## 🚀 部署前最终检查

### 1. 清洁构建测试

```bash
# 完全清理
pnpm clean
rm -rf node_modules

# 重新安装
pnpm install

# 构建所有项目
pnpm build

# 验证输出目录
ls -la apps/main/dist/
ls -la docs/.vuepress/dist/
```

### 2. 环境文件检查

- [ ] `.env.production` 已正确配置
- [ ] 敏感信息不在代码中
- [ ] 所有必需的环境变量都有值

### 3. 构建日志检查

- [ ] 没有错误信息
- [ ] 没有 WARNING（除非是预期的）
- [ ] 构建时间在合理范围内（< 5 分钟）

## 📊 Vercel Dashboard 配置

### 1. 项目设置

- [ ] Root Directory: 保留默认（根目录）
- [ ] Framework Preset: Other
- [ ] Build Command: `pnpm run build:main`
- [ ] Output Directory: `apps/main/dist`
- [ ] Install Command: `pnpm install --frozen-lockfile`

### 2. 环境变量

- [ ] 已添加所有必需的环境变量
- [ ] 变量应用到正确的环境（Production/Preview/Development）
- [ ] 值不包含引号

### 3. 域名配置（可选）

- [ ] 如果使用自定义域名，已配置 DNS
- [ ] SSL 证书已配置（Vercel 自动）

## ✅ 部署流程

### 1. 点击部署按钮

```
在 README.md 中找到 "Deploy with Vercel" 按钮
或访问 https://vercel.com/new
```

### 2. 授权 GitHub

- [ ] 已授权 Vercel 访问 GitHub
- [ ] 选择了正确的仓库

### 3. 配置部署

- [ ] 项目名称合理
- [ ] Root Directory 正确
- [ ] Build Command 正确
- [ ] Output Directory 正确
- [ ] 环境变量已填写（如需要）

### 4. 部署

- [ ] 点击"Deploy"按钮
- [ ] 等待构建完成（通常 2-5 分钟）
- [ ] 查看构建日志，确保没有错误

## 🔍 部署后验证

### 1. 验证部署成功

- [ ] 在 Vercel Dashboard 看到"Ready"状态
- [ ] 部署 URL 生成（通常为 `https://your-project.vercel.app`）

### 2. 测试主应用

- [ ] 访问 https://your-project.vercel.app
- [ ] 应用加载正常
- [ ] 功能可用
- [ ] 没有控制台错误

### 3. 测试文档

- [ ] 访问 https://your-project.vercel.app/docs
- [ ] 文档加载正常
- [ ] 导航链接工作正常
- [ ] 搜索功能工作正常

### 4. 测试 API

- [ ] API 端点可访问
- [ ] 返回正确的响应
- [ ] 错误处理正确

## 🐛 常见问题排查

### 构建失败

**原因可能是：**
- [ ] Node.js 版本不兼容
- [ ] 依赖安装失败
- [ ] 构建命令错误
- [ ] TypeScript 错误
- [ ] 环境变量未设置

**解决方案：**
```bash
# 查看完整的构建日志
# 在 Vercel Dashboard 中点击 View Logs

# 本地重现相同的构建过程
pnpm clean
pnpm install --frozen-lockfile
pnpm build
```

### 404 错误

**原因可能是：**
- [ ] Output Directory 不正确
- [ ] 构建没有生成 index.html
- [ ] Rewrite 规则不正确

**解决方案：**
- 检查 vercel.json 中的 outputDirectory
- 确保构建输出包含 index.html
- 验证 rewrite 规则

### 环境变量未生效

**解决方案：**
- [ ] 确保变量在 Vercel Dashboard 中设置
- [ ] 确保变量名称正确（区分大小写）
- [ ] 确保变量应用了正确的环境
- [ ] 重新部署以应用新的环境变量

### 文档不显示

**解决方案：**
- [ ] 检查文档是否正确构建
- [ ] 验证 /docs 路由是否正确配置
- [ ] 检查 vercel.json 中的 rewrite 规则
- [ ] 查看浏览器控制台错误

## 📞 需要帮助？

1. 查看 [Vercel 部署指南](./VERCEL_DEPLOYMENT.md)
2. 查看 [常见问题](./README.md#常见问题)
3. 查看 [故障排除指南](./docs/src/faq/troubleshooting.md)
4. 提交 GitHub Issue

## ✨ 部署完成

- [ ] 所有检查通过
- [ ] 应用正常运行
- [ ] 文档可访问
- [ ] 没有错误
- [ ] 分享应用链接

---

**版本**: 1.0.0
**最后更新**: 2024年

快速链接：[README](./README.md) | [Vercel 部署](./VERCEL_DEPLOYMENT.md) | [快速参考](./QUICK_REFERENCE.md)
