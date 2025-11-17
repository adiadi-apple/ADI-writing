# 项目结构

ADI Writer monorepo 项目的完整结构说明。

## 目录树

```
adi-writer/
├── apps/                          # 应用程序
│   └── main/                      # 主前端应用
│       ├── src/
│       │   ├── components/        # Vue 组件
│       │   ├── views/             # 页面视图
│       │   ├── stores/            # Pinia 状态管理
│       │   ├── style/             # 全局样式
│       │   ├── App.vue
│       │   └── main.ts
│       ├── index.html
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── package.json
│
├── api/                           # Vercel Serverless 函数
│   └── *.ts                       # API 端点
│
├── docs/                          # VuePress 文档
│   ├── .vuepress/
│   │   ├── config.ts              # VuePress 配置
│   │   ├── styles/                # 文档样式
│   │   └── public/                # 静态资源
│   ├── src/
│   │   ├── guide/                 # 指南文档
│   │   ├── api/                   # API 文档
│   │   ├── faq/                   # 常见问题
│   │   └── architecture/          # 架构文档
│   ├── README.md                  # 文档首页
│   └── package.json
│
├── .github/                       # GitHub 配置
│   └── workflows/                 # CI/CD 工作流
│
├── .vscode/                       # VS Code 配置
│   └── settings.json
│
├── node_modules/                  # 全局依赖 (monorepo)
├── .env.example                   # 环境变量模板
├── .env.production                # 生产环境变量
├── .gitignore                     # Git 忽略规则
├── .vercelignore                  # Vercel 忽略规则
├── vercel.json                    # Vercel 配置
├── package.json                   # 根 package.json
├── pnpm-workspace.yaml            # pnpm monorepo 配置
└── pnpm-lock.yaml                 # 依赖锁文件
```

## 工作区说明

### 主应用 (apps/main)

主要的 Vue 3 应用，包含用户界面。

**关键文件**:
- `src/App.vue` - 根组件
- `src/main.ts` - 入口文件
- `src/style.css` - 全局样式
- `vite.config.ts` - Vite 构建配置

**关键目录**:
- `src/components/` - 可复用组件
- `src/views/` - 页面级别组件
- `src/stores/` - Pinia 状态存储

### API 函数 (api/)

Vercel Serverless 函数端点。

**文件结构**:
```
api/
├── hello.ts          # GET /api/hello
├── chat.ts           # POST /api/chat
└── complete.ts       # POST /api/complete
```

**命名规则**:
- 文件名对应路由路径
- `api/hello.ts` → `/api/hello`
- `api/v1/chat.ts` → `/api/v1/chat`

### 文档 (docs/)

VuePress 2 文档站点。

**关键目录**:
- `.vuepress/config.ts` - 文档配置
- `src/guide/` - 用户指南
- `src/api/` - API 文档
- `src/faq/` - 常见问题

## 配置文件

### 根目录配置

| 文件 | 用途 |
|------|------|
| `package.json` | 根工作区配置 |
| `pnpm-workspace.yaml` | pnpm monorepo 配置 |
| `pnpm-lock.yaml` | 依赖锁文件 |
| `vercel.json` | Vercel 部署配置 |
| `.env.example` | 环境变量模板 |
| `.gitignore` | Git 忽略规则 |
| `.vercelignore` | Vercel 忽略规则 |

### 应用配置

| 文件 | 应用 | 用途 |
|------|------|------|
| `vite.config.ts` | apps/main | Vite 构建配置 |
| `tsconfig.json` | apps/main | TypeScript 配置 |
| `package.json` | apps/main | 应用依赖 |

### 文档配置

| 文件 | 用途 |
|------|------|
| `.vuepress/config.ts` | VuePress 配置 |
| `.vuepress/styles/` | 文档样式 |

## 依赖管理

### 根级依赖

```json
{
  "dependencies": {
    // 共享依赖
  },
  "devDependencies": {
    // 共享开发依赖
  }
}
```

### 应用级依赖

每个应用有自己的 `package.json`:
- `apps/main/package.json`
- `docs/package.json`

### 依赖查询

```bash
# 查看所有工作区的依赖
pnpm ls

# 查看特定工作区的依赖
pnpm -F main ls

# 查看重复的依赖
pnpm ls --depth=0 | grep -E "@|^─"
```

## 脚本命令

### 根级脚本

```bash
pnpm install      # 安装所有工作区的依赖
pnpm clean        # 清理所有缓存和 node_modules
pnpm -r build     # 构建所有应用
pnpm -r dev       # 开发所有应用
pnpm lint         # Lint 所有代码
pnpm type-check   # TypeScript 类型检查
```

### 应用级脚本

```bash
# 主应用
pnpm -F main dev       # 启动开发服务器
pnpm -F main build     # 构建应用
pnpm -F main preview   # 预览构建结果

# 文档
pnpm -F docs dev       # 启动文档开发服务器
pnpm -F docs build     # 构建文档
```

## 构建输出

### 主应用输出

```
apps/main/dist/
├── index.html          # 主 HTML 文件
├── assets/
│   ├── main.xxx.js     # 主 JavaScript
│   ├── main.xxx.css    # 主样式表
│   ├── vendor.xxx.js   # 第三方库
│   └── ...
```

### 文档输出

```
docs/.vuepress/dist/
├── index.html
├── guide/
├── api/
├── faq/
├── assets/
└── ...
```

## 编辑器集成

### VS Code 推荐扩展

```json
{
  "recommendations": [
    "vue.volar",
    "typescript.tslint-vue",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### 工作区设置

参考 `.vscode/settings.json` 获取推荐配置。

## 最佳实践

### 文件命名

- 组件: PascalCase (e.g., `MyComponent.vue`)
- 文件: kebab-case (e.g., `my-file.ts`)
- 变量: camelCase (e.g., `myVariable`)
- 常量: UPPER_SNAKE_CASE (e.g., `MY_CONSTANT`)

### 目录组织

- 功能相关的文件放在同一目录
- 避免过深的目录结构（最多 3-4 层）
- 使用明确的目录名称

### 导入路径

```typescript
// ✅ 推荐
import { useStore } from '@/stores'
import MyComponent from '@/components/MyComponent.vue'

// ❌ 避免
import { useStore } from '../../../stores'
import MyComponent from '../../components/MyComponent.vue'
```

## 相关文档

- [快速开始](/guide/quickstart.html)
- [本地开发](/guide/local-development.html)
- [Vercel 部署](/guide/vercel-deployment.html)
