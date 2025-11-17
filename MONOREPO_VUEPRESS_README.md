# ADI Writer - pnpm Monorepo + VuePress 文档系统

完整的项目结构升级实现指南。

## 🎯 快速开始

### 环境检查

```bash
# 检查必要的工具
node -v          # 需要 18+
pnpm -v          # 需要 8+
git --version
```

### 首次设置

```bash
# 1. 安装所有依赖
pnpm install

# 2. 启动开发服务器
pnpm dev

# 3. 在浏览器中打开
# - 主应用: http://localhost:5173
# - 文档: http://localhost:8080
```

## 📂 项目结构

```
adi-writer/
├── apps/
│   └── main/               # 主应用 (Vue 3 + TypeScript + Vite)
│       ├── src/
│       ├── dist/
│       ├── package.json
│       ├── vite.config.ts
│       └── tsconfig.json
│
├── docs/                   # VuePress 文档系统
│   ├── src/
│   │   ├── guide/         # 部署和开发指南
│   │   ├── api/           # API 参考文档
│   │   ├── faq/           # 常见问题
│   │   └── architecture/  # 架构文档
│   ├── .vuepress/
│   │   ├── config.ts      # VuePress 配置
│   │   └── styles/
│   └── package.json
│
├── api/                    # Vercel 函数
├── package.json            # 根 monorepo 配置
├── pnpm-workspace.yaml     # Monorepo 工作区定义
│
└── 说明文档/
    ├── MONOREPO_SETUP.md                      # Monorepo 详细指南
    ├── DOCS_GUIDE.md                          # VuePress 使用指南
    ├── VUEPRESS_MONOREPO_IMPLEMENTATION.md    # 实现总结
    └── MONOREPO_VUEPRESS_README.md            # 本文件
```

## 🚀 常用命令

### 开发命令

```bash
# 启动所有项目的开发服务器
pnpm dev

# 或单独启动
pnpm dev:main    # 主应用 (localhost:5173)
pnpm dev:docs    # 文档 (localhost:8080)
```

### 构建命令

```bash
# 构建所有项目
pnpm build

# 或单独构建
pnpm build:main
pnpm build:docs
```

### 工作区命令

```bash
# 为主应用添加依赖
pnpm -F main add package-name

# 为文档添加依赖
pnpm -F docs add package-name

# 查看所有依赖
pnpm ls

# 对所有工作区运行命令
pnpm -r lint
pnpm -r type-check
```

### 清理

```bash
# 清理所有缓存和 node_modules
pnpm clean
```

## 📚 文档系统

### 文档位置

VuePress 文档位于 `docs/` 目录：

```
docs/
├── README.md                    # 文档首页
├── src/
│   ├── guide/
│   │   ├── quickstart.md       # 快速开始 (5分钟部署)
│   │   ├── vercel-deployment.md  # 详细部署指南
│   │   ├── environment.md       # 环境变量配置
│   │   ├── local-development.md # 本地开发指南
│   │   ├── requirements.md      # 系统需求
│   │   ├── project-structure.md # 项目结构说明
│   │   └── deployment-checklist.md # 部署清单
│   ├── api/
│   │   ├── overview.md         # API 概览
│   │   ├── endpoints.md        # 完整端点列表
│   │   ├── errors.md           # 错误处理指南
│   │   └── rate-limiting.md    # 速率限制
│   ├── faq/
│   │   ├── index.md            # 常见问题
│   │   ├── common-issues.md    # 常见问题解决
│   │   └── troubleshooting.md  # 故障排除指南
│   └── architecture/
│       ├── index.md            # 架构概览
│       ├── backend.md          # 后端架构
│       └── frontend.md         # 前端架构
└── .vuepress/
    ├── config.ts               # VuePress 配置
    └── styles/index.css        # 自定义样式
```

### 添加新文档

1. 在 `docs/src/` 的相应目录创建 `.md` 文件
2. 在 `docs/.vuepress/config.ts` 中添加导航链接
3. 重启开发服务器

示例：

```bash
# 创建新文档
echo "# 新指南\n\n内容..." > docs/src/guide/new-guide.md

# 编辑配置（docs/.vuepress/config.ts）
# 在 navbar 或 sidebar 中添加链接
```

## 🌐 部署

### Vercel 部署 (主应用)

