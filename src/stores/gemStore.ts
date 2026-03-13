import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export interface Gem {
  id: string
  role: string
  name: string
  description: string
  iconUrl: string
  gemUrl: string
  lastUsedAt?: number
}

export type SortBy = 'name' | 'lastUsed'

export const useGemStore = defineStore('gem', () => {
  const gems = useStorage<Gem[]>('gem-deck-data', [
    {
      id: 'mock-1',
      role: 'Python Specialist',
      name: 'Code Buddy',
      description: 'Vue.jsやPythonのコードレビュー、デバッグを担当。',
      iconUrl: '',
      gemUrl: 'https://gemini.google.com/gems/',
      lastUsedAt: Date.now()
    },
    {
      id: 'mock-2',
      role: 'Creative Writer',
      name: 'Story Weaver',
      description: '小説のプロット作成やキャラクター設定の壁打ち相手。',
      iconUrl: '',
      gemUrl: 'https://gemini.google.com/gems/',
      lastUsedAt: Date.now() - 100000 // 少し古くする
    }
  ])

  const sortBy = ref<SortBy>('name')

  const sortedGems = computed(() => {
    const list = [...gems.value]
    if (sortBy.value === 'name') {
      return list.sort((a, b) => a.name.localeCompare(b.name, 'ja'))
    } else if (sortBy.value === 'lastUsed') {
      return list.sort((a, b) => (b.lastUsedAt || 0) - (a.lastUsedAt || 0))
    }
    return list
  })

  const addGem = (gemData: Omit<Gem, 'id' | 'lastUsedAt'>) => {
    const newGem: Gem = {
      ...gemData,
      id: crypto.randomUUID(),
      lastUsedAt: Date.now()
    }
    gems.value.push(newGem)
  }

  const updateGem = (id: string, gemData: Omit<Gem, 'id' | 'lastUsedAt'>) => {
    const index = gems.value.findIndex(g => g.id === id)
    if (index !== -1) {
      gems.value[index] = {
        ...gems.value[index],
        ...gemData,
        lastUsedAt: Date.now()
      }
    }
  }

  const touchGem = (id: string) => {
    const gem = gems.value.find(g => g.id === id)
    if (gem) {
      gem.lastUsedAt = Date.now()
    }
  }

  return {
    gems,
    sortBy,
    sortedGems,
    addGem,
    updateGem,
    touchGem
  }
})
