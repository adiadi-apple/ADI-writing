# VuePress 文档系统指南

本项目集成了 VuePress 2 文档系统，提供完整的部署和使用文档。

## 快速开始

### 启动文档开发服务器

```bash
# 方式一：启动文档服务
pnpm dev:docs

# 方式二：启动所有服务（包括文档）
pnpm dev

# 方式三：使用完整命令
pnpm -F docs dev
```

访问 `http://localhost:8080` 查看文档。

### 构建文档

```bash
# 构建文档
pnpm build:docs

# 或使用完整命令
pnpm -F docs build
```

构建输出在 `docs/.vuepress/dist/` 目录。

## 文档结构

```
docs/
├── .vuepress/                   # VuePress 配置目录
│   ├── config.ts                # VuePress 主配置
│   ├── styles/
│   │   └── index.css            # 自定义样式
│   ├── public/                  # 静态资源
│   └── dist/                    # 构建输出
│
├── src/                         # 文档源代码
│   ├── guide/
│   │   ├── quickstart.md        # 快速开始
│   │   ├── vercel-deployment.md # Vercel 部署
│   │   ├── environment.md       # 环境配置
│   │   ├── local-development.md # 本地开发
│   │   ├── requirements.md      # 系统需求
│   │   ├── project-structure.md # 项目结构
│   │   └── deployment-checklist.md
│   │
│   ├── api/
│   │   ├── overview.md          # API 概览
│   │   ├── endpoints.md         # 端点列表
│   │   ├── errors.md            # 错误处理
│   │   └── rate-limiting.md     # 速率限制
│   │
│   ├── faq/
│   │   ├── index.md             # 常见问题
│   │   ├── common-issues.md     # 常见问题解决
│   │   └── troubleshooting.md   # 故障排除
│   │
│   └── architecture/
│       ├── index.md             # 架构概览
│       ├── backend.md           # 后端架构
│       └── frontend.md          # 前端架构
│
├── README.md                    # 文档首页
└── package.json                 # 文档工作区配置
```

## 添加新文档

### 1. 创建 Markdown 文件

在 `docs/src/` 的相应目录下创建 `.md` 文件：

```bash
# 例如，添加一个新的指南
touch docs/src/guide/new-guide.md
```

### 2. 编写 Markdown 内容

```markdown
# 新指南标题

这是新指南的内容。

## 小标题

更多内容...

### 更小的标题

详细说明...
```

### 3. 更新导航配置

编辑 `docs/.vuepress/config.ts`，在相应的 navbar 和 sidebar 中添加链接：

```typescript
{
  text: '指南',
  children: [
    {
      text: '新指南',
      link: '/guide/new-guide.html',
    }
  ]
},
```

### 4. 重新启动开发服务器

```bash
pnpm dev:docs
```

## 文档配置

### VuePress 配置 (docs/.vuepress/config.ts)

主要配置项：

```typescript
export default defineUserConfig({
  lang: 'zh-CN',                    // 语言
  title: 'ADI Writer 文档',          // 网站标题
  description: '文档描述',
  base: '/docs/',                   // 基础路径
  
  theme: defaultTheme({
    logo: '/logo.png',              // Logo 图片
    navbar: [...],                  // 导航栏配置
    sidebar: {...},                 // 侧边栏配置
  }),
  
  plugins: [
    searchPlugin({...}),            // 搜索插件
  ],
})
```

### 自定义样式

编辑 `docs/.vuepress/styles/index.css`：

```css
:root {
  --c-primary: #007aff;
  --c-bg: #f5f5f7;
  --c-text: #1d1d1f;
}

/* 自定义样式 */
.navbar {
  background-color: var(--c-bg);
}
```

## 部署文档

### 部署到 Vercel

#### 方式一：同主应用部署

文档可以作为主应用的一部分部署（`/docs` 路由）。

#### 方式二：单独部署

1. **创建新 Vercel 项目**

```bash
# 在 vercel.com 创建新项目
# 连接同一个 GitHub 仓库
```

2. **配置构建设置**

- Root Directory: `docs`
- Build Command: `pnpm run build:docs`
- Output Directory: `docs/.vuepress/dist`

3. **自动部署**

推送到 GitHub 时，Vercel 会自动部署文档。

### 部署到其他平台

#### GitHub Pages

