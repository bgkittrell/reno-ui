<script setup lang="ts">
import type { Episode } from '@/types'
import { format } from 'date-fns'

const { episodes } = defineProps<{ episodes: Episode[] }>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4">
    <div v-for="episode in episodes" :key="episode.id">
      <div class="flex items-center">
        <span
          class="rounded-full bg-green-400 w-2 h-2 inline-block mr-2"
          v-if="episode.transcribed"
        ></span>
        <span class="rounded-full bg-orange-400 w-2 h-2 inline-block mr-2" v-else></span>
        <span>{{ episode.title }} - {{ format(episode.published_at, 'MMM dd yyyy @ hh:mm') }}</span>
      </div>
    </div>
  </div>
</template>
