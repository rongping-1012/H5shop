import * as echarts from 'echarts'

// 存储已初始化的 ECharts 实例，避免重复创建
const echartsInstances = new Map()

/**
 * 防抖函数
 * @param {Function} fn - 目标函数
 * @param {number} delay - 防抖延迟
 * @returns {Function} 防抖后的函数
 */
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 获取容器 DOM 元素
 * @param {string | HTMLElement} container - 容器ID 或 DOM 元素
 * @returns {HTMLElement | null} DOM 元素
 */
function getContainerDom(container) {
  if (typeof container === 'string') {
    return document.getElementById(container)
  } else if (container instanceof HTMLElement) {
    return container
  }
  return null
}

/**
 * 获取容器唯一标识
 * @param {string | HTMLElement} container - 容器ID 或 DOM 元素
 * @returns {string | null} 唯一标识
 */
function getContainerKey(container) {
  if (typeof container === 'string') {
    return container
  } else if (container instanceof HTMLElement) {
    return container.id || container.dataset.echartsKey || null
  }
  return null
}

/**
 * ECharts 工具类
 */
const EchartsUtils = {
  /**
   * 初始化 ECharts 实例
   * @param {string | HTMLElement} container - 容器ID 或 DOM 元素
   * @param {Object} options - ECharts 配置项
   * @param {Object} [initOptions={ renderer: 'canvas' }] - 初始化配置
   * @param {Object} [resizeOptions={ delay: 300, enable: true }] - 自适应配置
   * @returns {ECharts | null} ECharts 实例
   */
  init(container, options, initOptions = { renderer: 'canvas' }, resizeOptions = { delay: 300, enable: true }) {
    // 1. 校验容器
    const dom = getContainerDom(container)
    if (!dom) {
      console.error('ECharts 初始化失败：容器不存在', container)
      return null
    }

    // 2. 生成容器唯一标识
    const containerKey = getContainerKey(container)
    if (!containerKey) {
      console.error('ECharts 初始化失败：容器无唯一标识', container)
      return null
    }

    // 3. 避免重复初始化
    if (echartsInstances.has(containerKey)) {
      console.warn(`ECharts 容器 ${containerKey} 已初始化，直接返回现有实例`)
      return echartsInstances.get(containerKey)
    }

    // 4. 初始化实例
    try {
      const instance = echarts.init(dom, undefined, {
        devicePixelRatio: window.devicePixelRatio || 1,
        ...initOptions
      })

      // 5. 设置配置项
      instance.setOption(options, {
        notMerge: false,
        lazyUpdate: false
      })

      // 6. 存储实例
      echartsInstances.set(containerKey, instance)

      // 7. 启用窗口自适应
      if (resizeOptions.enable) {
        this.enableResize(instance, resizeOptions.delay)
      }

      return instance
    } catch (error) {
      console.error('ECharts 初始化异常：', error)
      return null
    }
  },

  /**
   * 更新 ECharts 配置项
   * @param {string | HTMLElement | ECharts} target - 容器ID、DOM元素 或 ECharts 实例
   * @param {Object} options - 新的配置项
   * @param {boolean} [notMerge=false] - 是否覆盖原有配置
   * @returns {boolean} 更新是否成功
   */
  updateOption(target, options, notMerge = false) {
    const instance = this.getInstance(target)
    if (!instance) return false

    try {
      instance.setOption(options, { notMerge, lazyUpdate: false })
      return true
    } catch (error) {
      console.error('ECharts 更新配置失败：', error)
      return false
    }
  },

  /**
   * 快捷更新 Series 数据
   * @param {string | HTMLElement | ECharts} target - 容器ID、DOM元素 或 ECharts 实例
   * @param {string} seriesName - 系列名称
   * @param {Array} data - 新的系列数据（格式：[{ name: '', value: '' }, ...]）
   * @returns {boolean} 更新是否成功
   */
  updateSeriesData(target, seriesName, data) {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('ECharts 更新数据失败：seriesData 必须是非空数组')
      return false
    }

    // 转换为 ECharts 支持的格式
    const seriesOption = {
      series: [
        {
          name: seriesName,
          data: data.map(item => item.value)
        }
      ]
    }

    return this.updateOption(target, seriesOption)
  },

  /**
   * 手动触发图表重绘
   * @param {string | HTMLElement | ECharts} target - 容器ID、DOM元素 或 ECharts 实例
   * @returns {boolean} 重绘是否成功
   */
  resize(target) {
    const instance = this.getInstance(target)
    if (!instance) return false

    try {
      instance.resize()
      return true
    } catch (error) {
      console.error('ECharts 重绘失败：', error)
      return false
    }
  },

  /**
   * 启用窗口大小自适应
   * @param {ECharts} instance - ECharts 实例
   * @param {number} [delay=300] - 防抖延迟
   * @returns {Function} 取消自适应的函数
   */
  enableResize(instance, delay = 300) {
    // 防抖处理
    const debounceResize = debounce(() => {
      this.resize(instance)
    }, delay)

    // 绑定窗口事件
    window.addEventListener('resize', debounceResize)

    // 存储防抖函数到实例上，方便销毁时移除
    instance.__resizeHandler = debounceResize

    // 返回取消自适应的函数
    return () => {
      if (instance.__resizeHandler) {
        window.removeEventListener('resize', instance.__resizeHandler)
        delete instance.__resizeHandler
      }
    }
  },

  /**
   * 销毁 ECharts 实例
   * @param {string | HTMLElement | ECharts} target - 容器ID、DOM元素 或 ECharts 实例
   * @returns {boolean} 销毁是否成功
   */
  destroy(target) {
    const instance = this.getInstance(target)
    if (!instance) return false

    // 移除 resize 监听
    if (instance.__resizeHandler) {
      window.removeEventListener('resize', instance.__resizeHandler)
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
  },

  /**
   * 获取 ECharts 实例
   * @param {string | HTMLElement | ECharts} target - 容器ID、DOM元素 或 ECharts 实例
   * @returns {ECharts | null} ECharts 实例
   */
  getInstance(target) {
    // 直接返回实例类型
    if (typeof target !== 'string' && !(target instanceof HTMLElement)) {
      return target
    }

    // 从容器获取实例
    const key = getContainerKey(target) || ''
    const instance = key ? echartsInstances.get(key) : null
    if (!instance) {
      console.error('ECharts 实例不存在：', target)
    }
    return instance || null
  },

  /**
   * 通过实例反向获取容器 Key
   * @param {ECharts} instance - ECharts 实例
   * @returns {string | null} 容器 Key
   */
  getContainerKeyByInstance(instance) {
    for (const [key, value] of echartsInstances.entries()) {
      if (value === instance) return key
    }
    return null
  }
}

// 导出常用方法的快捷方式（简化调用）
export const initEcharts = EchartsUtils.init
export const updateEchartsOption = EchartsUtils.updateOption
export const updateEchartsSeriesData = EchartsUtils.updateSeriesData
export const resizeEcharts = EchartsUtils.resize
export const destroyEcharts = EchartsUtils.destroy
export const getEchartsInstance = EchartsUtils.getInstance

// 默认导出工具类
export default EchartsUtils