# H5 AI Writer

一个开源免费的H5 AI写作网页，提供小说内容扩写和润色功能。

## 一键部署

### 部署主应用

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fh5-ai-writer&env=OPENAI_API_KEY,GEMINI_API_KEY,DEEPSEEK_API_KEY&envDescription=AI%20API%20Keys%20(Optional)&envLink=https://h5-ai-writer.vercel.app)

**注意：** API 密钥配置是**可选**的。您可以：
- **不配置** - 直接部署，用户在前端输入 API 密钥
- **配置** - 在 Vercel 环境变量中预配置 API 密钥

### 部署完整项目（包括文档）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fh5-ai-writer&env=VITE_OPENAI_API_KEY&envDescription=OpenAI%20API%20Key&envLink=https://platform.openai.com/api-keys)

**此部署包含：**
- 📱 主应用 (Vue 3 + TypeScript)
- 📚 VuePress 文档系统（/docs 路由）
- 🔌 Vercel Serverless API 函数
- 🔒 完整的生产环境配置

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

- Node.js 18+ （推荐使用 LTS 版本）
- pnpm 8+ （推荐使用最新版本）
- Git

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd adi-writer

# 安装所有工作区的依赖（使用 pnpm）
pnpm install
```

### 开发

```bash
# 启动所有项目的开发服务器
pnpm dev

# 或分别启动：
pnpm dev:main    # 启动主应用 (http://localhost:5173)
pnpm dev:docs    # 启动文档系统 (http://localhost:8080)
```

### 生产构建

```bash
# 构建所有项目
pnpm build

# 或分别构建：
pnpm build:main   # 构建主应用
pnpm build:docs   # 构建文档
```

构建输出将在 `apps/main/dist/` 和 `docs/.vuepress/dist/` 目录中。

### 类型检查

```bash
pnpm type-check
```

### 代码检查和修复

```bash
pnpm lint
```

### 项目结构

本项目采用 **pnpm monorepo** 结构：

```
adi-writer/
├── apps/main/          # 主应用 (Vue 3 + TypeScript + Vite)
├── docs/               # VuePress 文档系统
├── api/                # Vercel Serverless 函数
├── package.json        # 根 monorepo 配置
└── pnpm-workspace.yaml # 工作区定义
```

详细信息见 [MONOREPO_VUEPRESS_README.md](./MONOREPO_VUEPRESS_README.md) 和 [MONOREPO_SETUP.md](./MONOREPO_SETUP.md)

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

### 前端
- **框架** - Vue 3 (v3.3.4)
- **构建** - Vite (v5.0.0)
- **状态管理** - Pinia (v2.1.6)
- **HTTP** - Axios (v1.5.0)
- **语言** - TypeScript (4.9.5)

### 后端
- **运行时** - Node.js 18+
- **平台** - Vercel Serverless Functions
- **框架** - Express 或原生 Node.js

### 文档
- **文档框架** - VuePress 2 (v2.0.0-rc.14)
- **内容格式** - Markdown
- **搜索** - VuePress Search Plugin

### 包管理
- **包管理器** - pnpm (v8+)
- **Monorepo** - pnpm workspaces

## 项目结构

```
adi-writer/ (pnpm monorepo)
│
├── apps/
│   └── main/                    # 主应用 (Vue 3 + TypeScript + Vite)
│       ├── src/
│       │   ├── components/      # Vue 组件
│       │   ├── views/          # 页面视图
│       │   ├── stores/         # Pinia 状态管理
│       │   ├── style/          # 全局样式
│       │   ├── App.vue         # 根组件
│       │   └── main.ts         # 应用入口
│       ├── dist/               # 构建输出
│       ├── vite.config.ts      # Vite 配置
│       ├── tsconfig.json       # TypeScript 配置
│       └── package.json        # 工作区配置
│
├── docs/                        # VuePress 文档系统
│   ├── src/
│   │   ├── guide/              # 部署和开发指南
│   │   ├── api/                # API 参考文档
│   │   ├── faq/                # 常见问题
│   │   └── architecture/       # 架构文档
│   ├── .vuepress/
│   │   ├── config.ts           # VuePress 配置
│   │   └── styles/             # 自定义样式
│   ├── README.md               # 文档首页
│   └── package.json            # 工作区配置
│
├── api/                         # Vercel Serverless 函数
│   ├── complete.ts             # 文本补全
│   ├── expand.ts               # 文本扩展
│   ├── refine.ts               # 文本润色
│   └── ...
│
├── package.json                 # 根 monorepo 配置
├── pnpm-workspace.yaml          # 工作区定义
├── vercel.json                  # Vercel 部署配置
│
└── 说明文档/
    ├── MONOREPO_SETUP.md        # Monorepo 使用指南
    ├── DOCS_GUIDE.md            # VuePress 文档指南
    └── 其他文档...
