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
  isPinned?: boolean
}

export type SortBy = 'name' | 'lastUsed'

export const useGemStore = defineStore('gem', () => {
  const gems = useStorage<Gem[]>('gem-deck-data', [])

  const sortBy = ref<SortBy>('name')

  const sortedGems = computed(() => {
    const list = [...gems.value]
    
    return list.sort((a, b) => {
      // 1. ピン留めを最優先
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      
      // 2. その後に選択されたソート順
      if (sortBy.value === 'name') {
        return a.name.localeCompare(b.name, 'ja')
      } else if (sortBy.value === 'lastUsed') {
        return (b.lastUsedAt || 0) - (a.lastUsedAt || 0)
      }
      return 0
    })
  })

  const addGem = (gemData: Omit<Gem, 'id' | 'lastUsedAt' | 'isPinned'>) => {
    const newGem: Gem = {
      ...gemData,
      id: crypto.randomUUID(),
      lastUsedAt: Date.now(),
      isPinned: false
    }
    gems.value.push(newGem)
  }

  const updateGem = (id: string, gemData: Omit<Gem, 'id' | 'lastUsedAt' | 'isPinned'>) => {
    const index = gems.value.findIndex(g => g.id === id)
    if (index !== -1) {
      gems.value[index] = {
        ...gems.value[index],
        ...gemData,
        lastUsedAt: Date.now()
      }
    }
  }

  const deleteGem = (id: string) => {
    gems.value = gems.value.filter(g => g.id !== id)
  }

  const touchGem = (id: string) => {
    const gem = gems.value.find(g => g.id === id)
    if (gem) {
      gem.lastUsedAt = Date.now()
    }
  }

  const togglePin = (id: string) => {
    const gem = gems.value.find(g => g.id === id)
    if (gem) {
      gem.isPinned = !gem.isPinned
    }
  }

  const exportGems = () => {
    return JSON.stringify(gems.value, null, 2)
  }

  const importGems = (jsonContent: string) => {
    try {
      const data = JSON.parse(jsonContent)
      if (Array.isArray(data)) {
        // IDが重複しないようにマージするか、上書きするか
        // 今回は「バックアップからの復元」なので、一旦まるごと上書きする
        gems.value = data
        return true
      }
    } catch (e) {
      console.error('Failed to import gems:', e)
    }
    return false
  }

  return {
    gems,
    sortBy,
    sortedGems,
    addGem,
    updateGem,
    deleteGem,
    touchGem,
    togglePin,
    exportGems,
    importGems
  }
})
