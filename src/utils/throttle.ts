/**
 * 节流函数
 * @param fn - 要节流的函数
 * @param delay - 延迟时间（毫秒）
 * @param options - 配置选项
 * @returns 节流后的函数
 */
export interface ThrottleOptions {
  leading?: boolean // 是否在开始时执行
  trailing?: boolean // 是否在结束时执行
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
  options: ThrottleOptions = { leading: true, trailing: true }
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  let lastExecTime = 0
  const { leading = true, trailing = true } = options

  return function (this: any, ...args: Parameters<T>) {
    const context = this
    const currentTime = Date.now()

    // 如果距离上次执行时间超过 delay，且 leading 为 true，则立即执行
    if (leading && currentTime - lastExecTime >= delay) {
      fn.apply(context, args)
      lastExecTime = currentTime
      return
    }

    // 如果已经有定时器，直接返回
    if (timer) {
      return
    }

    // 设置定时器，在 delay 后执行
    timer = setTimeout(() => {
      if (trailing) {
        fn.apply(context, args)
      }
      lastExecTime = Date.now()
      timer = null
    }, delay - (currentTime - lastExecTime))
  }
}

/**
 * 节流装饰器（用于类方法）
 */
export function Throttle(delay: number = 300, options?: ThrottleOptions) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value
    descriptor.value = throttle(originalMethod, delay, options)
    return descriptor
  }
}