```

## 贡献指南

欢迎提交Issue和Pull Request！

### 开发工作流

```bash
# 1. Fork 和 Clone
git clone https://github.com/your-username/adi-writer.git
cd adi-writer

# 2. 安装依赖
pnpm install

# 3. 创建特性分支
git checkout -b feat/your-feature-name

# 4. 启动开发服务器
pnpm dev                  # 启动所有项目
# 或分别启动：
pnpm dev:main           # 主应用
pnpm dev:docs           # 文档

# 5. 修改代码并测试
# 修改你的代码...
pnpm type-check         # 检查类型
pnpm lint               # 检查代码风格

# 6. 提交更改
git add .
git commit -m "feat: Add your feature"
git push origin feat/your-feature-name

# 7. 创建 Pull Request
```

### 代码规范

- 使用 TypeScript
- 遵循 ESLint 规则
- 为 commit 消息添加前缀（feat:, fix:, docs:, etc.）
- 在 PR 中清晰地描述你的更改

### 文档贡献

如果想为文档做出贡献：

```bash
# 1. 创建新文档或编辑现有文档
# 文档位置: docs/src/

# 2. 更新 docs/.vuepress/config.ts 中的导航
# 在 navbar 或 sidebar 中添加你的文档链接

# 3. 本地预览
pnpm dev:docs

# 4. 提交 PR
```

详见 [DOCS_GUIDE.md](DOCS_GUIDE.md)

## 许可证

MIT License - 详见 LICENSE 文件

## 部署

### Vercel 一键部署（推荐）

**最简单的部署方式 - 只需 3 步：**

1. 点击上方的 **"Deploy with Vercel"** 按钮（部署完整项目包括文档）
2. 授权并跳过或配置环境变量（可选）
3. 点击部署 - 完成！

### 部署内容

当您点击 "Deploy with Vercel" 按钮时，会部署：

- ✅ **主应用** (Vue 3 + TypeScript)
  - 访问：`https://your-project.vercel.app`
  
- ✅ **VuePress 文档系统**
  - 访问：`https://your-project.vercel.app/docs`
  - 包含完整的部署指南、API 文档、常见问题等

- ✅ **Vercel Serverless 函数**
  - API 端点：`https://your-project.vercel.app/api/*`

- ✅ **完整的 monorepo 配置**
  - 使用 pnpm workspaces
  - 独立的工作区管理

### 文档系统

本项目集成了 **VuePress 文档系统**，包含：

📖 **部署指南** (8 个文档)
- 快速开始（5 分钟部署）
- Vercel 部署详细教程
- 环境变量配置
- 本地开发指南
- 系统需求
- 项目结构说明
- 部署清单
- Monorepo 使用指南

📚 **API 文档** (4 个文档)
- API 概览
- 完整端点列表
- 错误处理指南
- 速率限制说明

❓ **常见问题** (3 个文档)
- 常见问题解答
- 常见问题解决
- 故障排除指南

🏗️ **架构文档** (3 个文档)
- 系统架构
- 后端设计
- 前端设计

**本地查看文档：**
```bash
pnpm dev:docs
# 访问 http://localhost:8080
```

### 单独部署文档（可选）

如果想在不同的 URL 部署文档，可以创建新的 Vercel 项目：

1. 在 Vercel Dashboard 创建新项目
2. 连接同一个 GitHub 仓库
3. 配置：
   - Root Directory: `docs`
   - Build Command: `pnpm run build:docs`
   - Output Directory: `docs/.vuepress/dist`

### 其他部署信息

- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - 详细部署指南
- [CLOUD_FUNCTIONS_DEPLOYMENT.md](CLOUD_FUNCTIONS_DEPLOYMENT.md) - 云函数完整文档
- [MONOREPO_VUEPRESS_README.md](MONOREPO_VUEPRESS_README.md) - Monorepo + VuePress 指南
- [DEPLOYMENT.md](DEPLOYMENT.md) - 其他部署选项

## 架构

### Monorepo 架构

本项目采用 **pnpm workspaces monorepo** 结构：

```
adi-writer/
├── apps/
│   └── main/          # 主应用 (Vue 3 + TypeScript + Vite)
├── docs/              # VuePress 文档系统
├── api/               # Vercel Serverless 函数
├── package.json       # 根 monorepo 配置
└── pnpm-workspace.yaml
```

**优势：**
- 统一的依赖管理
- 独立的项目配置
- 简化的工作区命令
- 灵活的部署选项

### 前后端分离架构

- **前端**: Vue 3 + TypeScript (apps/main)
  - 组件化架构
  - Pinia 状态管理
  - Vite 快速构建
  
- **后端**: Vercel Serverless Functions (api/)
  - Node.js 运行时
  - 处理 AI API 调用
  - 环境变量管理

- **文档**: VuePress 2 (docs/)
  - 完整的部署和开发指南
  - API 参考文档
  - 常见问题和故障排除

详见 [BACKEND_ARCHITECTURE.md](BACKEND_ARCHITECTURE.md) 和 [MONOREPO_SETUP.md](MONOREPO_SETUP.md)

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

### Q: 什么是 pnpm monorepo？
A: 本项目使用 pnpm workspaces 来管理多个相关的项目（主应用、文档、API）。优点是：
- 共享依赖，节省磁盘空间
- 统一的版本管理
- 简化的开发工作流
- 使用 `pnpm -F main dev` 启动特定项目

详见 [MONOREPO_SETUP.md](MONOREPO_SETUP.md)

### Q: 如何查看文档？
A: 有两种方式：
1. **本地开发**：`pnpm dev:docs` 后访问 http://localhost:8080
2. **部署后**：访问 `https://your-project.vercel.app/docs`

文档包含完整的部署指南、API 参考、常见问题等。详见 [DOCS_GUIDE.md](DOCS_GUIDE.md)

### Q: 部署时会自动部署文档吗？
A: 是的！当您点击 "Deploy with Vercel" 按钮时，会同时部署：
- 主应用（主页）
- VuePress 文档（/docs 路由）
- API 函数（/api 路由）

完成部署后，可以访问 `https://your-project.vercel.app/docs` 查看文档。

### Q: 如何单独部署文档到不同的 URL？
A: 可以创建新的 Vercel 项目专门用于文档，配置方法见 [README.md - 单独部署文档](./README.md#单独部署文档可选)

## 重要链接

📖 **快速参考和指南**
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - ⭐ 快速命令参考（推荐新手查看）
- [VERCEL_DEPLOYMENT_CHECKLIST.md](./VERCEL_DEPLOYMENT_CHECKLIST.md) - 部署前检查清单
- [MONOREPO_VUEPRESS_README.md](./MONOREPO_VUEPRESS_README.md) - Monorepo + VuePress 概览

📚 **详细文档**
- [MONOREPO_SETUP.md](./MONOREPO_SETUP.md) - pnpm Monorepo 详细指南
- [DOCS_GUIDE.md](./DOCS_GUIDE.md) - VuePress 文档系统指南
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Vercel 部署指南
- [docs/README.md](./docs/README.md) - 在线文档中心首页

🔗 **外部链接**
- [Vue 3 文档](https://vuejs.org)
- [VuePress 2 文档](https://v2.vuepress.vuejs.org/zh/)
- [pnpm 文档](https://pnpm.io)
- [Vercel 文档](https://vercel.com/docs)

## 联系方式

如有任何问题或建议，欢迎通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件
- 查看 [常见问题](./README.md#常见问题) 部分

## 致谢

感谢所有使用和支持这个项目的人！

特别感谢：
- Vue 3 社区
- VuePress 项目
- pnpm 项目
- Vercel 平台

---

**版本**: 1.0.0 (Monorepo + VuePress)

**免责声明**：本应用需要用户提供有效的API密钥。使用AI服务可能会产生费用，请根据您的使用情况在相应平台上选择合适的计费方案。
