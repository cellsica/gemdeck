<script setup lang="ts">
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  title: string
  initialData?: { role: string, name: string, description: string, iconUrl: string, gemUrl: string }
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', data: { role: string, name: string, description: string, iconUrl: string, gemUrl: string }): void
}>()

const form = ref({
  role: '',
  name: '',
  description: '',
  iconUrl: '',
  gemUrl: 'https://gemini.google.com/gems/'
})

const save = () => {
  emit('save', { ...form.value })
}

const resetForm = () => {
  if (props.initialData) {
    form.value = { ...props.initialData }
  } else {
    form.value = {
      role: '',
      name: '',
      description: '',
      iconUrl: '',
      gemUrl: 'https://gemini.google.com/gems/'
    }
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) resetForm()
})

watch(() => props.initialData, () => {
  if (props.isOpen) resetForm()
}, { deep: true })
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- 背景オーバーレイ -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="emit('close')"></div>
    
    <!-- モーダル本体 -->
    <div class="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
        <h2 class="text-xl font-bold text-slate-800 dark:text-white">{{ title }}</h2>
        <button @click="emit('close')" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Gemの名前</label>
          <input v-model="form.name" type="text" placeholder="例: Code Buddy" class="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
        </div>

        <div>
          <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">担当分野 (Role)</label>
          <input v-model="form.role" type="text" placeholder="例: Python Specialist" class="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
        </div>

        <div>
          <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">説明 (Description)</label>
          <textarea v-model="form.description" rows="3" placeholder="何を得意とする専門家か教えてください..." class="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"></textarea>
        </div>

        <div>
          <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">GemのURL (unique-id含む)</label>
          <input v-model="form.gemUrl" type="text" placeholder="https://gemini.google.com/gems/..." class="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
        </div>

        <div>
          <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">アイコンURL (任意)</label>
          <input v-model="form.iconUrl" type="text" placeholder="https://..." class="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
        </div>
      </div>

      <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
        <button @click="emit('close')" class="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          キャンセル
        </button>
        <button @click="save" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all">
          保存する
        </button>
      </div>
    </div>
  </div>
</template>
