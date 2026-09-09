import { onMounted, onUnmounted, ref } from 'vue'

interface Profile {
  rating: number | null
  rank: string
  savedAt: number
}

export function useCodeforces() {
  const profile = ref<Profile | null>(null)
  const status = ref('Loading Codeforces')
  const cacheKey = 'tfgkk:codeforces:v1'
  const controller = new AbortController()
  let timeout: ReturnType<typeof setTimeout> | undefined
  let storageAvailable = true

  onMounted(async () => {
    try {
      const cached: Profile | null = JSON.parse(localStorage.getItem(cacheKey) ?? 'null')
      if (
        cached &&
        (cached.rating === null || Number.isFinite(cached.rating)) &&
        typeof cached.rank === 'string' &&
        Number.isFinite(cached.savedAt) &&
        cached.savedAt <= Date.now() &&
        Date.now() - cached.savedAt < 15 * 60 * 1000
      ) {
        profile.value = cached
        status.value = 'Codeforces · cached'
        return
      }
    } catch {
      storageAvailable = false
    }

    timeout = setTimeout(() => controller.abort(), 5000)
    try {
      const response = await fetch('https://codeforces.com/api/user.info?handles=tfgkk', {
        signal: controller.signal,
      })
      if (!response.ok) throw new Error('Codeforces unavailable')
      const data: { status: string; result?: { rating?: number; rank?: string }[] } =
        await response.json()
      const user = data.result?.[0]
      if (data.status !== 'OK' || !user) throw new Error('Codeforces unavailable')
      profile.value = {
        rating: typeof user.rating === 'number' ? user.rating : null,
        rank: typeof user.rank === 'string' ? user.rank : 'Unrated',
        savedAt: Date.now(),
      }
      status.value = 'Codeforces'
      if (storageAvailable) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(profile.value))
        } catch {
          storageAvailable = false
        }
      }
    } catch {
      status.value = 'Codeforces unavailable'
    } finally {
      clearTimeout(timeout)
    }
  })

  onUnmounted(() => {
    controller.abort()
    clearTimeout(timeout)
  })

  return { profile, status }
}
