<script setup lang="ts">
import { ref } from 'vue'
import { useGemStore } from '../stores/gemStore'
import { X, Download, Upload, ShieldCheck, AlertCircle } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const gemStore = useGemStore()
const fileInput = ref<HTMLInputElement | null>(null)
const status = ref<{ type: 'success' | 'error', message: string } | null>(null)

const handleExport = () => {
  const data = gemStore.exportGems()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `gem-deck-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  
  status.value = { type: 'success', message: 'バックアップを保存したぞ！' }
  setTimeout(() => status.value = null, 3000)
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleImport = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    if (gemStore.importGems(content)) {
      status.value = { type: 'success', message: 'リストを復元したぞ！完璧だ。' }
    } else {
      status.value = { type: 'error', message: 'ファイルの読み込みに失敗した。JSON形式か確認してくれ。' }
    }
    setTimeout(() => status.value = null, 3000)
    target.value = '' // リセット
  }
  reader.readAsText(file)
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="emit('close')"></div>
    
    <div class="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
        <h2 class="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <ShieldCheck class="w-5 h-5 text-indigo-500" />
          GemDeck 設定
        </h2>
        <button @click="emit('close')" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 space-y-6">
        <!-- バックアップ/復元 -->
        <section>
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">データの管理とポータビリティ</h3>
          <div class="grid grid-cols-2 gap-4">
            <button 
              @click="handleExport"
              class="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all group"
            >
              <Download class="w-6 h-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <span class="text-sm font-bold text-slate-600 dark:text-slate-300">エクスポート</span>
            </button>

            <button 
              @click="triggerFileInput"
              class="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all group"
            >
              <Upload class="w-6 h-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <span class="text-sm font-bold text-slate-600 dark:text-slate-300">インポート</span>
            </button>
          </div>
          <input 
            ref="fileInput" 
            type="file" 
            accept=".json" 
            class="hidden" 
            @change="handleImport"
          />
        </section>

        <!-- ステータスメッセージ -->
        <div v-if="status" :class="['p-3 rounded-lg flex items-center gap-2 text-sm font-bold animate-in slide-in-from-top-2', status.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400']">
          <AlertCircle v-if="status.type === 'error'" class="w-4 h-4" />
          {{ status.message }}
        </div>

        <section class="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div class="text-center text-[10px] text-slate-400 font-medium">
            GemDeck v0.1.0 - Premium Security Design<br>
            Created for nabe by kaede
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
