# 常见问题 (FAQ)

ADI Writer 的常见问题解答。

## 一般问题

### Q: ADI Writer 是什么？

A: ADI Writer 是一个 AI 驱动的创意写作助手，可以帮助您：
- 完成文本内容
- 扩展和润色文章
- 生成创意故事
- 生成诗词和文案

### Q: ADI Writer 支持哪些语言？

A: 目前支持：
- 中文 (简体和繁体)
- 英文
- 日文
- 韩文

### Q: 如何开始使用？

A: 请查看 [快速开始指南](/guide/quickstart.html)

## 部署问题

### Q: 如何在 Vercel 上部署？

A: 请查看 [Vercel 部署指南](/guide/vercel-deployment.html)

### Q: 部署失败了怎么办？

A: 
1. 检查 Vercel 构建日志
2. 确保所有环境变量已配置
3. 查看 [故障排除指南](/faq/troubleshooting.html)

### Q: 如何更新已部署的应用？

A: 推送更改到 GitHub，Vercel 会自动部署。

## API 相关

### Q: 如何获取 API 密钥？

A: 
1. 登录账户
2. 进入设置 → API 密钥
3. 点击"生成新密钥"

### Q: 如何在应用中使用 API？

A: 请查看 [API 文档](/api/overview.html)

### Q: API 有速率限制吗？

A: 有的。免费用户每分钟 60 请求，付费用户 600 请求。详见 [速率限制](/api/rate-limiting.html)

## 功能问题

### Q: 可以离线使用吗？

A: 不可以，ADI Writer 需要网络连接来调用 AI API。

### Q: 文本长度有限制吗？

A: 
- 输入文本: 最多 10,000 字符
- 输出文本: 根据 token 限制变化

### Q: 支持的文件格式有哪些？

A: 
- 纯文本 (.txt)
- Markdown (.md)
- 富文本 (粘贴板)

## 性能问题

### Q: 为什么加载很慢？

A: 
1. 检查网络连接
2. 清除浏览器缓存
3. 尝试使用其他浏览器

### Q: 如何提高性能？

A: 
1. 使用 Chrome 或 Firefox
2. 关闭浏览器扩展
3. 清除缓存

## 账户问题

### Q: 忘记密码怎么办？

A: 
1. 点击登录页面的"忘记密码"
2. 输入注册邮箱
3. 按照邮件中的链接重置密码

### Q: 如何删除账户？

A: 进入设置 → 账户 → 删除账户

### Q: 支持多账户吗？

A: 支持。每个邮箱可以创建一个账户。

## 计费问题

### Q: 如何升级计划？

A: 进入设置 → 计费 → 选择计划

### Q: 支持哪些支付方式？

A: 支持信用卡和支付宝

### Q: 可以退款吗？

A: 支持 7 天内无条件退款

## 技术问题

### Q: 支持哪些浏览器？

A: 
- Chrome 90+
- Firefox 88+
- Safari 15+
- Edge 90+

### Q: 是否开源？

A: 是的，ADI Writer 是完全开源的。查看 GitHub 仓库

### Q: 如何本地开发？

A: 请查看 [本地开发指南](/guide/local-development.html)

## 数据安全问题

### Q: 我的数据安全吗？

A: 
- 所有数据都通过 HTTPS 传输
- 服务器端数据加密存储
- 定期安全审计

### Q: 数据会被用于训练 AI 模型吗？

A: 不会。我们遵守用户隐私政策，数据仅用于提供服务。

### Q: 支持 GDPR 吗？

A: 支持。您可以随时导出或删除个人数据。

## 更多帮助

### 找不到答案？

- 查看 [常见问题](/faq/common-issues.html)
- 查看 [故障排除](/faq/troubleshooting.html)
- 联系 [技术支持](mailto:support@adi-writer.com)

## 相关文档

- [快速开始](/guide/quickstart.html)
- [故障排除](/faq/troubleshooting.html)
- [API 文档](/api/overview.html)
