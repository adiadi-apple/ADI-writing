# pnpm Monorepo 设置指南

本项目已升级为使用 pnpm workspaces 的 monorepo 结构。本文档介绍如何使用这个 monorepo 结构。

## 项目结构

```
adi-writer/
├── apps/
│   └── main/                    # 主应用
│       ├── src/
│       ├── dist/
│       ├── package.json
│       ├── vite.config.ts
│       └── tsconfig.json
├── api/                         # Vercel API 函数
├── docs/                        # VuePress 文档
│   ├── src/
│   ├── .vuepress/
│   └── package.json
├── package.json                 # 根 monorepo package.json
├── pnpm-workspace.yaml          # pnpm monorepo 配置
└── pnpm-lock.yaml
```

## pnpm-workspace.yaml 配置

```yaml
packages:
  - 'apps/*'
  - 'docs'
```

这个配置告诉 pnpm：
- 在 `apps/` 目录下寻找工作区包
- 将 `docs/` 目录作为独立工作区

## 常用命令

### 安装依赖

```bash
# 安装所有工作区的依赖（在根目录运行）
pnpm install

# 为特定工作区安装依赖
pnpm -F main install
pnpm -F docs install

# 为特定工作区添加依赖
pnpm -F main add vue-router
pnpm -F docs add vuepress
```

### 开发命令

```bash
# 启动所有项目的开发服务器
pnpm dev

# 启动特定项目
pnpm dev:main          # 主应用
pnpm dev:docs          # 文档

# 或使用完整命令
pnpm -F main dev
pnpm -F docs dev
```

### 构建命令

```bash
# 构建所有项目
pnpm build

# 构建特定项目
pnpm build:main        # 主应用
pnpm build:docs        # 文档

# 或使用完整命令
pnpm -F main build
pnpm -F docs build
```

### 其他命令

```bash
# 类型检查所有项目
pnpm type-check

# Lint 所有项目
pnpm lint

# 清理所有缓存
pnpm clean

# 查看依赖关系
pnpm ls
```

## 工作区命令参数

### -F（filter）参数

```bash
# 精确匹配包名称
pnpm -F main <command>

# 可以组合多个包
pnpm -F main -F docs <command>

# 排除某个包
pnpm -r --filter '!main' <command>
```

### -r（recursive）参数

```bash
# 对所有包运行命令
pnpm -r <command>

# 对所有包构建
pnpm -r build

# 对所有包安装依赖
pnpm -r install
```

## 依赖管理

### 共享依赖

将共享的依赖添加到根 `package.json`：

```json
{
  "devDependencies": {
    "typescript": "~4.9.5",
    "eslint": "^8.52.0"
  }
}
```

所有工作区都可以使用这些依赖。

### 工作区依赖

各工作区的特定依赖在其 `package.json` 中定义：

```json
// apps/main/package.json
{
  "dependencies": {
    "vue": "^3.3.4",
    "pinia": "^2.1.6"
  }
}

// docs/package.json
{
  "dependencies": {
    "vuepress": "2.0.0-rc.14"
  }
}
```

### 查看依赖

```bash
# 查看所有工作区的依赖树
pnpm ls

# 查看特定工作区的依赖
pnpm -F main ls

# 查看是否有重复的依赖
pnpm ls --depth=0 | grep -E "@|^─"
```

## Vercel 部署

### 配置 Vercel

在 `vercel.json` 中配置：

```json
{
  "buildCommand": "pnpm run build:main",
  "outputDirectory": "apps/main/dist"
}
```

### 自动部署

1. 将仓库连接到 Vercel
2. Vercel 会自动：
   - 检测 pnpm 环境
   - 运行 `pnpm run build:main`
   - 部署 `apps/main/dist` 目录

### 部署文档（可选）

文档可以单独部署到另一个 Vercel 项目：

1. 创建新的 Vercel 项目
2. 连接同一个 Git 仓库
3. 设置根目录为 `docs`
4. 构建命令为 `pnpm run build:docs`

## 常见任务

### 添加新的工作区

1. 在 `apps/` 目录下创建新文件夹
2. 创建 `package.json`
3. 创建必要的配置文件
4. 运行 `pnpm install` 同步工作区

### 在工作区之间共享代码

创建一个共享包（可选）：

```
packages/
├── shared/
│   ├── src/
│   └── package.json
```

更新 `pnpm-workspace.yaml`：

```yaml
packages:
  - 'apps/*'
  - 'docs'
  - 'packages/*'
```

在工作区中引用：

```json
{
  "dependencies": {
    "@adi-writer/shared": "workspace:*"
  }
}
```

### 清理和重新安装

```bash
# 完全清理
rm -rf node_modules
rm pnpm-lock.yaml

# 或使用脚本
pnpm clean

# 重新安装所有依赖
pnpm install
```

## 性能优化

### 使用 pnpm 的优势

1. **快速安装** - pnpm 使用硬链接，显著加快安装速度
2. **节省磁盘空间** - 共享依赖存储
3. **幽灵依赖** - 防止未在 package.json 中声明的依赖被使用
4. **单一锁文件** - `pnpm-lock.yaml` 用于所有工作区

### Monorepo 优势

1. **统一版本管理** - 所有包使用相同的依赖版本
2. **简化开发流程** - 在一个仓库中管理多个项目
3. **代码共享** - 轻松在项目间共享代码
4. **简化 CI/CD** - 统一的构建和部署流程

## 故障排除

### 问题：依赖安装慢

```bash
# 使用国内镜像
pnpm config set registry https://registry.npmmirror.com

# 恢复官方镜像
pnpm config set registry https://registry.npmjs.org
```

### 问题：工作区命令无法识别

```bash
# 确保在项目根目录运行
cd /path/to/adi-writer

# 检查 pnpm-workspace.yaml 是否正确
cat pnpm-workspace.yaml

# 重新安装
pnpm install
```

### 问题：依赖版本冲突

```bash
# 检查依赖重复
pnpm ls

# 在根 package.json 中定义版本覆盖
{
  "pnpm": {
    "overrides": {
      "vue": "^3.3.4"
    }
  }
}
```

### 问题：部署失败

```bash
# 本地测试构建
pnpm build:main

# 查看完整的构建日志
pnpm build:main --verbose

# 检查输出目录
ls -la apps/main/dist
```

## 最佳实践

✅ **推荐做法**：
- 在根目录定义共享的 dev dependencies
- 为各工作区的特定依赖单独管理
- 定期更新 `pnpm-lock.yaml`
- 使用 `pnpm -r` 命令进行批量操作
- 在 CI/CD 中使用 `pnpm install --frozen-lockfile`

❌ **避免做法**：
- 不要在工作区中使用 `npm` 或 `yarn`
- 不要手动编辑 `pnpm-lock.yaml`
- 不要使用 npm workspace 的旧版本
- 不要混合使用不同的包管理器

## 相关文档

- [快速开始](/guide/quickstart.html)
- [本地开发](/guide/local-development.html)
- [Vercel 部署](/guide/vercel-deployment.html)
- [项目结构](/guide/project-structure.html)

## 参考资源

- [pnpm 官方文档](https://pnpm.io)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Monorepo 最佳实践](https://monorepo.tools)
