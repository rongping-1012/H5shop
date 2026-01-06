import { onActivated, onDeactivated } from 'vue'
import { useRoute } from 'vue-router'

export const useScrollRestoration = (scrollElement = window) => {
  const route = useRoute()
  let scrollPosition = 0

  const saveScrollPosition = () => {
    if (scrollElement === window) {
      scrollPosition = window.scrollY
    } else {
      scrollPosition = scrollElement.scrollTop
    }
  }

  const restoreScrollPosition = () => {
    if (scrollElement === window) {
      window.scrollTo(0, scrollPosition)
    } else {
      scrollElement.scrollTop = scrollPosition
    }
  }

  onActivated(() => {
    if (route.meta.keepAlive) {
      restoreScrollPosition()
    }
  })

  onDeactivated(() => {
    if (route.meta.keepAlive) {
      saveScrollPosition()
    }
  })

  return {
    saveScrollPosition,
    restoreScrollPosition
  }
}
