<template>
  <div class="setup-container">
    <div class="setup-card">
      <div class="header">
         <h1>ADI Writer</h1>
         <p>书写你的故事</p>
       </div>

       <div class="content">
         <div class="info-box">
           <h2>欢迎使用 ADI Writer</h2>
           <p>你是否曾有过天马行空的想法，却苦于无法用语言表达？使用 ADI Writer，帮助你完成剧本、小说、诗歌、传记，书写你的故事。</p>
           <p>首次使用需要配置您的 API 密钥。</p>
         </div>

        <form @submit.prevent="handleSubmit" class="form">
           <div class="form-group">
             <label for="provider">选择 AI 模型提供商</label>
             <select v-model="selectedProvider" id="provider" class="input">
               <option value="openai">OpenAI (GPT-4o Mini)</option>
               <option value="gemini">Google Gemini (Gemini 1.5 Flash)</option>
               <option value="deepseek">DeepSeek</option>
               <option value="thirdparty">Custom Service (Third-party)</option>
             </select>
           </div>

           <div class="provider-info">
             <div v-if="selectedProvider === 'openai'" class="info">
               <h4>OpenAI</h4>
               <p>获取 API 密钥：<a href="https://platform.openai.com/api-keys" target="_blank">platform.openai.com</a></p>
             </div>
             <div v-else-if="selectedProvider === 'gemini'" class="info">
               <h4>Google Gemini</h4>
               <p>获取 API 密钥：<a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a></p>
             </div>
             <div v-else-if="selectedProvider === 'deepseek'" class="info">
               <h4>DeepSeek</h4>
               <p>获取 API 密钥：<a href="https://platform.deepseek.com/api" target="_blank">platform.deepseek.com</a></p>
             </div>
             <div v-else-if="selectedProvider === 'thirdparty'" class="info">
               <h4>Custom Service</h4>
               <p>使用您自己的 API 服务或第三方提供商</p>
             </div>
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
             <small>您的 API 密钥仅保存在本地浏览器中</small>
           </div>

           <div v-if="selectedProvider === 'thirdparty'" class="form-group">
             <label for="endpoint">API 端点</label>
             <input
               v-model="customEndpoint"
               id="endpoint"
               type="url"
               class="input"
               placeholder="例如: https://api.example.com/v1/chat/completions"
               required
             />
             <small>您的自定义 API 端点地址</small>
           </div>

           <div v-if="selectedProvider === 'thirdparty'" class="form-group">
             <label for="model">模型名称</label>
             <input
               v-model="customModel"
               id="model"
               type="text"
               class="input"
               placeholder="例如: gpt-4o-mini"
               required
             />
             <small>您要使用的模型名称</small>
           </div>

          <div class="checkbox-group">
            <input
              v-model="agreeTerms"
              id="agree"
              type="checkbox"
              required
            />
            <label for="agree">
              我同意将 API 密钥存储在本地浏览器中并同意
              <a href="#" @click.prevent>隐私政策</a>
            </label>
          </div>

          <button type="submit" class="submit-btn" :disabled="!agreeTerms || !apiKey || (selectedProvider === 'thirdparty' && (!customEndpoint || !customModel))">
            开始使用
          </button>
        </form>

        <div class="features">
          <h3>功能特性</h3>
          <ul>
            <li>✨ 小说内容扩写</li>
            <li>🔧 文本润色优化</li>
            <li>🔐 API 密钥本地存储</li>
            <li>🎨 简洁易用的界面</li>
            <li>🌐 开源免费</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '../stores/app'

const appStore = useAppStore()
const selectedProvider = ref<'openai' | 'gemini' | 'deepseek' | 'thirdparty'>('openai')
const apiKey = ref('')
const customEndpoint = ref('')
const customModel = ref('')
const agreeTerms = ref(false)

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
.setup-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(180deg, #f5f5f7 0%, #ffffff 100%);
}

.setup-card {
  background: var(--bg-white);
  border-radius: 20px;
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 600px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.header {
  background: linear-gradient(180deg, #007aff 0%, #0051cc 100%);
  color: white;
  padding: 40px 30px;
  text-align: center;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 8px;
  font-weight: 700;
}

.header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.content {
  padding: 40px 30px;
}

.info-box {
  background: rgba(0, 122, 255, 0.08);
  border-left: none;
  border-radius: 12px;
  padding: 15px 20px;
  margin-bottom: 30px;
  border: 1px solid rgba(0, 122, 255, 0.15);
}

.info-box h2 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: var(--text-color);
}

.info-box p {
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 8px;
}

.form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-color);
}

.input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f5f5f7;
}

.input:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: var(--bg-white);
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
}

.form-group small {
  display: block;
  margin-top: 4px;
  color: var(--text-light);
  font-size: 0.85rem;
}

.provider-info {
  background: #f5f5f7;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
}

.provider-info .info h4 {
  margin-bottom: 8px;
  color: var(--text-color);
}

.provider-info .info p {
  color: var(--text-light);
  font-size: 0.95rem;
}

.provider-info a {
  color: var(--primary-color);
  font-weight: 600;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.checkbox-group input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-group label {
  margin: 0;
  font-weight: normal;
  color: var(--text-light);
}

.checkbox-group a {
  color: var(--primary-color);
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(180deg, #007aff 0%, #0051cc 100%);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(0, 122, 255, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.features {
  border-top: 1px solid var(--border-color);
  padding-top: 30px;
}

.features h3 {
  font-size: 1.1rem;
  margin-bottom: 15px;
  color: var(--text-color);
}

.features ul {
  list-style: none;
}

.features li {
  padding: 8px 0;
  color: var(--text-light);
  font-size: 0.95rem;
}
</style>
