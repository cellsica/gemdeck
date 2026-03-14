<script setup lang="ts">
import { computed } from 'vue'
import { useGemStore, type Gem } from '../stores/gemStore'
import { ExternalLink, Pencil, Pin, PinOff } from 'lucide-vue-next'

const props = defineProps<{
  gem: Gem
}>()

const emit = defineEmits<{
  (e: 'edit', gem: Gem): void
}>()

const gemStore = useGemStore()

const handleOpenGem = () => {
  gemStore.touchGem(props.gem.id)
  window.open(props.gem.gemUrl, '_blank')
}

const firstLetter = computed(() => props.gem.name.charAt(0).toUpperCase())

// Google Drive のプレビュー用URLなどを直接表示用URLに変換
const displayIconUrl = computed(() => {
  if (!props.gem.iconUrl) return ''
  
  // Google Drive の共有リンクパターン: https://drive.google.com/file/d/ID/view?usp=sharing
  const driveMatch = props.gem.iconUrl.match(/\/file\/d\/([^\/]+)/)
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`
  }
  
  return props.gem.iconUrl
})

// アイコンがない場合の背景色を名前から生成
const bgColor = computed(() => {
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-indigo-500', 'bg-teal-500', 'bg-rose-500']
  const index = props.gem.name.length % colors.length
  return colors[index]
})

// URL からAIサービスを判定する
const aiServiceName = computed(() => {
  const url = props.gem.gemUrl.toLowerCase()
  if (url.includes('claude.ai')) return 'Claude'
  if (url.includes('chatgpt.com') || url.includes('chat.openai.com')) return 'ChatGPT'
  if (url.includes('perplexity.ai')) return 'Perplexity'
  if (url.includes('copilot.microsoft.com')) return 'Copilot'
  if (url.includes('v0.dev')) return 'v0'
  if (url.includes('ai.rakuten.co.jp')) return 'Rakuten'
  if (url.includes('gemini.google.com')) return 'Gem'
  return 'Link'
})
</script>

<template>
  <div class="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <!-- 装飾的なヘッダー（セキュリティカード風のライン） -->
    <div class="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
    
    <!-- 背景のゴーストアイコン演出 -->
    <div v-if="displayIconUrl" class="absolute top-0 right-0 w-2/3 h-full pointer-events-none opacity-0 group-hover/icon:opacity-10 dark:group-hover/icon:opacity-20 transition-all duration-700 ease-out z-0 overflow-hidden">
      <img 
        :src="displayIconUrl" 
        class="absolute -right-4 top-1/2 -translate-y-1/2 w-48 h-48 object-cover rounded-full blur-sm [mask-image:linear-gradient(to_left,black,transparent)]" 
        alt=""
      />
    </div>
    
    <!-- 編集ボタン (右上) -->
    <button 
      @click="emit('edit', gem)"
      class="absolute top-4 right-4 p-2 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
      title="編集"
    >
      <Pencil class="w-3.5 h-3.5 text-slate-500" />
    </button>

    <div class="p-5">
      <!-- Role (担当分野) -->
      <div class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
        {{ gem.role }}
      </div>

      <div class="flex items-start gap-4 mb-4">
        <!-- アイコン部分 (クリックで開く) -->
        <button @click="handleOpenGem" class="shrink-0 group/icon relative overflow-hidden rounded-full">
          <img v-if="displayIconUrl" :src="displayIconUrl" :alt="gem.name" class="w-16 h-16 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700 group-hover/icon:brightness-50 transition-all duration-300 transform group-hover/icon:scale-110" />
          <div v-else :class="['w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-inner group-hover/icon:brightness-50 transition-all duration-300 transform group-hover/icon:scale-110', bgColor]">
            {{ firstLetter }}
          </div>
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover/icon:opacity-100 transition-all duration-300">
            <ExternalLink class="w-7 h-7 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          </div>
        </button>

        <!-- 名前とリンク -->
        <div class="flex-1 min-w-0">
          <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 truncate group-hover/title:text-indigo-600 dark:group-hover/title:text-indigo-400 transition-colors">
            {{ gem.name }}
          </h3>
          <button @click="handleOpenGem" class="inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-600 font-medium mt-1">
            Open {{ aiServiceName }} <ExternalLink class="w-3 h-3" />
          </button>
        </div>
      </div>

      <!-- 説明 -->
      <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
        {{ gem.description }}
      </p>
    </div>

    <!-- カード下部 (Pin留め切り替え) -->
    <button 
      @click="gemStore.togglePin(gem.id)"
      class="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center transition-colors hover:bg-slate-100 dark:hover:bg-slate-700/50"
      :title="gem.isPinned ? 'ピン留めを解除' : 'ピン留めする'"
    >
      <span class="text-[10px] font-mono text-slate-400">ID: {{ gem.id.slice(0, 8) }}</span>
      <div class="flex items-center" :class="gem.isPinned ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-600'">
        <Pin v-if="gem.isPinned" class="w-5 h-5 fill-current" />
        <PinOff v-else class="w-5 h-5 opacity-40 transition-opacity hover:opacity-100" />
      </div>
    </button>
  </div>
</template>
