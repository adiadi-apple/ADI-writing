<template>
  <div class="setup-shell">
    <div class="ambient ambient-blue"></div>
    <div class="ambient ambient-green"></div>

    <header class="shell-nav">
      <div class="brand">
        <div class="logo-mark">
          <span></span>
        </div>
        <div>
          <h1>ADI WRITER</h1>
          <p class="eyebrow">Story Studio</p>
        </div>
      </div>
    </header>

    <div class="layout">
      <section class="hero-panel">
        <div class="hero-head">
          <p class="eyebrow">Designed for focus</p>
          <h2>一个简单、纯净的专注写作空间</h2>
          <p class="lede">
            你是否曾有过天马行空的想法，却苦于无法用语言表达？使用 ADI WRITER，帮助你完成剧本、小说、诗歌、传记，书写你的故事。
          </p>
        </div>

        <div class="hero-stats">
          <article class="hero-card">
            <span class="stat-value">60 秒</span>
            <p>完成全部配置，马上开始创作。</p>
          </article>
          <article class="hero-card">
            <span class="stat-value">3+ 模型</span>
            <p>OpenAI、Gemini、DeepSeek 与自定义随心切换。</p>
          </article>
          <article class="hero-card">
            <span class="stat-value">100% 本地</span>
            <p>API 密钥仅存在你的浏览器中。</p>
          </article>
          <article class="hero-card assurance-card">
            <p class="tiny-label">创作保障</p>
            <h4>关键步骤一目了然</h4>
            <p class="assurance-copy">密钥与配置仅保留在本地，可随时清除。多家模型与自定义端点同一入口切换，流程不足 3 步，首访也能快速上手。</p>
          </article>
        </div>

        <div class="hero-capabilities">
          <div class="cap-item">
            <span class="cap-icon">✦</span>
            <div>
              <strong>长篇扩写</strong>
              <p>章节、剧作、传记一气呵成。</p>
            </div>
          </div>
          <div class="cap-item">
            <span class="cap-icon">✎</span>
            <div>
              <strong>精准润色</strong>
              <p>瞬时优化语气、节奏与逻辑。</p>
            </div>
          </div>
          <div class="cap-item">
            <span class="cap-icon">▣</span>
            <div>
              <strong>文稿管理</strong>
              <p>写作版本与灵感井然有序。</p>
            </div>
          </div>
          <div class="cap-item">
            <span class="cap-icon">⌘</span>
            <div>
              <strong>多语言</strong>
              <p>跨语种协作与发布保持一致。</p>
            </div>
          </div>
        </div>
      </section>

      <section class="form-card quick-panel" id="quick-start">
        <div class="form-header">
          <p class="eyebrow">Quick start</p>
          <h3>准备开始</h3>
          <p>三步配置你偏好的模型，即刻投入写作。</p>
        </div>

        <form @submit.prevent="handleSubmit" class="form">
          <div class="form-group">
            <label for="provider">选择提供商</label>
            <select v-model="selectedProvider" id="provider" class="input">
              <option value="openai">OpenAI (GPT-4o Mini)</option>
              <option value="gemini">Google Gemini (Gemini 1.5 Flash)</option>
              <option value="deepseek">DeepSeek</option>
              <option value="thirdparty">自定义服务</option>
            </select>
          </div>

          <div class="provider-hint">
            <p class="eyebrow">{{ activeProvider.label }}</p>
            <h4>{{ activeProvider.title }}</h4>
            <p>{{ activeProvider.description }}</p>
            <a
              v-if="activeProvider.link"
              :href="activeProvider.link"
              target="_blank"
              rel="noreferrer"
            >
              {{ activeProvider.linkLabel }}
            </a>
          </div>

          <div class="form-group">
            <label for="apikey">API 密钥</label>
            <input
              v-model="apiKey"
              id="apikey"
              type="password"
              class="input"
              placeholder="请输入您的 API 密钥"
              required
            />
            <small>密钥仅保存在浏览器本地，任何时候都可以更换。</small>
          </div>

          <div v-if="selectedProvider === 'thirdparty'" class="form-group">
            <label for="endpoint">API 端点</label>
            <input
              v-model="customEndpoint"
              id="endpoint"
              type="url"
              class="input"
              placeholder="https://api.example.com/v1/chat/completions"
              required
            />
          </div>

          <div v-if="selectedProvider === 'thirdparty'" class="form-group">
            <label for="model">模型名称</label>
            <input
              v-model="customModel"
              id="model"
              type="text"
              class="input"
              placeholder="例如：gpt-4o-mini"
              required
            />
          </div>

          <div class="checkbox-group">
            <input v-model="agreeTerms" id="agree" type="checkbox" required />
            <label for="agree">
              我同意将 API 密钥安全地保存在本地，并阅读
              <a href="#" @click.prevent>隐私政策</a>
            </label>
          </div>

          <button
            type="submit"
            class="primary-btn"
            :disabled="!agreeTerms || !apiKey || (selectedProvider === 'thirdparty' && (!customEndpoint || !customModel))"
          >
            开始使用
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '../stores/app'

const appStore = useAppStore()
const selectedProvider = ref<'openai' | 'gemini' | 'deepseek' | 'thirdparty'>('openai')
const apiKey = ref('')
const customEndpoint = ref('')
const customModel = ref('')
const agreeTerms = ref(false)

const providerDetails: Record<
  'openai' | 'gemini' | 'deepseek' | 'thirdparty',
  { label: string; title: string; description: string; link?: string; linkLabel?: string }
