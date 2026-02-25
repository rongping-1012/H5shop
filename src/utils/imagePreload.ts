/**
 * 图片预加载工具
 */

export interface PreloadOptions {
  timeout?: number // 超时时间（毫秒）
  onProgress?: (loaded: number, total: number) => void // 进度回调
  onError?: (src: string) => void // 错误回调
}

/**
 * 预加载单张图片
 * @param src - 图片地址
 * @param options - 配置选项
 * @returns Promise<HTMLImageElement>
 */
export function preloadImage(
  src: string,
  options: PreloadOptions = {}
): Promise<HTMLImageElement> {
  const { timeout = 10000 } = options

  return new Promise((resolve, reject) => {
    const img = new Image()
    
    // 设置超时
    const timer = setTimeout(() => {
      reject(new Error(`Image preload timeout: ${src}`))
      img.onload = null
      img.onerror = null
    }, timeout)

    img.onload = () => {
      clearTimeout(timer)
      resolve(img)
    }

    img.onerror = () => {
      clearTimeout(timer)
      options.onError?.(src)
      reject(new Error(`Failed to load image: ${src}`))
    }

    // 开始加载
    img.src = src
  })
}

/**
 * 批量预加载图片
 * @param srcs - 图片地址数组
 * @param options - 配置选项
 * @returns Promise<HTMLImageElement[]>
 */
export async function preloadImages(
  srcs: string[],
  options: PreloadOptions = {}
): Promise<HTMLImageElement[]> {
  const { onProgress } = options
  const results: HTMLImageElement[] = []
  let loaded = 0
  const total = srcs.length

  const promises = srcs.map((src, index) => {
    return preloadImage(src, {
      ...options,
      onError: (errorSrc) => {
        options.onError?.(errorSrc)
        // 即使失败也计入进度
        loaded++
        onProgress?.(loaded, total)
      }
    })
      .then((img) => {
        loaded++
        onProgress?.(loaded, total)
        return img
      })
      .catch(() => {
        // 失败时返回 null，后续过滤
        return null
      })
  })

  const images = await Promise.all(promises)
  return images.filter((img): img is HTMLImageElement => img !== null)
}

/**
 * 预加载关键图片（首屏可见区域）
 * @param selector - 选择器，用于查找需要预加载的图片
 * @param options - 配置选项
 */
export function preloadCriticalImages(
  selector: string = 'img[data-critical]',
  options: PreloadOptions = {}
): Promise<HTMLImageElement[]> {
  if (typeof document === 'undefined') {
    return Promise.resolve([])
  }

  const images = Array.from(document.querySelectorAll<HTMLImageElement>(selector))
  const srcs = images
    .map((img) => img.dataset.src || img.src)
    .filter((src) => src && src !== '')

  return preloadImages(srcs, options)
}

/**
 * 使用 Intersection Observer 实现图片懒加载预加载
 * @param selector - 选择器
 * @param rootMargin - 根边距，提前加载距离
 */
export function preloadLazyImages(
  selector: string = 'img[data-src]',
  rootMargin: string = '200px'
): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return
  }

  const images = Array.from(document.querySelectorAll<HTMLImageElement>(selector))

  if (images.length === 0) {
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          const src = img.dataset.src

          if (src) {
            preloadImage(src)
              .then(() => {
                img.src = src
                img.removeAttribute('data-src')
              })
              .catch((error) => {
                console.warn('Failed to preload image:', error)
              })
          }

          observer.unobserve(img)
        }
      })
    },
    {
      rootMargin
    }
  )

  images.forEach((img) => observer.observe(img))
}
