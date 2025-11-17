# 部署清单

在部署到生产环境前的完整检查清单。

## 部署前检查

### ✅ 代码质量

- [ ] 所有测试通过
- [ ] 没有 TypeScript 类型错误
- [ ] ESLint 检查通过（无 error）
- [ ] 代码已审查
- [ ] 敏感信息已删除（无 API 密钥等）

### ✅ 环境配置

- [ ] `.env.production` 已配置
- [ ] 所有必需的环境变量已添加
- [ ] API 密钥有效且有权限
- [ ] 数据库连接字符串正确
- [ ] CORS 配置正确

### ✅ 功能验证

- [ ] 主功能正常工作
- [ ] 表单验证正确
- [ ] 错误处理完善
- [ ] 加载状态显示正确
- [ ] 网络错误处理良好

### ✅ 性能检查

- [ ] 构建时间合理（< 5 分钟）
- [ ] 包大小合理
- [ ] 页面加载时间 < 3 秒
- [ ] 没有控制台警告
- [ ] 没有内存泄漏

### ✅ 浏览器兼容性

- [ ] Chrome 最新版本测试✓
- [ ] Firefox 最新版本测试✓
- [ ] Safari 最新版本测试✓
- [ ] Safari iOS 测试✓
- [ ] Chrome Android 测试✓

### ✅ 安全检查

- [ ] 没有 XSS 漏洞
- [ ] 没有 CSRF 漏洞
- [ ] 没有 SQL 注入漏洞
- [ ] API 端点有身份验证
- [ ] 敏感数据已加密

## 部署步骤

### 1. 准备仓库

```bash
# 确保所有更改已提交
git status

# 创建发布分支
git checkout -b release/v1.0.0

# 更新版本号
npm version patch  # 或 minor, major
```

### 2. 构建验证

```bash
# 清理旧构建
pnpm clean

# 安装最新依赖
pnpm install --frozen-lockfile

# 类型检查
pnpm type-check

# 构建项目
pnpm run build

# 验证构建结果
pnpm preview
```

### 3. 标记发布

```bash
# 创建标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 推送标签
git push origin v1.0.0
```

### 4. 部署到 Vercel

```bash
# 登录 Vercel
vercel login

# 部署到生产环境
vercel --prod

# 验证部署
# 访问 https://your-app.vercel.app
```

### 5. 验证生产环境

- [ ] 应用正常加载
- [ ] 所有功能工作正常
- [ ] 没有控制台错误
- [ ] 性能指标正常
- [ ] 监控告警未触发

## 部署后检查

### ✅ 功能验证

- [ ] 主页加载正确
- [ ] 所有路由工作正常
- [ ] API 调用成功
- [ ] 表单提交成功
- [ ] 搜索功能工作正常

### ✅ 性能监控

- [ ] 页面加载时间 < 3 秒
- [ ] 首次内容绘制 (FCP) < 2 秒
- [ ] 最大内容绘制 (LCP) < 2.5 秒
- [ ] CPU 使用率正常
- [ ] 内存使用率正常

### ✅ 错误监控

- [ ] 没有 JavaScript 错误
- [ ] 没有网络错误
- [ ] 没有 API 错误
- [ ] 日志输出正常
- [ ] 没有告警

### ✅ 用户体验

- [ ] 加载动画显示正确
- [ ] 错误提示清晰
- [ ] 成功提示显示正确
- [ ] 响应式设计工作正常
- [ ] 可访问性功能工作正常

## 回滚计划

### 快速回滚

如果部署出现问题：

```bash
# 查看部署历史
vercel list

# 回滚到上一个版本
vercel rollback
```

### 完整回滚流程

1. **立即停止影响**
   ```bash
   # 使用之前的稳定部署
   vercel promote <deployment-url>
   ```

2. **调查问题**
   - 查看 Vercel 日志
   - 检查错误监控
   - 分析性能指标

3. **修复问题**
   ```bash
   # 在本地修复问题
   git checkout main
   git pull origin main
   
   # 创建修复分支
   git checkout -b hotfix/issue-fix
   ```

4. **重新部署**
   ```bash
   # 提交修复
   git commit -am "Fix deployment issue"
   git push origin hotfix/issue-fix
   
   # 创建 Pull Request
   # 合并到 main 后自动部署
   ```

## 故障排除

### 部署失败

**问题**: Vercel 构建失败

**排查步骤**:
1. 查看 Vercel 构建日志
2. 检查依赖是否正确安装
3. 检查环境变量是否完整
4. 检查构建命令是否正确

**解决方案**:
```bash
# 本地测试构建
pnpm run build

# 检查错误
pnpm type-check

# 修复问题后重新部署
git push origin main
```

### 性能下降

**问题**: 部署后页面加载变慢

**排查步骤**:
1. 查看 Vercel Analytics
2. 检查包大小
3. 检查 API 响应时间
4. 查看 CDN 缓存状态

**解决方案**:
```bash
# 分析包大小
pnpm run build -- --report

# 优化依赖
pnpm why <package-name>

# 启用缓存
# 在 vercel.json 中配置缓存头
```

### 功能不工作

**问题**: 功能在生产环境不工作

**排查步骤**:
1. 检查浏览器控制台错误
2. 检查网络请求
3. 检查 API 响应
4. 检查环境变量

**解决方案**:
```bash
# 查看实时日志
vercel logs --follow

# 查看特定函数日志
vercel logs --function api/hello
```

## 监控设置

### ✅ 推荐的监控工具

- **Vercel Analytics** - 性能监控
- **Sentry** - 错误追踪
- **LogRocket** - 用户会话记录
- **Google Analytics** - 用户行为分析

### ✅ 推荐的告警

- 构建失败
- 部署失败
- 高错误率（> 1%）
- 响应时间过长（> 1s）
- 内存使用过高（> 80%）
- CPU 使用过高（> 80%）

## 相关文档

- [Vercel 部署](/guide/vercel-deployment.html)
- [快速开始](/guide/quickstart.html)
- [故障排除](/faq/troubleshooting.html)
