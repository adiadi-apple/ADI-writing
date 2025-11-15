<template>
  <div class="editor-container">
    <div class="ambient ambient-one"></div>
    <div class="ambient ambient-two"></div>

    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <p class="eyebrow">ADI Writer</p>
          <h1>Story Studio</h1>
        </div>
        <button class="icon-btn" @click="showSettings = true" title="设置">⚙️</button>
      </div>

      <div class="documents-section">
        <button class="new-doc-btn" @click="createNewDocument">
          + 新建文档
        </button>

        <div class="documents-list">
          <div
            v-for="doc in editorStore.documents"
            :key="doc.id"
            class="document-item"
            :class="{ active: editorStore.currentDocumentId === doc.id }"
            @click="selectDocument(doc.id)"
          >
            <div>
              <div class="doc-title">{{ doc.title }}</div>
              <div class="doc-meta">更新于 {{ formatDate(doc.updatedAt) }}</div>
            </div>
            <button class="delete-btn" @click.stop="deleteDocument(doc.id)" title="删除">
              ✕
            </button>
          </div>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <div v-if="currentDocument" class="workspace">
        <div class="workspace-header">
          <div>
            <p class="eyebrow">当前文档</p>
            <div class="title-row">
              <input
                v-model="currentDocument.title"
                @change="updateCurrentDocument"
                class="title-input"
                placeholder="输入文档标题"
              />
              <span class="doc-updated">更新于 {{ formatDate(currentDocument.updatedAt) }}</span>
            </div>
          </div>
          <span class="status-pill" :class="{ 'is-busy': isProcessing }">
            {{ isProcessing ? '正在与模型对话…' : '准备就绪' }}
          </span>
        </div>

        <div class="panel-grid">
          <div class="panel input-panel">
            <div class="panel-header">
              <p class="eyebrow">原文内容</p>
              <h3>写下你想要扩写的文字</h3>
            </div>
            <textarea
              v-model="currentDocument.content"
              @change="updateCurrentDocument"
              class="editor-textarea"
              placeholder="在这里输入或粘贴您要扩写或润色的文本..."
            />
          </div>

          <div class="panel result-panel">
            <div class="panel-header">
              <p class="eyebrow">AI 输出</p>
              <div class="result-actions">
                <h3>处理结果</h3>
                <button class="copy-btn" @click="copyResult" :disabled="!resultContent">复制</button>
              </div>
            </div>
            <div class="result-content" :class="{ 'is-empty': !resultContent }">
              <p v-if="!resultContent">选择“扩写”或“润色”，结果会展示在这里。</p>
              <p v-else>{{ resultContent }}</p>
            </div>
          </div>
        </div>

        <div class="controls">
          <button
            class="action-btn expand-btn"
            @click="processContent('expand')"
            :disabled="isProcessing || !currentDocument.content.trim()"
          >
            {{ isProcessing && currentMode === 'expand' ? '处理中...' : '✨ 扩写' }}
          </button>
          <button
            class="action-btn polish-btn"
            @click="processContent('polish')"
            :disabled="isProcessing || !currentDocument.content.trim()"
          >
            {{ isProcessing && currentMode === 'polish' ? '处理中...' : '🔧 润色' }}
          </button>
        </div>

        <p class="hint-text">按钮动画遵循柔和交互曲线，确保灵动又克制。</p>
      </div>

      <div v-else class="empty-state">
        <div class="empty-card">
          <div class="empty-icon">📝</div>
          <h2>欢迎来到 ADI Writer</h2>
          <p>在左侧创建第一个文档，体验纯净的创作空间。</p>
          <button class="ghost-btn" @click="createNewDocument">新建文档</button>
        </div>
      </div>
    </main>

    <div v-if="showSettings" class="modal" @click.self="showSettings = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>设置</h2>
          <button class="close-btn" @click="showSettings = false">✕</button>
        </div>

        <div class="modal-body">
          <div class="setting-item">
            <label>当前 AI 提供商</label>
            <div class="provider-badge">
              <span v-if="appStore.apiConfig">{{ getProviderName(appStore.apiConfig.provider) }}</span>
            </div>
          </div>

          <div class="setting-item">
            <label>API 密钥</label>
            <input
              type="password"
              class="input"
              :value="appStore.apiConfig?.apiKey"
              readonly
              placeholder="••••••••"
            />
          </div>

          <div class="setting-actions">
            <button class="btn btn-secondary" @click="changeApiKey">更改 API 密钥</button>
            <button class="btn btn-danger" @click="logout">退出登录</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="errorMessage" class="toast error">
      {{ errorMessage }}
      <button @click="errorMessage = ''" class="close">✕</button>
    </div>

    <div v-if="successMessage" class="toast success">
      {{ successMessage }}
      <button @click="successMessage = ''" class="close">✕</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/app'
