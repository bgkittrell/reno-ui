import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { ref, type Ref } from 'vue'
import type { Episode } from '@/types'

export const useEpisodesStore = defineStore('episodes', () => {
  const authStore = useAuthStore()
  const episodes: Ref<Episode[]> = ref([])
  const areEpisodesLoaded = ref(false)
  const timer: any = ref(null)

  const fetchEpisodes = async (feed_id: string) => {
    const response = await axios.get(
      `${import.meta.env.VITE_PODCAST_API_URI}/feeds/${feed_id}/episodes`,
      {
        headers: await authStore.getAuthHeaders()
      }
    )
    episodes.value = response.data
    areEpisodesLoaded.value = true
  }

  const startPolling = async (feed_id: string) => {
    timer.value = setInterval(() => {
      fetchEpisodes(feed_id)
    }, 10000)
  }

  const stopPolling = () => {
    clearInterval(timer.value)
  }

  return {
    episodes,
    fetchEpisodes,
    areEpisodesLoaded,
    startPolling,
    stopPolling
  }
})
