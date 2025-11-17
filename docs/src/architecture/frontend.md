# 前端架构

Vue 3 + TypeScript 前端架构设计。

## 项目结构

```
src/
├── components/          # 可复用组件
│   ├── Editor/
│   ├── Preview/
│   ├── Button/
│   └── Input/
├── views/               # 页面级组件
│   ├── Home.vue
│   ├── Editor.vue
│   └── Settings.vue
├── stores/              # Pinia 状态管理
│   ├── user.ts
│   ├── editor.ts
│   └── settings.ts
├── api/                 # API 调用
│   └── client.ts
├── types/               # TypeScript 类型定义
│   ├── common.ts
│   ├── editor.ts
│   └── api.ts
├── utils/               # 工具函数
│   ├── format.ts
│   ├── validate.ts
│   └── storage.ts
├── style/               # 全局样式
│   └── index.css
├── App.vue              # 根组件
└── main.ts              # 入口文件
```

## 组件架构

### 容器组件

```typescript
// views/Editor.vue
// 负责业务逻辑和状态管理
const store = useEditorStore()

async function handleSubmit() {
  const result = await store.complete(text)
  // 处理结果
}
```

### 展示组件

```typescript
// components/Preview.vue
// 接收 props 并展示数据
const props = defineProps<{
  content: string
  loading: boolean
}>()
```

## 状态管理

### Pinia Store 结构

```typescript
// stores/editor.ts
import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', {
  state: () => ({
    text: '',
    result: '',
    loading: false
  }),
  
  getters: {
    isEmpty: (state) => state.text.length === 0
  },
  
  actions: {
    async complete(text: string) {
      this.loading = true
      try {
        const result = await api.complete(text)
        this.result = result
      } finally {
        this.loading = false
      }
    }
  }
})
```

### 跨模块通信

```
Store A
  ↓
State Update
  ↓
Components Subscribe
  ↓
UI Update
```

## API 客户端

### 请求拦截

```typescript
// utils/api.ts
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

// 请求拦截
client.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${getToken()}`
  return config
})

// 响应拦截
client.interceptors.response.use(
  response => response.data,
  error => handleError(error)
)
```

## 类型系统

### 通用类型

```typescript
// types/common.ts
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginationResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}
```

### 编辑器类型

```typescript
// types/editor.ts
export interface CompleteRequest {
  text: string
  model?: string
  maxTokens?: number
  temperature?: number
}

export interface CompleteResponse {
  id: string
  originalText: string
  completedText: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}
```

## 样式系统

### CSS 变量

```css
:root {
  --primary: #007aff;
  --secondary: #34c759;
  --danger: #ff3b30;
  
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

### 响应式设计

```css
/* 移动优先 */
.container {
  width: 100%;
  padding: 1rem;
}

/* 平板 */
@media (min-width: 768px) {
  .container {
    width: 720px;
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .container {
    width: 960px;
  }
}
```

## 生命周期管理

### 组件生命周期

```typescript
<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  // 初始化
  // 订阅事件
  // 加载数据
})

onBeforeUnmount(() => {
  // 清理
  // 取消订阅
  // 释放资源
})
</script>
```

## 性能优化

### 代码分割

```typescript
// router.ts
const Editor = defineAsyncComponent(() => import('./views/Editor.vue'))
const Settings = defineAsyncComponent(() => import('./views/Settings.vue'))
```

### 虚拟列表

```typescript
// 用于大列表优化
<template>
  <RecycleScroller
    :items="items"
    :item-size="50"
  />
</template>
```

## 无障碍访问

### ARIA 属性

```html
<button
  aria-label="完成"
  aria-busy="loading"
>
  完成
</button>
```

### 键盘导航

```typescript
@keydown.enter="handleSubmit"
@keydown.esc="handleCancel"
```

## 测试策略

### 单元测试

```typescript
// 测试工具函数
describe('format', () => {
  it('should format text correctly', () => {
    expect(formatText('hello')).toBe('Hello')
  })
})
```

### 组件测试

```typescript
// 测试组件行为
describe('Button', () => {
  it('should emit click event', () => {
    const wrapper = mount(Button)
    wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeDefined()
  })
})
```

## 相关文档

- [系统架构](/architecture/index.html)
- [后端架构](/architecture/backend.html)
- [项目结构](/guide/project-structure.html)