import { useEditorStore } from '../stores/editor'
import type { Document } from '../stores/editor'
import { aiApiService } from '../services/ai-api'

const appStore = useAppStore()
const editorStore = useEditorStore()

const showSettings = ref(false)
const isProcessing = ref(false)
const currentMode = ref<'expand' | 'polish' | null>(null)
const resultContent = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const currentDocument = computed(() => editorStore.getCurrentDocument())

onMounted(() => {
  appStore.loadConfig()
})

const createNewDocument = () => {
  const id = Date.now().toString()
  const doc: Document = {
    id,
    title: `文档 ${editorStore.documents.length + 1}`,
    content: '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  editorStore.addDocument(doc)
  editorStore.currentDocumentId = id
}

const selectDocument = (id: string) => {
  editorStore.currentDocumentId = id
}

const updateCurrentDocument = () => {
  if (currentDocument.value) {
    editorStore.updateDocument(currentDocument.value.id, {
      title: currentDocument.value.title,
      content: currentDocument.value.content,
    })
  }
}

const deleteDocument = (id: string) => {
  if (confirm('确定要删除这个文档吗？')) {
    editorStore.deleteDocument(id)
  }
}

const processContent = async (mode: 'expand' | 'polish') => {
  if (!currentDocument.value || !appStore.apiConfig) return

  isProcessing.value = true
  currentMode.value = mode
  resultContent.value = ''
  errorMessage.value = ''

  try {
    const response = await aiApiService.processContent({
      provider: appStore.apiConfig.provider,
      apiKey: appStore.apiConfig.apiKey,
      content: currentDocument.value.content,
      mode,
      customEndpoint: appStore.apiConfig.customEndpoint,
      customModel: appStore.apiConfig.customModel,
    })

    resultContent.value = response.result
    successMessage.value = mode === 'expand' ? '扩写完成！' : '润色完成！'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '处理失败，请重试'
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  } finally {
    isProcessing.value = false
    currentMode.value = null
  }
}

const copyResult = () => {
  if (!resultContent.value) return

  navigator.clipboard.writeText(resultContent.value).then(() => {
    successMessage.value = '已复制到剪贴板'
    setTimeout(() => {
      successMessage.value = ''
    }, 2000)
  })
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  })
}

const getProviderName = (provider: string) => {
  const names: Record<string, string> = {
    openai: 'OpenAI',
    gemini: 'Gemini',
    deepseek: 'DeepSeek',
    thirdparty: 'Custom Service',
  }
  return names[provider] || provider
}

const changeApiKey = () => {
  const newKey = prompt('请输入新的 API 密钥：')
  if (newKey) {
    appStore.updateApiKey(newKey)
    successMessage.value = 'API 密钥已更新'
    setTimeout(() => {
      successMessage.value = ''
    }, 2000)
  }
}

const logout = () => {
  if (confirm('确定要退出登录吗？')) {
    appStore.clearConfig()
  }
}
</script>

<style scoped>
.editor-container {
  position: relative;
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #eef1f5 0%, #fafafa 50%, #f5f5f7 100%);
  overflow: hidden;
  color: var(--text-color);
}

.ambient {
  position: absolute;
  filter: blur(80px);
  opacity: 0.7;
  pointer-events: none;
}

.ambient-one {
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgba(0, 113, 227, 0.4), transparent 65%);
  top: -140px;
  left: -110px;
}

.ambient-two {
  width: 360px;
  height: 360px;
  background: radial-gradient(circle, rgba(52, 199, 89, 0.35), transparent 65%);
  bottom: -110px;
  right: -80px;
}

