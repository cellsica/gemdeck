import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export interface Gem {
  id: string
  role: string
  name: string
  description: string
  iconUrl: string
  gemUrl: string
}

export const useGemStore = defineStore('gem', () => {
  const gems = useStorage<Gem[]>('gem-deck-data', [
    {
      id: 'mock-1',
      role: 'Python Specialist',
      name: 'Code Buddy',
      description: 'Vue.jsやPythonのコードレビュー、デバッグを担当。',
      iconUrl: '', // 空の場合は頭文字を表示
      gemUrl: 'https://gemini.google.com/gems/'
    },
    {
      id: 'mock-2',
      role: 'Creative Writer',
      name: 'Story Weaver',
      description: '小説のプロット作成やキャラクター設定の壁打ち相手。',
      iconUrl: '',
      gemUrl: 'https://gemini.google.com/gems/'
    }
  ])

  return {
    gems
  }
})
