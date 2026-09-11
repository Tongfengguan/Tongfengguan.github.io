import { onMounted, ref } from 'vue'

type Theme = 'light' | 'dark'

function isTheme(value: string | null | undefined): value is Theme {
  return value === 'light' || value === 'dark'
}

export function useTheme() {
  const theme = ref<Theme>('light')

  function apply(next: Theme, persist = true) {
    theme.value = next
    document.documentElement.dataset.theme = next
    document
      .querySelector<HTMLMetaElement>('#theme-color')
      ?.setAttribute('content', next === 'light' ? '#f4f1e9' : '#111211')
    if (persist) {
      try {
        localStorage.setItem('tfgkk:theme', next)
      } catch {
        // The selected theme still applies for this page view.
      }
    }
  }

  function toggle() {
    apply(theme.value === 'light' ? 'dark' : 'light')
  }

  onMounted(() => {
    const current = document.documentElement.dataset.theme
    apply(isTheme(current) ? current : 'light', false)
  })

  return { theme, toggle }
}
