<script setup lang="ts">
import { ref } from 'vue'
import { useGemStore, type Gem } from './stores/gemStore'
import GemCard from './components/GemCard.vue'
import GemEditModal from './components/GemEditModal.vue'
import SettingsModal from './components/SettingsModal.vue'
import { Plus, Settings2, ArrowUpDown } from 'lucide-vue-next'

const gemStore = useGemStore()
const isModalOpen = ref(false)
const isSettingsOpen = ref(false)
const editingGem = ref<Gem | null>(null)

const openAddModal = () => {
  editingGem.value = null
  isModalOpen.value = true
}

const openEditModal = (gem: Gem) => {
  editingGem.value = gem
  isModalOpen.value = true
}

const handleSaveGem = (data: any) => {
  if (editingGem.value) {
    gemStore.updateGem(editingGem.value.id, data)
  } else {
    gemStore.addGem(data)
  }
  isModalOpen.value = false
}

const handleDeleteGem = () => {
  if (editingGem.value) {
    gemStore.deleteGem(editingGem.value.id)
    isModalOpen.value = false
  }
}

const toggleSort = () => {
  gemStore.sortBy = gemStore.sortBy === 'name' ? 'lastUsed' : 'name'
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
    <!-- ヘッダー -->
    <header class="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30 text-[18px]">
            G
          </div>
          <div>
            <h1 class="text-xl font-bold tracking-tight leading-none">GemDeck</h1>
            <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Powered by Cellsica</span>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <button 
            @click="toggleSort"
            class="hidden sm:flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-400 text-sm font-medium"
            :title="gemStore.sortBy === 'name' ? '名前順で表示中' : '最近使った順で表示中'"
          >
            <ArrowUpDown class="w-4 h-4" />
            <span class="hidden md:inline">{{ gemStore.sortBy === 'name' ? '名前順' : '最近使った順' }}</span>
          </button>
          
          <button 
            @click="isSettingsOpen = true"
            class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500" 
            title="設定"
          >
            <Settings2 class="w-5 h-5" />
          </button>
          
          <button 
            @click="openAddModal"
            class="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity shadow-sm active:scale-95"
          >
            <Plus class="w-4 h-4" />
            <span class="hidden sm:inline">Add Gem</span>
          </button>
        </div>
      </div>
    </header>

    <GemEditModal 
      :is-open="isModalOpen" 
      :title="editingGem ? 'Gemを編集' : '新しいGemを召喚'" 
      :initial-data="editingGem || undefined"
      @close="isModalOpen = false"
      @save="handleSaveGem"
      @delete="handleDeleteGem"
    />

    <SettingsModal 
      :is-open="isSettingsOpen" 
      @close="isSettingsOpen = false"
    />

    <!-- メインコンテンツ -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- グリッドレイアウト -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <GemCard 
          v-for="gem in gemStore.sortedGems" 
          :key="gem.id" 
          :gem="gem" 
          @edit="openEditModal"
        />
      </div>
      
      <!-- データが空の場合 -->
      <div v-if="gemStore.gems.length === 0" class="text-center py-20">
        <div class="text-slate-400 mb-4 text-6xl">📭</div>
        <p class="text-slate-500 font-medium">Gemがまだ登録されてないよ。</p>
      </div>
    </main>
  </div>
</template>

<style>
/* インターフォントの読み込み（簡易版） */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
</style>
