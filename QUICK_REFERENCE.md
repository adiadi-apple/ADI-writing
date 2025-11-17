# 快速参考指南

ADI Writer - pnpm Monorepo + VuePress 快速命令参考

## 🚀 一键部署

### 在 README.md 中找到部署按钮

**部署完整项目（包括文档）** - 推荐方式
- 点击"Deploy with Vercel"按钮
- 自动部署主应用、文档、API 函数
- 访问：https://your-project.vercel.app/docs

---

## 💻 本地开发快速命令

### 初始化

```bash
# 克隆并安装
git clone <repository-url>
cd adi-writer
pnpm install
```

### 启动开发服务器

```bash
# 启动所有项目
pnpm dev

# 或启动特定项目
pnpm dev:main    # 主应用 (port 5173)
pnpm dev:docs    # 文档 (port 8080)
```

### 构建

```bash
# 构建所有项目
pnpm build

# 或构建特定项目
pnpm build:main
pnpm build:docs
```

### 质量检查

```bash
# 类型检查
pnpm type-check

# 代码检查
pnpm lint
```

---

## 📦 依赖管理

### 添加依赖

```bash
# 添加到主应用
pnpm -F main add package-name

# 添加到文档
pnpm -F docs add package-name

# 查看所有依赖
pnpm ls
```

### Monorepo 特定命令

```bash
# 对所有工作区运行命令
pnpm -r build

# 对特定工作区运行
pnpm -F main build

# 清理所有缓存
pnpm clean
```

---

## 📚 文档系统

### 本地查看文档

```bash
pnpm dev:docs
# 访问 http://localhost:8080
```

### 添加新文档

1. 创建文档：`docs/src/guide/my-guide.md`
2. 编辑配置：`docs/.vuepress/config.ts`
3. 在 navbar 或 sidebar 中添加链接
4. 重启开发服务器

### 文档位置

```
docs/src/
├── guide/         # 部署和开发指南
├── api/           # API 参考
├── faq/           # 常见问题
└── architecture/  # 架构文档
```

---

## 🌐 部署流程

### Vercel 部署（推荐）

```bash
# 1. 本地测试
pnpm build
pnpm preview

# 2. 推送到 GitHub
git push origin main

# 3. Vercel 自动部署
# 查看 Vercel Dashboard
```

### 部署后访问

- 主应用：https://your-project.vercel.app
- 文档：https://your-project.vercel.app/docs
- API：https://your-project.vercel.app/api/*

---

## 📋 常用链接

### 本地服务

| 服务 | 地址 |
|------|------|
| 主应用 | http://localhost:5173 |
| 文档 | http://localhost:8080 |
| API | http://localhost:3001 |

### 重要文档

| 文档 | 用途 |
|------|------|
| [README.md](./README.md) | 项目介绍 |
| [MONOREPO_SETUP.md](./MONOREPO_SETUP.md) | Monorepo 详细指南 |
| [DOCS_GUIDE.md](./DOCS_GUIDE.md) | 文档系统指南 |
| [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) | 部署指南 |

---

## 🔧 故障排除

### 端口被占用

```bash
# 使用不同端口
pnpm dev -- --port 5174
```

### 依赖冲突

```bash
# 完全清理并重新安装
pnpm clean
pnpm install
```

### 构建失败

```bash
# 检查类型错误
pnpm type-check

# 检查 lint 错误
pnpm lint -- --fix

# 清除缓存后重新构建
rm -rf dist
pnpm build
```

---

## 📝 Git 工作流

### 创建新特性分支

```bash
git checkout -b feat/your-feature
pnpm dev
# ... 修改代码 ...
git add .
git commit -m "feat: add your feature"
git push origin feat/your-feature
```

### Commit 消息规范

- `feat:` - 新功能
- `fix:` - 修复
- `docs:` - 文档
- `style:` - 格式
- `refactor:` - 重构
- `test:` - 测试

---

## 🎯 项目结构

```
adi-writer/
├── apps/main/          # 主应用
├── docs/               # VuePress 文档
├── api/                # Vercel 函数
├── package.json        # 根配置
└── pnpm-workspace.yaml # 工作区定义
```

---

## 📞 需要帮助？

1. 查看 [常见问题](./README.md#常见问题)
2. 查看相关文档
3. 提交 GitHub Issue

---

**版本**: 1.0.0
**最后更新**: 2024年

快速链接：[README](./README.md) | [部署](./VERCEL_DEPLOYMENT.md) | [Monorepo](./MONOREPO_SETUP.md) | [文档](./DOCS_GUIDE.md)
