<template>
  <div class="chart-demo">
    <!-- ECharts 容器 -->
    <div id="sales-chart" class="chart-container" />

    <!-- 测试按钮组 -->
    <div class="btn-group">
      <button onclick="updateChartData()">更新数据</button>
      <button onclick="resizeChart()">手动重绘</button>
      <button onclick="destroyChart()">销毁图表</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
// 导入 JS 版本的 ECharts 工具类
import EchartsUtils from '@/utils/chart'

// 响应式存储实例
const chartInstance = ref(null)

// 初始化数据
const salesData = [
  { name: '周一', value: 120 },
  { name: '周二', value: 200 },
  { name: '周三', value: 150 },
  { name: '周四', value: 80 },
  { name: '周五', value: 70 },
  { name: '周六', value: 110 },
  { name: '周日', value: 130 }
]

// 构建 ECharts 配置项（JS 无需类型约束，更简洁）
const getChartOptions = (data) => ({
  title: {
    text: '一周销售额统计',
    left: 'center',
    textStyle: { fontSize: 16, fontWeight: 600 }
  },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: data.map(item => item.name) },
  yAxis: { type: 'value' },
  series: [{
    name: '销售额(元)',
    type: 'bar',
    data: data.map(item => item.value),
    itemStyle: { color: '#409EFF', borderRadius: [4, 4, 0, 0] }
  }]
})

// 初始化图表
const initChart = () => {
  const instance = EchartsUtils.init(
    'sales-chart',
    getChartOptions(salesData),
    { renderer: 'canvas' },
    { delay: 200, enable: true }
  )
  if (instance) {
    chartInstance.value = instance
    console.log('图表初始化成功')
  }
}

// 全局挂载更新方法（供按钮调用）
window.updateChartData = () => {
  if (!chartInstance.value) return

  // 模拟新数据
  const newData = [
    { name: '周一', value: Math.floor(Math.random() * 300) },
    { name: '周二', value: Math.floor(Math.random() * 300) },
    { name: '周三', value: Math.floor(Math.random() * 300) },
    { name: '周四', value: Math.floor(Math.random() * 300) },
    { name: '周五', value: Math.floor(Math.random() * 300) },
    { name: '周六', value: Math.floor(Math.random() * 300) },
    { name: '周日', value: Math.floor(Math.random() * 300) }
  ]

  // 快捷更新数据
  const success = EchartsUtils.updateSeriesData(
    chartInstance.value,
    '销售额(元)',
    newData
  )
  console.log(success ? '数据更新成功' : '数据更新失败')
}

// 手动重绘
window.resizeChart = () => {
  const success = EchartsUtils.resize('sales-chart')
  console.log(success ? '重绘成功' : '重绘失败')
}

// 销毁图表
window.destroyChart = () => {
  const success = EchartsUtils.destroy(chartInstance.value)
  if (success) chartInstance.value = null
  console.log(success ? '销毁成功' : '销毁失败')
}

// 生命周期
onMounted(() => {
  nextTick(initChart)
})

onUnmounted(() => {
  if (chartInstance.value) {
    EchartsUtils.destroy(chartInstance.value)
  }
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
}
.btn-group {
  display: flex;
  gap: 10px;
}
.btn-group button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #409EFF;
  color: #fff;
  cursor: pointer;
}
</style>