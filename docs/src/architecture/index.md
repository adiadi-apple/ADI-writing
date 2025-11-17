# 系统架构

ADI Writer 的系统架构设计和技术栈说明。

## 架构概览

```
┌─────────────────────────────────────────────────────┐
│             用户浏览器                                │
├─────────────────────────────────────────────────────┤
│  Vue 3 + TypeScript + Vite                          │
│  - 组件库                                            │
│  - 状态管理 (Pinia)                                 │
│  - 路由管理                                         │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS
                     ↓
┌─────────────────────────────────────────────────────┐
│         Vercel Edge Network (CDN)                   │
├─────────────────────────────────────────────────────┤
│  - 静态资源缓存                                     │
│  - 地理位置优化                                     │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────┐
│      Vercel Serverless Functions                    │
├─────────────────────────────────────────────────────┤
│  - API 端点                                         │
│  - Node.js 运行时                                  │
│  - 自动扩展                                         │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
    ┌────────┐   ┌────────┐  ┌────────┐
    │OpenAI  │   │Database│  │Storage │
    │ API    │   │        │  │        │
    └────────┘   └────────┘  └────────┘
```

## 技术栈

### 前端

| 层级 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue | 3.3.4 |
| 语言 | TypeScript | 4.9.5 |
| 构建 | Vite | 5.0.0 |
| 状态 | Pinia | 2.1.6 |
| HTTP | Axios | 1.5.0 |

### 后端

| 层级 | 技术 | 版本 |
|------|------|------|
| 运行时 | Node.js | 18+ |
| 平台 | Vercel | - |
| API | Express/框架 | - |
| 验证 | JWT/API Key | - |

### AI 服务

| 服务 | 功能 |
|------|------|
| OpenAI | 文本补全/生成 |

### 文档

| 技术 | 版本 |
|------|------|
| VuePress | 2.0.0-rc.14 |

## 部署拓扑

### 开发环境

```
localhost:5173        localhost:3001
    ↑                      ↑
    │                      │
    └──────┬───────────────┘
           │
    Vite Dev Server + API Mock
```

### 生产环境

```
https://app.vercel.app          https://your-app.vercel.app/api
        ↓                                  ↑
     CDN                          Vercel Functions
     ↓
 Static Assets (dist/)
```

## 数据流

### 用户交互流程

```
用户操作
  ↓
Vue 组件事件
  ↓
Pinia Action
  ↓
API 请求 (Axios)
  ↓
Vercel Function
  ↓
OpenAI API / Database
  ↓
响应返回
  ↓
Pinia 更新状态
  ↓
Vue 组件重新渲染
  ↓
用户看到结果
```

## 关键组件

### 前端组件

- **App.vue** - 根组件
- **Editor** - 编辑器组件
- **Preview** - 预览组件
- **Sidebar** - 侧边栏
- **Toolbar** - 工具栏

### 后端服务

- **/api/complete** - 文本补全
- **/api/expand** - 文本扩展
- **/api/refine** - 文本润色
- **/api/auth** - 身份验证

### 状态管理

```typescript
// Pinia Stores
- userStore      // 用户信息
- editorStore    // 编辑器状态
- settingsStore  // 应用设置
- cacheStore     // 缓存数据
```

## 扩展性考虑

### 水平扩展

- Vercel 自动处理负载均衡
- CDN 分布式存储
- API 并发处理

### 垂直扩展

- 增加 Function 内存
- 优化算法性能
- 启用 Redis 缓存

## 安全架构

### 认证层

```
API Key
  ↓
验证
  ↓
请求授权
```

### 数据传输

- HTTPS 加密
- 请求签名
- 速率限制

### 数据存储

- 加密存储
- 访问控制
- 定期备份

## 相关文档

- [后端架构](/architecture/backend.html)
- [前端架构](/architecture/frontend.html)
- [Vercel 部署](/guide/vercel-deployment.html)
