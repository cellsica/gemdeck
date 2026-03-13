<script setup lang="ts">
import { useGemStore } from './stores/gemStore'
import GemCard from './components/GemCard.vue'
import { Plus, Settings2 } from 'lucide-vue-next'

const gemStore = useGemStore()
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
    <!-- ヘッダー -->
    <header class="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">
            G
          </div>
          <h1 class="text-xl font-bold tracking-tight">GemDeck</h1>
        </div>
        
        <div class="flex items-center gap-3">
          <button class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500" title="設定">
            <Settings2 class="w-5 h-5" />
          </button>
          <button class="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity shadow-sm">
            <Plus class="w-4 h-4" />
            Add Gem
          </button>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- グリッドレイアウト -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <GemCard 
          v-for="gem in gemStore.gems" 
          :key="gem.id" 
          :gem="gem" 
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
