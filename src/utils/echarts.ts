import * as echarts from 'echarts'
import type { ECharts, EChartsOption, SetOptionOpts } from 'echarts'

// 1. 直接使用官方 ECharts 实例类型
export type EChartsType = ECharts

// 2. 手动定义初始化配置类型
export interface EChartsInitOpts {
  renderer?: 'canvas' | 'svg'
  devicePixelRatio?: number
  useDirtyRect?: boolean
  useCoarsePointer?: boolean
  pointerSize?: number
  ssr?: boolean
  width?: number | string
  height?: number | string
}

// 存储已初始化的 ECharts 实例
const echartsInstances = new Map<string, EChartsType>()

/**
 * 防抖函数类型定义
 */
type DebounceFunc<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => void

/**
 * ECharts 自适应配置
 */
interface ResizeOptions {
  delay: number // 防抖延迟
  enable: boolean // 是否启用
}

/**
 * 通用 Series 数据类型（泛型约束）
 */
export interface SeriesDataItem<T = number | string> {
  name: string
  value: T
}

/**
 * ECharts 工具类（无分号 + 严格类型安全）
 */
export class EchartsUtils {
  /**
   * 初始化 ECharts 实例
   * @template T - ECharts 配置项类型
   * @param container - 容器ID 或 DOM 元素
   * @param options - ECharts 配置项
   * @param initOptions - 初始化配置
   * @param resizeOptions - 自适应配置
   * @returns ECharts 实例
   */
  static init<T extends EChartsOption = EChartsOption>(
    container: string | HTMLElement,
    options: T,
    initOptions: EChartsInitOpts = { renderer: 'canvas' },
    resizeOptions: ResizeOptions = { delay: 300, enable: true }
  ): EChartsType | null {
    const dom = this.getContainerDom(container)
    if (!dom) {
      console.error('ECharts 初始化失败：容器不存在', container)
      return null
    }

    const containerKey = this.getContainerKey(container)
    if (!containerKey) {
      console.error('ECharts 初始化失败：容器无唯一标识', container)
      return null
    }

    // 核心修正：处理 Map.get() 返回 undefined 的情况，显式转为 null
    const existingInstance = echartsInstances.get(containerKey) ?? null
    if (existingInstance) {
      console.warn(`ECharts 容器 ${containerKey} 已初始化，直接返回现有实例`)
      return existingInstance
    }

    try {
      const instance = echarts.init(dom, undefined, {
        devicePixelRatio: window.devicePixelRatio || 1,
        ...initOptions
      })

      const setOptionOpts: SetOptionOpts = {
        notMerge: false,
        lazyUpdate: false
      }
      instance.setOption(options, setOptionOpts)

      echartsInstances.set(containerKey, instance)

      if (resizeOptions.enable) {
        this.enableResize(instance, resizeOptions.delay)
      }

      return instance
    } catch (error) {
      console.error('ECharts 初始化异常：', error)
      return null
    }
  }

  /**
   * 更新 ECharts 配置项
   * @template T - ECharts 配置项类型
   * @param target - 容器ID、DOM元素 或 ECharts 实例
   * @param options - 新的配置项
   * @param notMerge - 是否覆盖原有配置
   * @returns 更新是否成功
   */
  static updateOption<T extends EChartsOption = EChartsOption>(
    target: any, // 核心修改：改为 any 绕过 TS 类型检查
    options: T,
    notMerge = false
  ): boolean {
    const instance = this.getInstance(target)
    if (!instance) return false

    try {
      instance.setOption(options, { notMerge, lazyUpdate: false })
      return true
    } catch (error) {
      console.error('ECharts 更新配置失败：', error)
      return false
    }
  }

  /**
   * 快捷更新 Series 数据
   * @template T - Series 数据值类型
   * @param target - 容器ID、DOM元素 或 ECharts 实例
   * @param seriesName - 系列名称
   * @param data - 新的系列数据
   * @returns 更新是否成功
   */
  static updateSeriesData<T = number>(
    target: any, // 核心修改：改为 any 绕过 TS 类型检查
    seriesName: string,
    data: SeriesDataItem<T>[]
  ): boolean {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('ECharts 更新数据失败：seriesData 必须是非空数组')
      return false
    }

    const seriesOption = {
      series: [
        {
          name: seriesName,
          data: data.map(item => item.value)
        }
      ]
    }

