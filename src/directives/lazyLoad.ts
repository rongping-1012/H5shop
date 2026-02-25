import type { Directive, DirectiveBinding } from 'vue'
import type { LazyLoadBinding } from '@/types'

/**
 * 图片懒加载指令
 * 使用 Intersection Observer API 实现图片懒加载
 */
const lazyLoad: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<LazyLoadBinding>) {
    const { src, placeholder = '/images/placeholder.png' } = binding.value || {}
    
    if (!src) {
      console.warn('v-lazy-load: src is required')
      return
    }

    // 设置占位图
    if (el.tagName === 'IMG') {
      (el as HTMLImageElement).src = placeholder
      el.classList.add('lazy-loading')
    } else {
      el.style.backgroundImage = `url(${placeholder})`
    }

    // 检查浏览器是否支持 Intersection Observer
    if (!('IntersectionObserver' in window)) {
      // 不支持则直接加载
      if (el.tagName === 'IMG') {
        (el as HTMLImageElement).src = src
      } else {
        el.style.backgroundImage = `url(${src})`
      }
      return
    }

    // 使用 Intersection Observer 监听元素进入视口
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 创建新图片对象预加载
            const img = new Image()
            img.src = src
            
            img.onload = () => {
              // 图片加载成功后替换
              if (el.tagName === 'IMG') {
                (el as HTMLImageElement).src = src
                el.classList.remove('lazy-loading')
                el.classList.add('lazy-loaded')
              } else {
                el.style.backgroundImage = `url(${src})`
              }
              observer.unobserve(el) // 停止观察
            }
            
            img.onerror = () => {
              console.error('Failed to load image:', src)
              el.classList.add('lazy-error')
              observer.unobserve(el) // 停止观察
            }
          }
        })
      },
      {
        rootMargin: '50px' // 提前 50px 开始加载
      }
    )

    observer.observe(el)

    // 保存 observer 到元素上，以便在卸载时清理
    ;(el as any)._lazyLoadObserver = observer
  },
  unmounted(el: HTMLElement) {
    // 清理 observer
    const observer = (el as any)._lazyLoadObserver
    if (observer) {
      observer.disconnect()
      delete (el as any)._lazyLoadObserver
    }
  }
}

export default lazyLoad

