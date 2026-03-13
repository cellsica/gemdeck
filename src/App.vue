<script setup lang="ts">
import { ref } from 'vue'
import { useGemStore, type Gem } from './stores/gemStore'
import GemCard from './components/GemCard.vue'
import GemEditModal from './components/GemEditModal.vue'
import SettingsModal from './components/SettingsModal.vue'
import { Plus, Settings2, ArrowUpDown, Sparkles } from 'lucide-vue-next'

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
      <!-- Gemが存在する場合 -->
      <div v-if="gemStore.sortedGems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <GemCard 
          v-for="gem in gemStore.sortedGems" 
          :key="gem.id" 
          :gem="gem" 
          @edit="openEditModal"
        />
      </div>

      <!-- Gemが1つもない場合（チュートリアル表示） -->
      <div v-else class="max-w-2xl mx-auto mt-12 mb-20 animate-in fade-in zoom-in duration-500">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <!-- 背景装飾 -->
          <div class="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

          <div class="relative z-10 flex flex-col items-center text-center">
            <div class="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl shadow-xl shadow-indigo-500/20 flex items-center justify-center mb-8 rotate-3">
              <Sparkles class="w-10 h-10 text-white" />
            </div>
            
            <h2 class="text-3xl font-black text-slate-800 dark:text-white mb-4 tracking-tight">Welcome to GemDeck</h2>
            <p class="text-slate-500 dark:text-slate-400 mb-10 max-w-md leading-relaxed text-sm">
              Your personal command center for Gemini Custom Gems. It looks like your deck is empty. Let's get started:
            </p>

            <div class="w-full space-y-4 text-left max-w-sm">
              <div class="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-all hover:scale-[1.02]">
                <div class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <div>
                  <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200">Invoke Your Gems</h4>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Click the "Add Gem" button at the top right to register your favorite custom experts.</p>
                </div>
              </div>

              <div class="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-all hover:scale-[1.02]">
                <div class="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <div>
                  <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200">Copy URL from Gemini</h4>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Visit your Gem and copy the address bar URL — it's better than share links!</p>
                </div>
              </div>

              <div class="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-all hover:scale-[1.02]">
                <div class="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                <div>
                  <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200">Pin Your Favorites</h4>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Use the Pin button to keep your most-used specialists at the top of your deck.</p>
                </div>
              </div>
            </div>

            <button 
              @click="openAddModal"
              class="mt-12 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all text-sm flex items-center gap-2"
            >
              <Plus class="w-4 h-4" />
              Create Your First Gem
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
/* インターフォントの読み込み（簡易版） */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
</style>
