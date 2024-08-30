export interface Episode {
  id: string
  user_id: string
  feed_id: string
  title: string
  description: string
  transcribed: boolean
  duration: number
  published_at: string
}