```bash
# 本地测试构建
pnpm build:main

# 在 Vercel Dashboard 中配置：
# Build Command: pnpm run build:main
# Output Directory: apps/main/dist
```

### 文档单独部署（可选）

```bash
# 创建新 Vercel 项目
# 连接同一 GitHub 仓库
# 配置：
#   Root Directory: docs
#   Build Command: pnpm run build:docs
#   Output Directory: docs/.vuepress/dist
```

## 📋 工作流示例

### 1. 添加新功能

```bash
# 创建新分支
git checkout -b feature/awesome-feature

# 启动开发
pnpm dev

# 修改代码
# ...

# 提交
git add .
git commit -m "Add awesome feature"
git push origin feature/awesome-feature
```

### 2. 编写文档

```bash
# 启动文档开发
pnpm dev:docs

# 创建新文档
touch docs/src/guide/my-guide.md

# 编辑并预览
# http://localhost:8080

# 提交更改
git add .
git commit -m "Add documentation for awesome feature"
```

### 3. 部署

```bash
# 确保所有测试通过
pnpm type-check
pnpm lint

# 构建
pnpm build

# 推送到 GitHub
git push origin main

# Vercel 会自动部署
```

## 🔍 项目分析

### monorepo 优势

✅ **统一管理**
- 一个 Git 仓库
- 统一的依赖版本
- 一致的代码标准

✅ **独立部署**
- 主应用可独立部署
- 文档可独立部署
- API 函数独立管理

✅ **代码复用**
- 在项目间共享代码
- 统一的工具配置
- 共享的 TypeScript 类型

✅ **开发效率**
- 一次安装，多个项目
- 统一的构建流程
- 简化的工作区命令

### VuePress 特性

✅ **功能完整**
- 响应式设计
- 全文搜索
- Markdown 支持
- 代码高亮

✅ **易于维护**
- 简单的 Markdown 文件
- 自动导航生成
- 版本管理友好

✅ **用户友好**
- 清晰的导航
- 快速搜索
- 移动端适配

## 📖 关键文档

| 文档 | 用途 |
|------|------|
| [MONOREPO_SETUP.md](./MONOREPO_SETUP.md) | 详细的 Monorepo 使用指南 |
| [DOCS_GUIDE.md](./DOCS_GUIDE.md) | VuePress 文档系统指南 |
| [VUEPRESS_MONOREPO_IMPLEMENTATION.md](./VUEPRESS_MONOREPO_IMPLEMENTATION.md) | 实现总结和统计 |
| [docs/README.md](./docs/README.md) | 文档首页和导航 |

## ⚡ 性能指标

- **安装时间**: < 2 分钟（首次）
- **开发启动**: < 5 秒
- **构建时间**: < 1 分钟
- **文档大小**: ~50 页
- **API 文档**: 16+ 个端点
- **常见问题**: 30+ Q&A

## 🐛 常见问题

### Q: 如何添加新的工作区？

A: 
1. 在 `apps/` 或 `packages/` 下创建新目录
2. 创建 `package.json`
3. 运行 `pnpm install`

### Q: 依赖冲突怎么办？

A: 在根 `package.json` 的 `pnpm.overrides` 中定义版本

### Q: 如何只构建主应用？

A: `pnpm build:main` 或 `pnpm -F main build`

### Q: 文档不显示怎么办？

A: 
1. 检查文件位置是否正确
2. 检查 `docs/.vuepress/config.ts` 配置
3. 重启开发服务器

更多问题见 [文档中心](/docs/faq/index.html)

## 📞 支持

- 📖 查看文档: `pnpm dev:docs`
- 🐛 提交 Issue: GitHub Issues
- 💬 讨论: GitHub Discussions

## 🎯 下一步

1. **本地开发**: `pnpm dev`
2. **查看文档**: `pnpm dev:docs`
3. **部署**: 按照 [Vercel 部署指南](/docs/src/guide/vercel-deployment.md) 进行
4. **贡献**: 查看 [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**快速链接**
- 🏠 [主页](http://localhost:5173)
- 📚 [文档](http://localhost:8080)
- 🔧 [配置文件](./pnpm-workspace.yaml)
- 📦 [包管理](./package.json)

**创建时间**: 2024年
**最后更新**: 2024年
**版本**: 1.0.0
