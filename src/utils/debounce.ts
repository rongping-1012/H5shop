/**
 * 防抖函数
 * @param fn - 要防抖的函数
 * @param delay - 延迟时间（毫秒）
 * @param immediate - 是否立即执行
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>) {
    const context = this

    // 如果立即执行，且没有定时器，则立即执行
    if (immediate && !timer) {
      fn.apply(context, args)
    }

    // 清除之前的定时器
    if (timer) {
      clearTimeout(timer)
    }

    // 设置新的定时器
    timer = setTimeout(() => {
      timer = null
      if (!immediate) {
        fn.apply(context, args)
      }
    }, delay)
  }
}

/**
 * 防抖装饰器（用于类方法）
 */
export function Debounce(delay: number = 300, immediate: boolean = false) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value
    descriptor.value = debounce(originalMethod, delay, immediate)
    return descriptor
  }
}
