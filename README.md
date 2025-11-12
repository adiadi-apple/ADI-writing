# H5 AI Writer

一个开源免费的H5 AI写作网页，提供小说内容扩写和润色功能。

## 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fh5-ai-writer&env=OPENAI_API_KEY,GEMINI_API_KEY,DEEPSEEK_API_KEY&envDescription=AI%20API%20Keys%20(Optional)&envLink=https://h5-ai-writer.vercel.app)

**注意：** API 密钥配置是**可选**的。您可以：
- **不配置** - 直接部署，用户在前端输入 API 密钥
- **配置** - 在 Vercel 环境变量中预配置 API 密钥

## 功能特性

- ✨ **小说内容扩写** - 智能扩展您的创意内容
- 🔧 **文本润色** - 改进表达方式和可读性
- 🤖 **多AI模型支持**
  - OpenAI (GPT-3.5 Turbo)
  - Google Gemini (Google AI Studio)
  - DeepSeek
- 🔐 **后端API保护** - API密钥存储在服务器端，安全性更高
- 📝 **文档管理** - 创建、编辑和管理多个文档
- 🎨 **简洁易用的界面** - 现代化的UI设计
- 🌐 **完全开源** - 免费使用和修改
- 🚀 **Vercel部署** - 一键部署到生产环境

## 快速开始

### 前置要求

- Node.js 16+ 
- npm 或 yarn 或 pnpm

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd h5-ai-writer

# 安装依赖
npm install
# 或
yarn install
# 或
pnpm install
```

### 开发

```bash
npm run dev
```

访问 `http://localhost:5173` 查看应用。

### 生产构建

```bash
npm run build
```

构建输出将在 `dist/` 目录中。

### 类型检查

```bash
npm run type-check
```

## 使用说明

### 1. API密钥配置

首次使用时，您需要配置AI模型的API密钥：

#### OpenAI
1. 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 创建新的API密钥
3. 将密钥粘贴到应用中

#### Google Gemini
1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 创建新的API密钥
3. 将密钥粘贴到应用中

#### DeepSeek
1. 访问 [DeepSeek Platform](https://platform.deepseek.com/api)
2. 创建新的API密钥
3. 将密钥粘贴到应用中

### 2. 创建文档

点击左侧"新建文档"按钮创建新的写作文档。

### 3. 输入内容

在文本框中输入或粘贴您要扩写或润色的内容。

### 4. 选择操作

- **扩写** - 增加细节、对话和场景描写，字数增加50%以上
- **润色** - 改进表达、增强可读性、修正语法

### 5. 获取结果

处理完成后，结果将显示在右侧的结果区域，您可以复制使用。

## 系统提示词

应用使用了优化的系统提示词，确保：

- 专业的AI写作辅助
- 保持文学质量
- 避免低质描写
- 自然的表达方式
- 防止提示词泄露
- 内容安全合规

## 数据隐私

- 🔒 您的API密钥存储在 Vercel 后端服务器环境变量中（可选）
- 🔒 或在本地浏览器中存储（如使用客户端模式）
- 🔒 文档内容完全保存在本地浏览器
- 🔒 无中央数据库存储用户数据
- 🔒 使用浏览器的 localStorage 机制
- 🔒 所有通信使用 HTTPS 加密

## 浏览器兼容性

- Chrome/Edge (推荐)
- Firefox
- Safari
- 其他现代浏览器

## 技术栈

- **前端框架** - Vue 3
- **构建工具** - Vite
- **状态管理** - Pinia
- **HTTP客户端** - Axios
- **语言** - TypeScript

## 项目结构

```
h5-ai-writer/
├── src/
│   ├── components/      # 可复用组件
│   ├── views/          # 页面视图
│   ├── stores/         # Pinia状态管理
│   ├── services/       # API和业务逻辑
│   ├── router/         # 路由配置
│   ├── App.vue         # 根组件
│   ├── main.ts         # 应用入口
│   └── style.css       # 全局样式
├── index.html          # HTML模板
├── vite.config.ts      # Vite配置
├── tsconfig.json       # TypeScript配置
├── package.json        # 项目依赖
└── README.md           # 项目文档
```

## 贡献指南

欢迎提交Issue和Pull Request！

## 许可证

MIT License - 详见 LICENSE 文件

## 部署

### Vercel 一键部署（推荐）

**最简单的部署方式 - 只需 3 步：**

1. 点击上方的 "Deploy with Vercel" 按钮
2. 授权并跳过或配置环境变量（可选）
3. 点击部署 - 完成！

**如果需要详细信息：**
- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - 详细部署指南
- [CLOUD_FUNCTIONS_DEPLOYMENT.md](CLOUD_FUNCTIONS_DEPLOYMENT.md) - 云函数完整文档

### 快速部署（无需 API 密钥）

1. 点击"Deploy with Vercel"按钮
2. 在环境变量步骤，点击"Skip"或直接部署
3. 等待 2-5 分钟
4. 应用上线！用户可以在前端输入 API 密钥

### 其他部署选项

- GitHub Pages - 静态托管
- Netlify - 全栈部署
- 自己的服务器 - Docker 容器化

详见 [DEPLOYMENT.md](DEPLOYMENT.md)

## 架构

本项目采用前后分离架构：

- **前端**: Vue 3 + TypeScript (部署在 CDN)
- **后端**: Serverless Functions (处理 AI API 调用)

详见 [BACKEND_ARCHITECTURE.md](BACKEND_ARCHITECTURE.md)

## 常见问题

### Q: 部署时一定要填写 API 密钥吗？
A: 不需要。您可以直接部署而无需任何 API 密钥。应用会正常运行，用户可以在前端输入 API 密钥。稍后也可以在 Vercel 环境变量中配置密钥。

### Q: 可以在 Vercel 免费计划上运行吗？
A: 是的，完全可以。Vercel 免费计划包括足够的 Serverless Functions 调用，足以支持个人使用。

### Q: 后端会存储我的数据吗？
A: 不会。后端只转发请求到 AI API，不存储任何用户数据。

### Q: 我的文档会被保存吗？
A: 您的所有文档都保存在本地浏览器中。清除浏览器缓存会导致数据丢失。

### Q: 如何导出我的文档？
A: 您可以直接复制和粘贴文档内容。

### Q: 支持离线使用吗？
A: 前端可以离线使用，但处理内容需要网络连接和有效的 API 密钥。

### Q: 可以自定义系统提示词吗？
A: 是的，可以编辑 `api/process.ts` 文件中的提示词（需要 fork 项目）。

### Q: API 密钥在哪里？
A: 有两种模式：
1. **用户输入模式**：用户在前端输入 API 密钥，存储在浏览器本地
2. **服务器模式**：密钥存储在 Vercel 环境变量中（更安全，推荐团队使用）

## 联系方式

如有任何问题或建议，欢迎通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件

## 致谢

感谢所有使用和支持这个项目的人！

---

**免责声明**：本应用需要用户提供有效的API密钥。使用AI服务可能会产生费用，请根据您的使用情况在相应平台上选择合适的计费方案。
