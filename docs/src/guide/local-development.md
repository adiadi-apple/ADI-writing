# 本地开发指南

在本地环境中开发和测试 ADI Writer。

## 项目结构

```
adi-writer/
├── apps/
│   └── main/              # 主应用
│       ├── src/           # 源代码
│       ├── dist/          # 构建输出
│       └── package.json
├── api/                   # Vercel 函数
├── docs/                  # VuePress 文档
├── package.json           # 根 package.json
└── pnpm-workspace.yaml    # monorepo 配置
```

## 初始化

### 1. 克隆仓库

```bash
git clone https://github.com/yourusername/adi-writer.git
cd adi-writer
```

### 2. 安装依赖

```bash
# 使用 pnpm 安装所有工作区依赖
pnpm install

# 或者 (如果第一次使用 pnpm)
npm install -g pnpm
pnpm install
```

### 3. 配置环境

```bash
# 复制环境模板
cp .env.example .env

# 编辑 .env 文件
# 添加您的 OpenAI API 密钥
nano .env
```

## 开发工作流

### 启动开发服务器

```bash
# 启动所有项目的开发服务器
pnpm -r dev

# 或只启动主应用
pnpm -F main dev

# 或只启动文档
pnpm -F docs dev
```

### 访问本地服务

- **主应用**: http://localhost:5173
- **文档**: http://localhost:8080
- **API**: http://localhost:3001

### 实时重新加载

所有项目都已配置热模块替换（HMR），编辑文件后会自动重新加载。

## 常见开发任务

### 添加新依赖

```bash
# 添加到主应用
pnpm -F main add vue-router

# 添加到所有工作区
pnpm -r add axios

# 添加开发依赖
pnpm -F main add -D typescript
```

### 构建项目

```bash
# 构建所有项目
pnpm -r build

# 构建单个项目
pnpm -F main build

# 查看构建结果
pnpm -F main preview
```

### 代码质量检查

```bash
# 类型检查
pnpm type-check

# Linting
pnpm lint

# 修复 lint 问题
pnpm lint -- --fix
```

## 调试

### 浏览器开发者工具

1. 打开 http://localhost:5173
2. 按 `F12` 打开开发者工具
3. 使用 Vue DevTools 调试 Vue 组件

### Vue DevTools

```bash
# 推荐使用 VS Code 扩展
# 搜索并安装: "Vue - Official"
```

### 控制台日志

```typescript
// 在组件中添加日志
console.log('API response:', response)
console.error('Error:', error)
```

### 网络调试

1. 打开 DevTools Network 标签
2. 查看 API 请求和响应
3. 检查请求头和响应体

## 环境问题排除

### 端口已被占用

```bash
# 查看占用 5173 端口的进程
lsof -i :5173

# 杀死进程
kill -9 <PID>

# 或使用不同的端口
pnpm dev -- --port 5174
```

### 依赖冲突

```bash
# 清除所有 node_modules
pnpm clean

# 重新安装
pnpm install
```

### 缓存问题

```bash
# 清除 Vite 缓存
rm -rf node_modules/.vite

# 清除构建缓存
rm -rf dist

# 重启开发服务器
pnpm dev
```

## Git 工作流

### 创建新分支

```bash
# 创建功能分支
git checkout -b feature/awesome-feature

# 创建修复分支
git checkout -b fix/bug-fix
```

### 提交更改

```bash
# 查看更改
git status

# 暂存更改
git add .

# 提交
git commit -m "Add awesome feature"

# 推送
git push origin feature/awesome-feature
```

### 创建 Pull Request

1. 推送分支到 GitHub
2. 在 GitHub 上创建 Pull Request
3. 等待 CI 检查通过
4. 请求代码审查
5. 合并到 main

## 性能优化

### 开发模式优化

```bash
# 使用 --open 自动打开浏览器
pnpm dev -- --open

# 指定特定的 HMR 端口
pnpm dev -- --hmr.port 24678
```

### 构建分析

```bash
# 分析包大小
pnpm -F main build -- --report

# 查看构建详情
pnpm -F main build --verbose
```

## 相关文档

- [项目结构](/guide/project-structure.html)
- [系统需求](/guide/requirements.html)
- [快速开始](/guide/quickstart.html)
