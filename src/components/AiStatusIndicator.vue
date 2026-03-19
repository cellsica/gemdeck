<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RefreshCcw } from 'lucide-vue-next'

interface StatusInfo {
  name: string
  status: 'normal' | 'minor' | 'major' | 'unknown'
  url: string
}

const statusList = ref<StatusInfo[]>([
  { name: 'Gemini', status: 'unknown', url: 'https://aistudio.google.com/status' },
  { name: 'Claude', status: 'unknown', url: 'https://status.anthropic.com/' },
  { name: 'OpenAI', status: 'unknown', url: 'https://status.openai.com/' }
])

const FETCH_INTERVAL = 30 * 60 // 30 minutes in seconds
const remainingSeconds = ref(FETCH_INTERVAL)
const isFetching = ref(false)

let ticker: number | null = null

// CORS回避のためのプロキシ
const PROXY_URL = 'https://api.allorigins.win/get?url='

const fetchStatusPageIO = async (apiUrl: string, serviceName: string) => {
  try {
    const res = await fetch(`${PROXY_URL}${encodeURIComponent(apiUrl)}`)
    const data = await res.json()
    const parsedData = JSON.parse(data.contents)
    const indicator = parsedData.status.indicator
    
    const service = statusList.value.find(s => s.name === serviceName)
    if (service) {
      if (indicator === 'none') service.status = 'normal'
      else if (indicator === 'minor' || indicator === 'maintenance') service.status = 'minor'
      else if (indicator === 'major' || indicator === 'critical') service.status = 'major'
      else service.status = 'unknown'
    }
  } catch (e) {
    console.error(`Failed to fetch ${serviceName} status:`, e)
    const service = statusList.value.find(s => s.name === serviceName)
    if (service) service.status = 'unknown'
  }
}

const fetchGeminiStatus = async () => {
  try {
    const geminiUrl = 'https://status.cloud.google.com/en/feed.atom'
    const res = await fetch(`${PROXY_URL}${encodeURIComponent(geminiUrl)}`)
    const data = await res.json()
    const parser = new DOMParser()
    const xml = parser.parseFromString(data.contents, 'text/xml')
    const entries = xml.querySelectorAll('entry')
    
    let isDisrupted = false
    let isMajor = false
    
    entries.forEach((entry, index) => {
      if (index > 5) return
      const title = entry.querySelector('title')?.textContent || ''
      if (title.includes('Service Disruption') || title.includes('Service Outage')) {
        isDisrupted = true
        if (title.includes('Service Outage')) isMajor = true
      }
    })

    const gemini = statusList.value.find(s => s.name === 'Gemini')
    if (gemini) {
      if (isMajor) gemini.status = 'major'
      else if (isDisrupted) gemini.status = 'minor'
      else gemini.status = 'normal'
    }
  } catch (e) {
    console.error('Failed to fetch Gemini status:', e)
    const gemini = statusList.value.find(s => s.name === 'Gemini')
    if (gemini) gemini.status = 'unknown'
  }
}

const fetchStatus = async () => {
  if (isFetching.value) return
  isFetching.value = true
  
  await Promise.all([
    fetchGeminiStatus(),
    fetchStatusPageIO('https://status.anthropic.com/api/v2/status.json', 'Claude'),
    fetchStatusPageIO('https://status.openai.com/api/v2/status.json', 'OpenAI')
  ])
  
  isFetching.value = false
  remainingSeconds.value = FETCH_INTERVAL
}

onMounted(() => {
  fetchStatus()
  ticker = window.setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value--
    } else {
      fetchStatus()
    }
  }, 1000)
})

onUnmounted(() => {
  if (ticker) clearInterval(ticker)
})

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

const getStatusColor = (status: StatusInfo['status']) => {
  switch (status) {
    case 'normal': return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
    case 'minor': return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
    case 'major': return 'bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.5)]'
    default: return 'bg-slate-400'
  }
}
</script>

<template>
  <div class="flex items-center ml-2 sm:ml-4 px-2 sm:px-3 py-1 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-xl backdrop-blur-sm transition-all h-fit self-center">
    <!-- ステータスリスト -->
    <div class="grid grid-rows-2 grid-flow-col gap-x-3 gap-y-0">
      <a 
        v-for="item in statusList" 
        :key="item.name"
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-1.5 hover:opacity-80 transition-all group py-0.5"
        :title="`${item.name}：${item.status === 'normal' ? '正常' : item.status === 'unknown' ? '確認中' : '障害発生中'}`"
      >
        <span :class="['w-1.5 h-1.5 rounded-full transition-colors', getStatusColor(item.status)]"></span>
        <span class="text-[8px] sm:text-[9px] font-black text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 whitespace-nowrap uppercase tracking-tighter">
          {{ item.name }}
        </span>
      </a>
    </div>

    <!-- 更新セクション -->
    <div class="flex flex-col items-center justify-center pl-2 ml-2 border-l border-slate-200 dark:border-slate-700 min-w-[32px]">
      <button 
        @click="fetchStatus"
        class="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors text-slate-400 hover:text-indigo-500 active:scale-90"
        :disabled="isFetching"
        title="今すぐ更新"
      >
        <RefreshCcw :class="['w-3 h-3', isFetching ? 'animate-spin text-indigo-500' : '']" />
      </button>
      <span class="text-[7px] font-mono font-bold text-slate-400 dark:text-slate-500 leading-none">
        {{ formatTime(remainingSeconds) }}
      </span>
    </div>
  </div>
</template>
