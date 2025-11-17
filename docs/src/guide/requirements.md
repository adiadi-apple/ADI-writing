# 系统需求

部署和开发 ADI Writer 所需的系统要求。

## 运行时要求

### Node.js

- **最低版本**: 18.0.0
- **推荐版本**: 20.x LTS
- **检查版本**: `node -v`

### pnpm

- **最低版本**: 8.0.0
- **推荐版本**: 9.x
- **检查版本**: `pnpm -v`
- **安装**: `npm install -g pnpm`

### Git

- **最低版本**: 2.30.0
- **检查版本**: `git --version`

## 开发环境

### 系统要求

| 组件 | 要求 |
|------|------|
| CPU | 4+ 核心 |
| RAM | 8+ GB |
| 磁盘空间 | 10+ GB |
| 操作系统 | macOS / Linux / Windows (WSL2) |

### 推荐编辑器

- **VS Code** (推荐)
  - 扩展: Vetur, TypeScript Vue Plugin
- **WebStorm**
- **Sublime Text**

### 开发工具

```bash
# 必需
- Git
- Node.js 18+
- pnpm 8+

# 推荐
- Docker (用于本地数据库)
- Postman (API 测试)
- ngrok (本地隧道)
```

## 部署要求

### Vercel

- GitHub 账户
- Vercel 账户 (免费)
- 仓库访问权限

### API 密钥

需要获得以下 API 密钥：

- **OpenAI API Key**
  - 访问: https://platform.openai.com/api-keys
  - 类型: 有效的 API 密钥
  - 权限: 需要有效的信用卡

## 网络要求

### 必需的外部服务

| 服务 | URL | 用途 |
|------|-----|------|
| OpenAI API | api.openai.com | AI 完成 |
| NPM Registry | registry.npmjs.org | 依赖安装 |
| GitHub | github.com | 代码托管 |
| Vercel | vercel.com | 部署 |

### 防火墙配置

确保可以访问以下端口：

- HTTP: 80
- HTTPS: 443
- 本地开发: 5173 (Vite), 5174 (Preview)

## 浏览器支持

### 支持的浏览器

| 浏览器 | 最低版本 | 移动版本 |
|--------|----------|----------|
| Chrome | 90+ | Android 5+ |
| Firefox | 88+ | Firefox for Android 68+ |
| Safari | 15+ | iOS 15+ |
| Edge | 90+ | - |

## 依赖清单

### 核心依赖

```json
{
  "dependencies": {
    "vue": "^3.3.4",
    "pinia": "^2.1.6",
    "axios": "^1.5.0",
    "openai": "^4.20.1",
    "@vercel/node": "^2.15.0"
  }
}
```

### 开发依赖

```json
{
  "devDependencies": {
    "vite": "^5.0.0",
    "typescript": "~4.9.5",
    "vue-tsc": "^1.8.19",
    "eslint": "^8.52.0"
  }
}
```

## 配置检查清单

- [ ] Node.js 18+ 已安装
- [ ] pnpm 8+ 已安装
- [ ] Git 已安装
- [ ] 编辑器已配置
- [ ] GitHub 账户已创建
- [ ] Vercel 账户已创建
- [ ] OpenAI API 密钥已获取
- [ ] `.env` 文件已创建
- [ ] 依赖已安装: `pnpm install`
- [ ] 本地开发可以运行: `pnpm dev`

## 故障排除

### Node.js 版本过低

```bash
# 使用 nvm 升级
nvm install 20
nvm use 20
```

### pnpm 安装失败

```bash
npm uninstall -g pnpm
npm install -g pnpm@latest
```

### 权限错误

```bash
# 修复 npm 权限
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

## 相关文档

- [快速开始](/guide/quickstart.html)
- [本地开发](/guide/local-development.html)
- [环境配置](/guide/environment.html)