.sidebar {
  width: 300px;
  background: rgba(255, 255, 255, 0.68);
  backdrop-filter: blur(36px);
  border-right: 1px solid rgba(255, 255, 255, 0.7);
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 2;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.sidebar-brand h1 {
  font-size: 1.35rem;
  letter-spacing: -0.02em;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.72rem;
  color: var(--text-light);
}

.icon-btn {
  font-size: 1.2rem;
  padding: 6px 10px;
  border-radius: 10px;
  color: var(--text-light);
  background: rgba(0, 0, 0, 0.03);
}

.icon-btn:hover {
  background: rgba(0, 113, 227, 0.12);
  color: var(--primary-color);
}

.documents-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.new-doc-btn {
  width: 100%;
  padding: 14px 16px;
  border-radius: 16px;
  background: linear-gradient(135deg, #0071e3, #2b6aff);
  color: white;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: 0 18px 30px rgba(0, 113, 227, 0.25);
}

.new-doc-btn:hover {
  transform: translateY(-1px);
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding-right: 4px;
}

.document-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.document-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 25px rgba(15, 23, 42, 0.08);
}

.document-item.active {
  border-color: rgba(0, 113, 227, 0.4);
  box-shadow: 0 20px 35px rgba(0, 113, 227, 0.15);
}

.doc-title {
  font-weight: 600;
  letter-spacing: -0.01em;
}

.doc-meta {
  font-size: 0.8rem;
  color: var(--text-light);
}

.delete-btn {
  color: var(--danger-color);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.document-item:hover .delete-btn {
  opacity: 0.9;
}

.main-content {
  flex: 1;
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.workspace {
  width: 100%;
  max-width: 1100px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 36px;
  padding: 36px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.title-input {
  border: none;
  background: rgba(0, 0, 0, 0.02);
  padding: 14px 18px;
  border-radius: 16px;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  flex: 1;
}

.title-input:focus {
  background: #fff;
  box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
}

.doc-updated {
  font-size: 0.85rem;
  color: var(--text-light);
}

.status-pill {
  padding: 10px 16px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-light);
}

.status-pill.is-busy {
  background: rgba(0, 113, 227, 0.12);
  color: var(--primary-color);
}

.panel-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 24px;
}

.panel {
  padding: 24px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.65);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
  min-height: 280px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.panel-header h3 {
  font-size: 1.1rem;
  letter-spacing: -0.01em;
}

.editor-textarea {
  flex: 1;
  min-height: 280px;
  border: none;
  resize: none;
  font-size: 1rem;
  font-family: 'SF Mono', 'Menlo', 'Courier New', monospace;
  background: linear-gradient(145deg, #fefefe, #f5f7fb);
  border-radius: 20px;
  padding: 18px 20px;
  line-height: 1.6;
  color: var(--text-color);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.editor-textarea:focus {
  box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.12);
}

.result-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.result-content {
  flex: 1;
  padding: 18px;
  border-radius: 20px;
  background: #f4f6fb;
  border: 1px solid rgba(0, 0, 0, 0.04);
  color: var(--text-color);
  line-height: 1.6;
  overflow-y: auto;
}

.result-content.is-empty {
  color: var(--text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.controls {
  display: flex;
  gap: 16px;
}

.action-btn {
  flex: 1;
  padding: 16px 24px;
  border-radius: 16px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.02em;
  box-shadow: 0 18px 30px rgba(0, 0, 0, 0.12);
}

.expand-btn {
  background: linear-gradient(135deg, #0071e3, #2b6aff);
}

.polish-btn {
  background: linear-gradient(135deg, #34c759, #2db257);
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.hint-text {
  font-size: 0.9rem;
  color: var(--text-light);
}

.copy-btn {
  padding: 8px 16px;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.8);
  font-weight: 600;
}

.copy-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.empty-state {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-card {
  padding: 48px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.9);
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 420px;
}

.empty-icon {
  font-size: 2.5rem;
}

.ghost-btn {
  padding: 14px 18px;
  border-radius: 16px;
  border: 1px solid rgba(0, 113, 227, 0.4);
  color: var(--primary-color);
  font-weight: 600;
  background: transparent;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 460px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: var(--shadow-elevated);
  animation: fadeUp 0.3s ease;
}

@keyframes fadeUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  font-size: 1.5rem;
  color: var(--text-light);
  padding: 6px 10px;
  border-radius: 999px;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.modal-body {
  padding: 24px;
}

.setting-item {
  margin-bottom: 20px;
}

.provider-badge {
  display: inline-flex;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 14px;
  background: rgba(0, 113, 227, 0.1);
  color: var(--primary-color);
  font-weight: 600;
}

.input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(0, 0, 0, 0.02);
}

.setting-actions {
  display: flex;
  gap: 12px;
}

.btn {
  flex: 1;
  padding: 14px 16px;
  border-radius: 14px;
  font-weight: 600;
}

.btn-secondary {
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(0, 0, 0, 0.03);
}

.btn-danger {
  background: linear-gradient(135deg, #ff3b30, #d91a12);
  color: #fff;
}

.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 16px 22px;
  border-radius: 18px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 2000;
  backdrop-filter: blur(18px);
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.2);
  animation: slideInToast 0.3s ease;
}

.toast.error {
  background: linear-gradient(135deg, #ff3b30, #d91a12);
}

.toast.success {
  background: linear-gradient(135deg, #34c759, #249a43);
}

.toast .close {
  color: inherit;
  opacity: 0.85;
}

.toast .close:hover {
  opacity: 1;
}

@keyframes slideInToast {
  from {
    transform: translateX(120px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
@media (max-width: 1024px) {
  .editor-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .documents-section {
    width: 100%;
  }

  .panel-grid {
    grid-template-columns: 1fr;
  }

  .controls {
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .main-content {
    padding: 20px;
  }

  .workspace {
    padding: 24px;
  }

  .sidebar {
    padding: 20px;
  }
}
</style>
