# 快速开始

5分钟快速部署 ADI Writer 到 Vercel。

## 前置要求

- Node.js 18+ (使用 `node -v` 检查)
- pnpm 8+ (使用 `pnpm -v` 检查)
- GitHub 账户
- Vercel 账户

## 步骤 1: 克隆仓库

```bash
git clone https://github.com/yourusername/adi-writer.git
cd adi-writer
pnpm install
```

## 步骤 2: 配置环境变量

复制环境配置文件：

```bash
cp .env.example .env.production
```

编辑 `.env.production` 并填入您的 API 密钥：

```env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_API_BASE_URL=https://your-vercel-deployment.vercel.app
```

## 步骤 3: 本地测试

```bash
pnpm -r dev
```

访问 `http://localhost:5173`

## 步骤 4: 推送到 GitHub

```bash
git add .
git commit -m "Add VuePress documentation"
git push origin main
```

## 步骤 5: 在 Vercel 上部署

### 方式一: 使用 Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

### 方式二: 通过 Web 界面

1. 访问 [vercel.com/new](https://vercel.com/new)
2. 连接您的 GitHub 仓库
3. 选择项目根目录
4. 配置环境变量
5. 点击"Deploy"

## 🎉 完成！

您的应用现在应该已部署在：`https://your-project.vercel.app`

## 下一步

- [Vercel 部署指南](/guide/vercel-deployment.html) - 详细配置选项
- [环境配置](/guide/environment.html) - 所有可用的环境变量
- [API 文档](/api/overview.html) - 了解 API 端点

## 常见问题

### Q: 部署失败?
A: 查看 [故障排除指南](/faq/troubleshooting.html)

### Q: 如何更新应用?
A: 推送更改到 GitHub，Vercel 会自动部署

### Q: 如何回滚?
A: 使用 Vercel Dashboard 中的 Deployments 标签