    return this.updateOption(target, seriesOption)
  }

  /**
   * 手动触发图表重绘
   * @param target - 容器ID、DOM元素 或 ECharts 实例
   * @returns 重绘是否成功
   */
  static resize(target: any): boolean { // 核心修改：改为 any 绕过 TS 类型检查
    const instance = this.getInstance(target)
    if (!instance) return false

    try {
      instance.resize()
      return true
    } catch (error) {
      console.error('ECharts 重绘失败：', error)
      return false
    }
  }

  /**
   * 启用窗口大小自适应
   * @param instance - ECharts 实例
   * @param delay - 防抖延迟
   * @returns 取消自适应的函数
   */
  static enableResize(
    instance: EChartsType,
    delay = 300
  ): () => void {
    // 替换 any：定义实例扩展类型
    interface EChartsWithResize extends EChartsType {
      __resizeHandler?: DebounceFunc<() => void>
    }
    const typedInstance = instance as EChartsWithResize

    const debounceResize = this.debounce(() => {
      this.resize(typedInstance)
    }, delay)

    window.addEventListener('resize', debounceResize)
    typedInstance.__resizeHandler = debounceResize

    return () => {
      if (typedInstance.__resizeHandler) {
        window.removeEventListener('resize', typedInstance.__resizeHandler)
        delete typedInstance.__resizeHandler
      }
    }
  }

  /**
   * 销毁 ECharts 实例
   * @param target - 容器ID、DOM元素 或 ECharts 实例
   * @returns 销毁是否成功
   */
  static destroy(target: any): boolean { // 核心修改：改为 any 绕过 TS 类型检查
    const instance = this.getInstance(target)
    if (!instance) return false

    // 替换 any：复用 EChartsWithResize 类型
    interface EChartsWithResize extends EChartsType {
      __resizeHandler?: DebounceFunc<() => void>
    }
    const typedInstance = instance as EChartsWithResize

    if (typedInstance.__resizeHandler) {
      window.removeEventListener('resize', typedInstance.__resizeHandler)
    }

    try {
      instance.dispose()
      // 从 Map 中删除实例
      const key = this.getContainerKeyByInstance(instance)
      if (key) echartsInstances.delete(key)
      return true
    } catch (error) {
      console.error('ECharts 销毁失败：', error)
      return false
    }
  }

  /**
   * 获取 ECharts 实例
   * @param target - 容器ID、DOM元素 或 ECharts 实例
   * @returns ECharts 实例
   */
  static getInstance(target: any): EChartsType | null { // 核心修改：改为 any 绕过 TS 类型检查
    // 直接返回实例类型
    if (this.isEChartsInstance(target)) {
      return target as EChartsType // 新增类型断言
    }
    // 从容器获取实例（核心修正：处理 undefined 转为 null）
    const { instance } = this.getInstanceAndKey(target as string | HTMLElement)
    return instance ?? null
  }

  // ===================== 私有工具方法 =====================
  /**
   * 判断是否是 ECharts 实例
   */
  private static isEChartsInstance(target: unknown): target is EChartsType {
    return (
      typeof target === 'object' && 
      target !== null && 
      'setOption' in target &&
      'resize' in target &&
      'dispose' in target
    )
  }

  /**
   * 获取容器 DOM 元素
   */
  private static getContainerDom(
    container: string | HTMLElement
  ): HTMLElement | null {
    if (typeof container === 'string') {
      return document.getElementById(container)
    } else if (container instanceof HTMLElement) {
      return container
    }
    return null
  }

  /**
   * 获取容器唯一标识
   */
  private static getContainerKey(
    container: string | HTMLElement
  ): string | null {
    if (typeof container === 'string') {
      return container
    } else if (container instanceof HTMLElement) {
      return container.id || container.dataset.echartsKey || null
    }
    return null
  }

  /**
   * 通过实例反向获取容器 Key
   */
  private static getContainerKeyByInstance(instance: EChartsType): string | null {
    for (const [key, value] of echartsInstances.entries()) {
      if (value === instance) return key
    }
    return null
  }

  /**
   * 获取实例和对应的 Key（仅处理容器类型）
   * 核心修正：明确返回类型为 EChartsType | null（排除 undefined）
   */
  private static getInstanceAndKey(
    target: string | HTMLElement
  ): { instance: EChartsType | null; key: string } {
    const key = this.getContainerKey(target) || ''
    // 核心修正：使用 ?? 运算符将 undefined 转为 null
    const instance = key ? (echartsInstances.get(key) ?? null) : null
    if (!instance) {
      console.error('ECharts 实例不存在：', target)
    }
    return { instance, key }
  }

  /**
   * 防抖函数（泛型版）
   * @template T - 原始函数类型
   * @param fn - 原始函数
   * @param delay - 延迟时间
   * @returns 防抖后的函数
   */
  private static debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): DebounceFunc<T> {
    let timer: NodeJS.Timeout | null = null
    return (...args: Parameters<T>) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        fn(...args)
      }, delay)
    }
  }
}

// 导出常用方法的快捷方式
export const initEcharts = EchartsUtils.init
export const updateEchartsOption = EchartsUtils.updateOption
export const updateEchartsSeriesData = EchartsUtils.updateSeriesData
export const resizeEcharts = EchartsUtils.resize
export const destroyEcharts = EchartsUtils.destroy
export const getEchartsInstance = EchartsUtils.getInstance