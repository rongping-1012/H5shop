/**
 * 性能监控工具
 */

/**
 * 初始化性能监控
 */
export function initPerformance() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    console.warn('Performance Observer is not supported')
    return
  }

  // 监控资源加载性能
  const resourceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'resource') {
        const { name, duration, transferSize, decodedBodySize } = entry
        
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
    }
  }

  // 监控页面加载性能
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0]
    if (perfData) {
      const {
        domContentLoadedEventEnd,
        loadEventEnd,
        fetchStart,
        domInteractive
      } = perfData

      const metrics = {
        DNS: (perfData.domainLookupEnd - perfData.domainLookupStart).toFixed(2),
        TCP: (perfData.connectEnd - perfData.connectStart).toFixed(2),
        Request: (perfData.responseStart - perfData.requestStart).toFixed(2),
        Response: (perfData.responseEnd - perfData.responseStart).toFixed(2),
        DOM: (domInteractive - perfData.responseEnd).toFixed(2),
        DCL: (domContentLoadedEventEnd - fetchStart).toFixed(2),
        Load: (loadEventEnd - fetchStart).toFixed(2)
      }

      console.log('[Performance] Page Load Metrics:', metrics)
    }
  })
}

/**
 * 测量函数执行时间
 * @param {string} name - 测量名称
 * @param {Function} fn - 要测量的函数
 * @returns {Promise} 函数执行结果
 */
export function measurePerformance(name, fn) {
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
 * @returns {Object} Web Vitals 指标
 */
export function getWebVitals() {
  if (typeof window === 'undefined') return null

  const perfData = performance.getEntriesByType('navigation')[0]
  if (!perfData) return null

  return {
    // First Contentful Paint
    FCP: perfData.domContentLoadedEventEnd - perfData.fetchStart,
    // Largest Contentful Paint (需要 PerformanceObserver 支持)
    // Time to Interactive
    TTI: perfData.domInteractive - perfData.fetchStart,
    // Total Blocking Time
    // Cumulative Layout Shift
  }
}