```bash
# 在 docs/.vuepress/config.ts 中
export default defineUserConfig({
  base: '/adi-writer/',  // 对应仓库名
  // ...
})

# 构建
pnpm build:docs

# 推送 dist 目录到 gh-pages 分支
git subtree push --prefix docs/.vuepress/dist origin gh-pages
```

#### Netlify

1. 连接 GitHub 仓库
2. 设置：
   - Build Command: `pnpm run build:docs`
   - Publish Directory: `docs/.vuepress/dist`

## 编辑最佳实践

### Markdown 格式

```markdown
# 一级标题

## 二级标题

### 三级标题

**粗体**
*斜体*
~~删除线~~

`inline code`

[链接文本](/路径/文件.html)

```代码块
code here
```

- 列表项 1
- 列表项 2
- 列表项 3

1. 有序项 1
2. 有序项 2
3. 有序项 3

| 表头 1 | 表头 2 |
|--------|--------|
| 单元格 | 单元格 |

> 引用块
> 多行引用
```

### 内部链接

```markdown
<!-- 相对路径 -->
[快速开始](/guide/quickstart.html)

<!-- 带锚点的链接 -->
[API 概览](/api/overview.html#基础信息)

<!-- 另一个文档中的标题 -->
[查看部署指南](/guide/vercel-deployment.html#Vercel-配置文件)
```

### 代码示例

```markdown
\`\`\`bash
# Bash 脚本
pnpm install
pnpm dev
\`\`\`

\`\`\`typescript
// TypeScript 代码
interface User {
  name: string
  age: number
}
\`\`\`

\`\`\`json
{
  "key": "value"
}
\`\`\`
```

## 搜索功能

文档已配置搜索插件，用户可以快速搜索文档内容。

搜索功能在 `docs/.vuepress/config.ts` 中配置：

```typescript
plugins: [
  searchPlugin({
    locales: {
      '/': {
        placeholder: '搜索文档',
      },
    },
  }),
],
```

## 性能优化

### 构建优化

```bash
# 检查构建大小
pnpm build:docs

# 查看输出目录大小
du -sh docs/.vuepress/dist
```

### 加载优化

- VuePress 自动代码分割
- 启用 CDN 缓存
- 压缩静态资源

## 故障排除

### 文档不显示

```bash
# 1. 确保文件在正确的位置
ls -la docs/src/guide/

# 2. 检查配置
cat docs/.vuepress/config.ts

# 3. 清除缓存并重新启动
rm -rf docs/.vuepress/.temp
pnpm dev:docs
```

### 链接失效

```bash
# 1. 检查文件是否存在
ls -la docs/src/path/to/file.md

# 2. 检查链接格式（应该是 .html 而不是 .md）
# ✅ [文本](/path/file.html)
# ❌ [文本](/path/file.md)

# 3. 确保链接路径正确
# ✅ [文本](/guide/quickstart.html)
# ❌ [文本](/docs/src/guide/quickstart.html)
```

### 样式不应用

```bash
# 1. 检查样式文件
cat docs/.vuepress/styles/index.css

# 2. 清除构建缓存
rm -rf docs/.vuepress/.temp

# 3. 重新启动开发服务器
pnpm dev:docs
```

## 相关命令

```bash
# 开发相关
pnpm dev:docs                 # 启动文档开发服务器
pnpm build:docs              # 构建文档
pnpm preview                 # 预览主应用（不含文档）

# 包管理
pnpm -F docs add <package>   # 为文档添加依赖
pnpm -F docs ls              # 查看文档依赖

# 代码质量
pnpm type-check              # 类型检查
pnpm lint                    # 代码检查
```

## VuePress 主题

当前使用 VuePress 默认主题。如需自定义主题，参考：

- [VuePress 主题文档](https://v2.vuepress.vuejs.org/zh/guide/theme.html)
- [社区主题](https://vuepress.vuejs.org/zh/plugins/)

## 常用资源

- [VuePress 2 官方文档](https://v2.vuepress.vuejs.org/zh/)
- [Markdown 语法指南](https://guides.github.com/features/mastering-markdown/)
- [VuePress 最佳实践](https://v2.vuepress.vuejs.org/zh/guide/best-practices.html)

## 相关文档

- [快速开始](/guide/quickstart.html)
- [Monorepo 设置](/MONOREPO_SETUP.html)
- [本地开发](/guide/local-development.html)
- [项目结构](/guide/project-structure.html)
