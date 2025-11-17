# 常见问题解决

常见技术问题和快速解决方案。

## 安装和配置问题

### 问题: npm 安装速度慢

**症状**: `pnpm install` 或 `npm install` 很慢

**解决方案**:
```bash
# 使用国内镜像 (如果在中国)
pnpm config set registry https://registry.npmmirror.com

# 查看当前镜像
pnpm config get registry

# 重置为官方镜像
pnpm config set registry https://registry.npmjs.org
```

### 问题: Node 版本不兼容

**症状**: 错误信息类似 "The engine 'node' is incompatible with this package"

**解决方案**:
```bash
# 查看当前 Node 版本
node -v

# 如果使用 nvm
nvm install 20
nvm use 20

# 或升级 npm
npm install -g npm@latest
```

### 问题: pnpm 权限错误

**症状**: 错误信息 "EACCES: permission denied"

**解决方案**:
```bash
# 修复权限
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# 或使用 sudo (不推荐)
sudo npm install -g pnpm
```

## 开发环境问题

### 问题: 端口被占用

**症状**: 错误 "EADDRINUSE: address already in use :::5173"

**解决方案**:
```bash
# 查看占用端口的进程
lsof -i :5173

# 杀死进程
kill -9 <PID>

# 或使用其他端口
pnpm dev -- --port 5174
```

### 问题: 热更新不工作

**症状**: 修改文件后页面不刷新

**解决方案**:
```bash
# 重启开发服务器
# 1. Ctrl+C 停止
# 2. 重新运行
pnpm dev

# 清除缓存
rm -rf node_modules/.vite
pnpm dev
```

### 问题: TypeScript 错误

**症状**: 类型检查错误但页面能运行

**解决方案**:
```bash
# 重新编译
pnpm type-check

# 更新 TypeScript
pnpm add -D typescript@latest

# 重启 IDE
```

## 构建问题

### 问题: 构建失败

**症状**: `pnpm build` 失败，有错误信息

**解决方案**:
```bash
# 1. 清除缓存
rm -rf dist node_modules/.vite

# 2. 重新安装依赖
pnpm install

# 3. 运行类型检查
pnpm type-check

# 4. 修复 lint 错误
pnpm lint -- --fix

# 5. 重新构建
pnpm build
```

### 问题: 包大小过大

**症状**: 构建输出超过 1MB

**解决方案**:
```bash
# 分析包大小
pnpm build -- --report

# 查看哪个依赖很大
pnpm why <package-name>

# 考虑替代方案或延迟加载
```

## Git 问题

### 问题: Git 冲突

**症状**: "merge conflict" 或 "conflict" 错误

**解决方案**:
```bash
# 查看冲突的文件
git status

# 手动解决冲突后
git add <file>
git commit -m "Resolve merge conflict"
git push
```

### 问题: 提交被拒绝

**症状**: "pre-commit hook failed" 或类似错误

**解决方案**:
```bash
# 修复 lint 错误
pnpm lint -- --fix

# 修复格式
pnpm format

# 再次提交
git commit -am "Fix issues"
git push
```

## 部署问题

### 问题: Vercel 部署失败

**症状**: "Build failed" 或构建日志显示错误

**解决方案**:
1. 查看 Vercel Dashboard 中的完整构建日志
2. 检查环境变量是否完整
3. 确保本地构建成功: `pnpm build`
4. 检查 `vercel.json` 配置

```bash
# 本地测试 Vercel 构建
npm install -g vercel
vercel build
```

### 问题: 环境变量未生效

**症状**: 生产环境收不到环境变量

**解决方案**:
```bash
# 检查 Vercel Dashboard
# Settings → Environment Variables

# 确认变量已应用到正确的环境
# 重新部署
vercel --prod

# 或通过 CLI 添加变量
vercel env add VITE_API_KEY
```

### 问题: 应用加载很慢

**症状**: 首次加载需要 > 3 秒

**解决方案**:
1. 启用 Vercel 缓存
2. 优化包大小
3. 使用 CDN
4. 启用 Gzip 压缩

```json
{
  "headers": [
    {
      "source": "/assets/*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 浏览器问题

### 问题: CORS 错误

**症状**: "Access to XMLHttpRequest has been blocked by CORS policy"

**解决方案**:
```javascript
// 确保 API 服务器配置了 CORS
// 在服务器端 (Node.js/Express)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})
```

### 问题: 页面不响应

**症状**: 点击按钮没反应，页面冻结

**解决方案**:
1. 打开浏览器开发者工具 (F12)
2. 查看 Console 是否有错误
3. 查看 Network 标签检查 API 请求
4. 清除浏览器缓存并刷新

```bash
# Windows/Linux
Ctrl + Shift + Delete  # 打开清除缓存对话

# macOS
Cmd + Shift + Delete
```

### 问题: 样式不加载

**症状**: 页面显示无样式，只有基础结构

**解决方案**:
```bash
# 清除缓存
rm -rf node_modules/.vite dist

# 重新开发
pnpm dev

# 或清除浏览器缓存并硬刷新
Ctrl + Shift + R (或 Cmd + Shift + R)
```

## 性能问题

### 问题: 内存泄漏

**症状**: 长时间使用应用后变慢或崩溃

**解决方案**:
```typescript
// 确保在组件卸载时清理
onMounted(() => {
  const listener = () => {}
  window.addEventListener('resize', listener)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', listener)  // ✅ 清理
})
```

### 问题: 列表性能差

**症状**: 渲染大列表时页面卡顿

**解决方案**:
```typescript
// 使用虚拟列表或分页
<template>
  <RecycleScroller
    :items="items"
    :item-size="50"
  >
    <template #default="{ item }">
      <div>{{ item }}</div>
    </template>
  </RecycleScroller>
</template>
```

## 数据问题

### 问题: 数据丢失

**症状**: 重新加载页面后数据消失

**解决方案**:
1. 检查 localStorage 是否被清除
2. 检查 Pinia store 是否持久化
3. 检查 API 请求是否成功

```typescript
// 持久化 Pinia store
import { createPinia, setActivePinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'

const pinia = createPinia()
pinia.use(piniaPluginPersist)
```

## 相关文档

- [快速开始](/guide/quickstart.html)
- [故障排除](/faq/troubleshooting.html)
- [API 文档](/api/overview.html)
