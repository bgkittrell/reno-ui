<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useFeedsStore } from '@/stores/feeds'
import { useEpisodesStore } from '@/stores/episodes'
import EpisodeList from './EpisodeList.vue'
import { useToast } from 'vue-toastification'
import type { Feed } from '@/types'
import { format } from 'date-fns'
import { TrashIcon } from '@heroicons/vue/24/solid'
import { TableColumn, TableRow } from '@/components/Tables'
import EditableText from '@/components/Forms/EditableText.vue'
import DeleteModal from '../Modals/DeleteModal.vue'
import { ChevronRightIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
const showDeleteModal = ref(false)

const feedStore = useFeedsStore()
const episodesStore = useEpisodesStore()
const toast = useToast()
const collapsed = ref(true)

const handleDelete = async () => {
  await feedStore.deleteFeed(feed)
  toast.success('Feed deleted')
}

const handleUpdate = async () => {
  await feedStore.updateFeed(feed.id, {
    feed_name: feed.feed_name
  })
  toast.success('Feed updated')
}

const handleUpdateFeedName = async (id: string, feed_name: string) => {
  await feedStore.updateFeed(id, {
    feed_name
  })
  toast.success('Feed name updated')
}
const { feed } = defineProps<{
  feed: Feed
}>()

episodesStore.fetchEpisodes(feed.id)
onMounted(() => {
  episodesStore.startPolling(feed.id)
})
onUnmounted(() => {
  episodesStore.stopPolling()
})
</script>

<template>
  <TableRow span="5" :key="feed.id">
    <TableColumn span="2">
      <span>
        <ChevronRightIcon
          class="h-5 w-5 cursor-pointer"
          @click="collapsed = !collapsed"
          :class="{ 'transform rotate-90': !collapsed }"
        />
      </span>
      <EditableText @save="handleUpdateFeedName" :value="feed.feed_name" :id="feed.id" />
    </TableColumn>
    <TableColumn span="1">
      <div
        class="inline bg-primary rounded-full text-white text-xs px-2 py-1"
        v-if="episodesStore.areEpisodesLoaded"
      >
        {{ episodesStore.episodes.length }} episodes
      </div>
    </TableColumn>
    <TableColumn span="1">{{ format(feed.created_at, 'MMMM dd, yyyy') }}</TableColumn>
    <TableColumn span="1">
      <a @click="showDeleteModal = true" class="cursor-pointer mr-1" title="Delete Feed">
        <TrashIcon class="h-5 w-5" />
      </a>
      <a @click="handleUpdate" class="cursor-pointer" title="Update Feed">
        <ArrowPathIcon class="h-5 w-5" />
      </a>
    </TableColumn>
  </TableRow>
  <TableRow span="5" v-if="!collapsed">
    <TableColumn span="5">
      <EpisodeList :episodes="episodesStore.episodes" />
    </TableColumn>
  </TableRow>
  <DeleteModal
    v-if="showDeleteModal"
    title="Delete Audiobook"
    message="Are you sure you want to delete this audiobook?"
    @confirm="handleDelete"
    @close="showDeleteModal = false"
  />
</template>
