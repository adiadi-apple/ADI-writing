# 快速部署指南

**开始使用 H5 AI Writer 只需要 3 步！**

## 🚀 30 秒快速部署

### 选项 1：一键部署（最简单）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fh5-ai-writer&env=OPENAI_API_KEY,GEMINI_API_KEY,DEEPSEEK_API_KEY&envDescription=AI%20API%20Keys%20(Optional)&envLink=https://h5-ai-writer.vercel.app)

**步骤：**
1. 点击上方按钮
2. 授权 GitHub 访问
3. 点击 "Deploy"
4. 完成！获得您的应用 URL

**耗时：** 2-5 分钟

---

## ⚙️ 部署配置选项

### 方式 A：快速部署（推荐初学者）

不配置任何 API 密钥，直接部署：
- ✅ 应用立即上线
- ✅ 用户在前端输入 API 密钥
- ✅ 无需维护服务器密钥
- ⏱️ 最快 2 分钟完成

**何时使用：** 想快速体验或为用户提供服务

### 方式 B：完整部署（推荐团队）

在部署时配置 API 密钥：
- ✅ API 密钥安全存储在 Vercel
- ✅ 用户无需输入密钥
- ✅ 更专业和安全
- ⏱️ 需要 5-10 分钟（包括获取密钥）

**何时使用：** 团队项目或生产环境

---

## 📋 详细部署步骤

### 步骤 1：准备

- [ ] 拥有 Vercel 账户（免费注册 https://vercel.app）
- [ ] 拥有 GitHub 账户
- [ ] （可选）准备 AI API 密钥

### 步骤 2：部署

**通过 Vercel 按钮（最简单）**

1. 点击本页面上方的"Deploy with Vercel"按钮
2. 选择 GitHub 账户并授权
3. 输入项目名称（或使用默认）
4. 点击"Skip"跳过环境变量配置（或输入 API 密钥）
5. 点击"Deploy"

**通过 Vercel 网站**

1. 访问 https://vercel.com/new
2. 点击"Import Git Repository"
3. 输入：`https://github.com/your-username/h5-ai-writer`
4. 点击"Import"
5. 点击"Deploy"

### 步骤 3：开始使用

1. 等待部署完成（通常 2-5 分钟）
2. 点击"Visit"按钮打开应用
3. 在前端输入 API 密钥或使用已配置的密钥
4. 开始写作！

---

## 🔑 API 密钥配置

### 是否需要在部署时配置？

| 场景 | 需要 | 说明 |
|------|------|------|
| 快速体验 | ❌ | 跳过配置，用户在前端输入 |
| 团队使用 | ✅ | 配置后更安全和方便 |
| 生产环境 | ✅ | 推荐配置，保护 API 密钥 |

### 快速获取 API 密钥

#### OpenAI
```
1. 访问 https://platform.openai.com/api-keys
2. 点击"Create new secret key"
3. 复制密钥
```

#### Google Gemini
```
1. 访问 https://aistudio.google.com/app/apikey
2. 点击"Create API key"
3. 复制密钥
```

#### DeepSeek
```
1. 访问 https://platform.deepseek.com/api
2. 创建新密钥
3. 复制密钥
```

### 部署后添加密钥

1. 进入 Vercel 项目仪表板
2. 点击"Settings"
3. 点击"Environment Variables"
4. 添加密钥
5. 点击"Redeploy"

---

## 🧪 验证部署成功

部署后，测试您的应用：

### 方法 1：通过浏览器

1. 打开您的 Vercel 应用 URL
2. 验证页面加载
3. 在设置中输入 API 密钥
4. 尝试处理一些文本

### 方法 2：通过 API 调用

```bash
# 测试健康检查
curl https://your-app.vercel.app/api/health

# 测试获取提供商
curl https://your-app.vercel.app/api/providers

# 测试处理（需要替换变量）
curl -X POST https://your-app.vercel.app/api/process \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai",
    "content": "测试内容",
    "mode": "expand",
    "apiKey": "sk-your-key"
  }'
```

---

## ⚡ 常见问题

### Q: 部署失败了怎么办？

**查看日志：**
1. 在 Vercel 仪表板中打开项目
2. 点击"Deployments"选项卡
3. 查看最新部署的日志

**常见原因：**
- GitHub 认证失败 → 重新授权
- 依赖问题 → 检查 `package.json`
- Node.js 版本 → Vercel 应该自动处理

### Q: 应用部署成功但无法使用？

**检查清单：**
- [ ] 页面能否加载？
- [ ] 是否输入了 API 密钥？
- [ ] API 密钥有效吗？
- [ ] 网络连接正常吗？

### Q: 如何更新已部署的应用？

```bash
# 1. 修改本地代码
git add .
git commit -m "Update"

# 2. 推送到 GitHub
git push

# 3. Vercel 自动部署（如果已连接）
```

### Q: 可以使用自定义域名吗？

是的！在 Vercel 仪表板中：
1. 点击项目的"Domains"
2. 点击"Add"
3. 输入您的域名
4. 按照指示配置 DNS
5. 等待验证完成

### Q: 成本是多少？

- **Vercel**：免费（足以支持个人使用）
- **AI API**：按使用量计费
  - OpenAI：$0.0005/1K tokens
  - Gemini：免费配额 + 按需付费
  - DeepSeek：按需付费

**总计：** 对于个人使用，每月通常 $0-5

---

## 📚 更详细的指南

- [完整 Vercel 部署指南](VERCEL_DEPLOYMENT.md)
- [云函数和 API 完整文档](CLOUD_FUNCTIONS_DEPLOYMENT.md)
- [后端架构说明](BACKEND_ARCHITECTURE.md)
- [常见问题解答](BACKEND_FAQ.md)

---

## 🆘 需要帮助？

- 📖 查看[文档](README.md)
- 🐛 提交 GitHub Issue
- 💬 查看 Q&A 章节

---

## ✅ 部署检查清单

部署前：
- [ ] 拥有 Vercel 账户
- [ ] 拥有 GitHub 账户
- [ ] 项目代码已提交到 GitHub

部署中：
- [ ] 选择项目
- [ ] 选择分支
- [ ] 配置环境变量（可选）

部署后：
- [ ] 应用可访问
- [ ] API 端点响应正常
- [ ] 前端功能正常

---

**祝您部署顺利！** 🎉

有问题？查看完整文档或提交 Issue。
