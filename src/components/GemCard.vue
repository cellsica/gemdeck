<script setup lang="ts">
import { computed } from 'vue'
import { useGemStore, type Gem } from '../stores/gemStore'
import { ExternalLink, Pencil } from 'lucide-vue-next'

const props = defineProps<{
  gem: Gem
}>()

const emit = defineEmits<{
  (e: 'edit', gem: Gem): void
}>()

const gemStore = useGemStore()

const firstLetter = computed(() => props.gem.name.charAt(0).toUpperCase())

// アイコンがない場合の背景色を名前から生成
const bgColor = computed(() => {
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-indigo-500', 'bg-teal-500', 'bg-rose-500']
  const index = props.gem.name.length % colors.length
  return colors[index]
})
</script>

<template>
  <div class="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <!-- 装飾的なヘッダー（セキュリティカード風のライン） -->
    <div class="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
    
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
        <!-- アイコン部分 -->
        <div class="shrink-0">
          <img v-if="gem.iconUrl" :src="gem.iconUrl" :alt="gem.name" class="w-16 h-16 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700" />
          <div v-else :class="['w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-inner', bgColor]">
            {{ firstLetter }}
          </div>
        </div>

        <!-- 名前とリンク -->
        <div class="flex-1 min-w-0">
          <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {{ gem.name }}
          </h3>
          <a @click="gemStore.touchGem(gem.id)" :href="gem.gemUrl" target="_blank" class="inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-600 font-medium mt-1">
            Open Gem <ExternalLink class="w-3 h-3" />
          </a>
        </div>
      </div>

      <!-- 説明 -->
      <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
        {{ gem.description }}
      </p>
    </div>

    <!-- カード下部の「チップ」っぽい装飾 -->
    <div class="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-top border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-mono">
      <span>ID: {{ gem.id.slice(0, 8) }}</span>
      <span class="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">ACTIVE</span>
    </div>
  </div>
</template>
