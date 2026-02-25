/**
 * 性能监控工具
 */

/**
 * 性能指标接口
 */
export interface PerformanceMetrics {
  DNS: string
  TCP: string
  Request: string
  Response: string
  DOM: string
  DCL: string
  Load: string
}

/**
 * Web Vitals 指标接口
 */
export interface WebVitals {
  FCP: number
  TTI: number
}

/**
 * 初始化性能监控
 */
export function initPerformance(): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    console.warn('Performance Observer is not supported')
    return
  }

  // 监控资源加载性能
  const resourceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'resource') {
        const resourceEntry = entry as PerformanceResourceTiming
        const { name, duration, transferSize = 0, decodedBodySize = 0 } = resourceEntry
        
        // 只记录超过 1s 的资源加载
        if (duration > 1000) {
          console.warn(`[Performance] Slow resource: ${name}`, {
            duration: `${duration.toFixed(2)}ms`,
            size: `${(transferSize / 1024).toFixed(2)}KB`,
            decodedSize: `${(decodedBodySize / 1024).toFixed(2)}KB`
          })
        }
      }
    }
  })

  try {
    resourceObserver.observe({ entryTypes: ['resource'] })
  } catch (e) {
    console.warn('Failed to observe resources:', e)
  }

  // 监控长任务（Long Tasks）
  if ('PerformanceObserver' in window) {
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn(`[Performance] Long task detected: ${entry.duration.toFixed(2)}ms`)
          }
        }
      })
      longTaskObserver.observe({ entryTypes: ['longtask'] })
    } catch (e) {
      // Long Task API 可能不支持
      console.warn('Long Task API not supported')
    }
  }

  // 监控页面加载性能
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (perfData) {
      const {
        domContentLoadedEventEnd,
        loadEventEnd,
        fetchStart,
        domInteractive,
        domainLookupEnd,
        domainLookupStart,
        connectEnd,
        connectStart,
        responseStart,
        requestStart,
        responseEnd
      } = perfData

      const metrics: PerformanceMetrics = {
        DNS: (domainLookupEnd - domainLookupStart).toFixed(2),
        TCP: (connectEnd - connectStart).toFixed(2),
        Request: (responseStart - requestStart).toFixed(2),
        Response: (responseEnd - responseStart).toFixed(2),
        DOM: (domInteractive - responseEnd).toFixed(2),
        DCL: (domContentLoadedEventEnd - fetchStart).toFixed(2),
        Load: (loadEventEnd - fetchStart).toFixed(2)
      }

      console.log('[Performance] Page Load Metrics:', metrics)
    }
  })
}

/**
 * 测量函数执行时间
 * @param name - 测量名称
 * @param fn - 要测量的函数
 * @returns 函数执行结果
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    const start = performance.now()
    
    try {
      const result = fn()
      
      if (result instanceof Promise) {
        result
          .then((data) => {
            const duration = performance.now() - start
            console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
            resolve(data)
          })
          .catch((error) => {
            const duration = performance.now() - start
            console.error(`[Performance] ${name} failed after ${duration.toFixed(2)}ms:`, error)
            reject(error)
          })
      } else {
        const duration = performance.now() - start
        console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
        resolve(result)
      }
    } catch (error) {
      const duration = performance.now() - start
      console.error(`[Performance] ${name} failed after ${duration.toFixed(2)}ms:`, error)
      reject(error)
    }
  })
}

/**
 * 获取 Web Vitals 指标
 * @returns Web Vitals 指标
 */
export function getWebVitals(): WebVitals | null {
  if (typeof window === 'undefined') return null

  const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  if (!perfData) return null

  return {
    // First Contentful Paint
    FCP: perfData.domContentLoadedEventEnd - perfData.fetchStart,
    // Time to Interactive
    TTI: perfData.domInteractive - perfData.fetchStart
  }
}

