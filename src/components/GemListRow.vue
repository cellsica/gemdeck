<script setup lang="ts">
import { computed } from 'vue'
import { useGemStore, type Gem } from '../stores/gemStore'
import { Pencil, Pin, PinOff, ExternalLink } from 'lucide-vue-next'

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

const displayIconUrl = computed(() => {
  if (!props.gem.iconUrl) return ''
  const driveMatch = props.gem.iconUrl.match(/\/file\/d\/([^\/]+)/)
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`
  }
  return props.gem.iconUrl
})

const bgColor = computed(() => {
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-indigo-500', 'bg-teal-500', 'bg-rose-500']
  const index = props.gem.name.length % colors.length
  return colors[index]
})

const firstLetter = computed(() => props.gem.name.charAt(0).toUpperCase())
</script>

<template>
  <div class="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all group animate-in fade-in slide-in-from-left-2 duration-300">
    <!-- アイコン -->
    <button @click="handleOpenGem" class="shrink-0 relative group/icon">
      <img v-if="displayIconUrl" :src="displayIconUrl" class="w-10 h-10 rounded-full object-cover border border-slate-100 dark:border-slate-700 group-hover/icon:brightness-50 transition-all" />
      <div v-else :class="['w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-inner group-hover/icon:brightness-50 transition-all', bgColor]">
        {{ firstLetter }}
      </div>
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover/icon:opacity-100 transition-all">
        <ExternalLink class="w-4 h-4 text-white" />
      </div>
    </button>

    <!-- 名前とロール -->
    <div class="flex-1 min-w-0 cursor-pointer" @click="handleOpenGem">
      <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {{ gem.name }}
      </h3>
      <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 truncate uppercase mt-0.5">{{ gem.role || 'Expert' }}</p>
    </div>

    <!-- アクションボタン -->
    <div class="flex items-center gap-1">
      <button 
        @click="emit('edit', gem)"
        class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400"
        title="編集"
      >
        <Pencil class="w-4 h-4" />
      </button>

      <button 
        @click="gemStore.togglePin(gem.id)"
        class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        :class="gem.isPinned ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-600 hover:text-slate-500'"
        :title="gem.isPinned ? 'ピン留めを解除' : 'ピン留めする'"
      >
        <Pin v-if="gem.isPinned" class="w-4 h-4 fill-current" />
        <PinOff v-else class="w-4 h-4 opacity-40 hover:opacity-100 transition-opacity" />
      </button>
    </div>
  </div>
</template>
