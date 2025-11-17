# 故障排除指南

系统故障诊断和修复步骤。

## 诊断步骤

### 1. 收集信息

在寻求帮助前，请收集以下信息：

```bash
# 系统信息
node -v          # Node.js 版本
pnpm -v          # pnpm 版本
npm -v            # npm 版本
git --version     # Git 版本

# 项目信息
cd /home/engine/project
git branch        # 当前分支
git log --oneline -5  # 最近提交

# 环境检查
env | grep VITE_  # 环境变量
```

### 2. 查看日志

```bash
# Vite 开发日志
pnpm dev 2>&1 | tee dev.log

# 构建日志
pnpm build 2>&1 | tee build.log

# Vercel 部署日志
# 在 Vercel Dashboard 中查看
```

### 3. 测试基础功能

```bash
# 测试 Node.js
node -e "console.log('Node.js OK')"

# 测试 npm
npm -v

# 测试 pnpm
pnpm -v

# 测试 Git
git status
```

## 常见问题排除树

### 应用无法启动

```
应用无法启动
├─ 检查 Node.js 版本 (需要 18+)
├─ 检查依赖是否安装
│  └─ 运行: pnpm install
├─ 检查环境变量
│  └─ 创建: .env 文件
└─ 检查端口占用
   └─ 使用: pnpm dev -- --port 5174
```

**调查步骤**:
```bash
# 1. 检查版本
node -v

# 2. 清除并重新安装
pnpm clean
pnpm install

# 3. 检查环境文件
ls -la .env*

# 4. 启动应用
pnpm dev
```

### 应用加载缓慢

```
应用加载缓慢
├─ 检查网络连接
├─ 检查 API 响应时间
│  └─ 打开 DevTools → Network
├─ 检查包大小
│  └─ 运行: pnpm build -- --report
└─ 清除缓存
   └─ rm -rf node_modules/.vite
```

**性能分析**:
```bash
# 分析包大小
pnpm build -- --report

# 监控网络请求
# 打开 Chrome DevTools → Network 标签
# 查看每个请求的时间

# 检查 API 性能
# 打开 Chrome DevTools → Performance 标签
# 记录性能信息
```

### 数据未正确加载

```
数据未加载
├─ 检查 API 连接
│  └─ curl http://localhost:3001/api/hello
├─ 检查响应状态码
│  └─ 200 = 成功, 4xx = 客户端错误, 5xx = 服务器错误
├─ 检查响应内容
│  └─ 是否有有效的 JSON
└─ 检查 CORS 设置
   └─ 浏览器控制台查看错误
```

**调试代码**:
```javascript
// 在浏览器控制台输入
fetch('/api/hello')
  .then(r => {
    console.log('Status:', r.status)
    return r.json()
  })
  .then(d => console.log('Data:', d))
  .catch(e => console.error('Error:', e))
```

### 部署失败

```
部署失败
├─ 检查本地构建
│  └─ pnpm build
├─ 检查环境变量
│  └─ Vercel Dashboard → Settings → Environment Variables
├─ 检查构建日志
│  └─ Vercel Dashboard → Deployments
└─ 检查依赖版本
   └─ pnpm ls
```

**本地验证**:
```bash
# 1. 清除所有缓存
pnpm clean
rm -rf .vercel

# 2. 重新安装依赖
pnpm install --frozen-lockfile

# 3. 本地构建
pnpm build

# 4. 预览构建结果
pnpm preview
```

## 特定错误排除

### "ENOENT: no such file or directory"

**原因**: 文件或目录不存在

**解决方案**:
```bash
# 检查文件是否存在
ls -la src/
ls -la .env

# 恢复文件
git checkout <file>

# 或重新克隆
git clone <repo>
```

### "TypeError: Cannot find module"

**原因**: 模块未找到或依赖未安装

**解决方案**:
```bash
# 重新安装依赖
pnpm install

# 查找模块
pnpm why <module-name>

# 如果模块确实缺失
pnpm add <module-name>
```

### "EACCES: permission denied"

**原因**: 权限不足

**解决方案**:
```bash
# 修复权限
sudo chown -R $USER ~/.npm

# 或使用 nvm (推荐)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### "Error: Cannot find module 'vite'"

**原因**: Vite 未安装

**解决方案**:
```bash
# 重新安装
pnpm install

# 检查 package.json
cat package.json | grep vite

# 如果不存在，添加它
pnpm add -D vite
```

## 性能优化检查清单

- [ ] 包大小 < 1MB (gzipped < 300KB)
- [ ] 首屏加载 < 3 秒
- [ ] 交互时间 < 200ms
- [ ] 没有控制台错误或警告
- [ ] 没有内存泄漏
- [ ] 响应式设计工作正常

## 安全检查清单

- [ ] 没有在代码中硬编码敏感信息
- [ ] API 密钥存储在环境变量中
- [ ] 所有 API 调用使用 HTTPS
- [ ] 输入数据已验证
- [ ] 输出数据已转义
- [ ] 没有 XSS 漏洞

## 回滚步骤

如果部署出现问题：

```bash
# 查看提交历史
git log --oneline

# 回滚到上一个稳定版本
git revert <commit-hash>

# 或重置到之前的版本
git reset --hard <commit-hash>

# 推送回滚
git push --force-with-lease
```

## 获取支持

如果以上步骤未能解决问题：

1. **查看文档**: [文档中心](/guide/quickstart.html)
2. **GitHub Issues**: 搜索类似问题
3. **技术支持**: support@example.com
4. **社区论坛**: https://community.example.com

### 提交 Bug 报告

请包含以下信息：

```markdown
## 问题描述
清楚地描述问题

## 重现步骤
1. 步骤 1
2. 步骤 2
3. 步骤 3

## 预期行为
应该发生什么

## 实际行为
实际发生了什么

## 环境
- Node.js 版本: `node -v`
- pnpm 版本: `pnpm -v`
- 操作系统: macOS/Linux/Windows
- 浏览器: Chrome/Firefox/Safari

## 日志
```
粘贴错误日志
```
```

## 相关文档

- [快速开始](/guide/quickstart.html)
- [常见问题](/faq/common-issues.html)
- [API 文档](/api/overview.html)