> = {
  openai: {
    label: 'OpenAI',
    title: 'GPT-4o Mini',
    description: '高质量、响应迅速的文本创作体验，适用于长篇内容扩写与润色。',
    link: 'https://platform.openai.com/api-keys',
    linkLabel: '前往 OpenAI 控制台',
  },
  gemini: {
    label: 'Google Gemini',
    title: 'Gemini 1.5 Flash',
    description: '适合多模态和多语言的创作场景，速度快、上下文长。',
    link: 'https://aistudio.google.com/app/apikey',
    linkLabel: '获取 Gemini API Key',
  },
  deepseek: {
    label: 'DeepSeek',
    title: '中文场景优化',
    description: '面向中文写作的高性价比方案，提供灵活计费模式。',
    link: 'https://platform.deepseek.com/api',
    linkLabel: '访问 DeepSeek 平台',
  },
  thirdparty: {
    label: '自定义服务',
    title: '接入你的内部模型',
    description: '配置任意兼容 OpenAI 格式的第三方端点与模型，掌控所有细节。',
  },
}

const activeProvider = computed(() => providerDetails[selectedProvider.value])

const handleSubmit = () => {
  if (!apiKey.value.trim() || !agreeTerms.value) return

  const config: any = {
    provider: selectedProvider.value,
    apiKey: apiKey.value.trim(),
  }

  if (selectedProvider.value === 'thirdparty') {
    if (!customEndpoint.value.trim() || !customModel.value.trim()) return
    config.customEndpoint = customEndpoint.value.trim()
    config.customModel = customModel.value.trim()
  }

  appStore.saveConfig(config)
}
</script>

<style scoped>
.setup-shell {
  position: relative;
  min-height: 100vh;
  padding: 56px clamp(20px, 6vw, 72px);
  display: flex;
  flex-direction: column;
  gap: 48px;
  overflow: hidden;
}

.ambient {
  position: absolute;
  filter: blur(70px);
  opacity: 0.4;
  pointer-events: none;
}

.ambient-blue {
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgba(0, 113, 227, 0.35), transparent 60%);
  top: -160px;
  left: -120px;
}

.ambient-green {
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(50, 205, 94, 0.32), transparent 60%);
  bottom: -100px;
  right: -80px;
}

.shell-nav {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-mark {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 18px 40px rgba(15, 23, 42, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-mark span {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: radial-gradient(circle, #0071e3, #0051cc);
}

.brand h1 {
  margin: 0;
  font-size: 1.3rem;
  letter-spacing: -0.02em;
}

.support-link {
  color: var(--text-light);
  font-weight: 600;
}

.layout {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
  gap: clamp(32px, 5vw, 80px);
  align-items: start;
}

.hero-panel {
  order: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.quick-panel {
  order: 2;
}

.hero-head {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hero-panel h2 {
  font-size: clamp(2.2rem, 4vw, 2.8rem);
  letter-spacing: -0.04em;
}

.hero-panel .lede {
  color: var(--text-light);
  max-width: 520px;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.hero-card {
  padding: 18px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: linear-gradient(140deg, rgba(255, 255, 255, 0.95), rgba(244, 247, 255, 0.85));
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.1);
}

.stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.assurance-card {
  background: rgba(249, 250, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.assurance-card h4 {
  margin: 6px 0;
}

.assurance-copy {
  color: var(--text-light);
  margin: 6px 0 0;
  line-height: 1.5;
}

.tiny-label {
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.7rem;
  color: var(--text-light);
  margin-bottom: 6px;
}

.hero-capabilities {
  margin-top: 8px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 12px;
}

.cap-item {
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0.03);
  background: rgba(255, 255, 255, 0.82);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.cap-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
}

.cap-item strong {
  display: block;
  font-size: 0.92rem;
  margin-bottom: 4px;
}

.cap-item p {
  margin: 0;
  color: var(--text-light);
  font-size: 0.82rem;
}

.form-card {
  padding: 32px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.65);
  box-shadow: var(--shadow-soft);
}

.quick-panel {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.15);
}

.form-header h3 {
  font-size: 1.6rem;
  margin: 4px 0;
}

.form-header p {
  color: var(--text-light);
  margin-bottom: 16px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
}

.input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.95);
}

.form-group small {
  color: var(--text-light);
  font-size: 0.85rem;
}

.provider-hint {
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(239, 243, 255, 0.65);
  border: 1px solid rgba(0, 0, 0, 0.03);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.provider-hint h4 {
  margin: 4px 0 6px;
}

.provider-hint a {
  font-weight: 600;
  font-size: 0.9rem;
}

.checkbox-group {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  font-size: 0.9rem;
  color: var(--text-light);
}

.checkbox-group input {
  margin-top: 4px;
}

.primary-btn {
  width: 100%;
  padding: 16px;
  border-radius: 16px;
  background: linear-gradient(120deg, #0071e3, #2b6aff);
  color: white;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: 0 18px 32px rgba(0, 113, 227, 0.35);
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-size: 0.72rem;
  color: var(--text-light);
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .hero-panel {
    order: 2;
  }

  .quick-panel {
    order: 1;
  }

  .hero-stats {
    grid-template-columns: 1fr;
  }

  .form-card {
    max-width: none;
  }
}

@media (max-width: 640px) {
  .setup-shell {
    padding: 32px 16px 48px;
  }

  .shell-nav {
    flex-direction: column;
    gap: 16px;
  }

  .form-card {
    padding: 24px;
  }
}
</style>
