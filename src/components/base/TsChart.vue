<template>
  <div class="chart-demo">
    <!-- ECharts 容器 -->
    <div 
      id="sales-chart" 
      data-echarts-key="sales-chart"
      class="chart-container"
    />

    <!-- 测试按钮组 -->
    <div class="btn-group">
      <button @click="updateChartData" class="btn primary">更新数据</button>
      <button @click="resizeChart" class="btn warning">手动重绘</button>
      <button @click="destroyChart" class="btn danger">销毁图表</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
// 核心修正：只导入工具类导出的类型，移除未导出的 EChartsOption
import { 
  EchartsUtils, 
  type EChartsType,
  type SeriesDataItem
} from '@/utils/echarts' // 注意路径和工具类文件名保持一致

// 1. 定义业务数据类型（泛型约束）
type SalesDataType = SeriesDataItem<number>

// 2. 响应式数据
const chartInstance = ref<EChartsType | null>(null)
const salesData = ref<SalesDataType[]>([
  { name: '周一', value: 120 },
  { name: '周二', value: 200 },
  { name: '周三', value: 150 },
  { name: '周四', value: 80 },
  { name: '周五', value: 70 },
  { name: '周六', value: 110 },
  { name: '周日', value: 130 }
])

// 3. 构建 ECharts 配置项（核心修正：不依赖导出的 EChartsOption，直接写配置）
const getChartOptions = (data: SalesDataType[]) => ({
  title: {
    text: '一周销售额统计',
    left: 'center',
    textStyle: {
      fontSize: 16,
      fontWeight: 600 as const // 修复 TS 类型报错
    }
  },
  tooltip: {
    trigger: 'axis' as const,
    axisPointer: { type: 'shadow' as const }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category' as const,
    data: data.map(item => item.name),
    axisLabel: {
      color: '#666'
    }
  },
  yAxis: {
    type: 'value' as const,
    axisLabel: {
      color: '#666'
    },
    splitLine: {
      lineStyle: {
        color: '#eee'
      }
    }
  },
  series: [
    {
      name: '销售额(元)',
      type: 'bar' as const,
      data: data.map(item => item.value),
      itemStyle: {
        color: '#409EFF',
        borderRadius: [4, 4, 0, 0]
      },
      barWidth: '60%'
    }
  ]
})

// 4. 初始化图表
const initChart = () => {
  const instance = EchartsUtils.init(
    'sales-chart', // 容器ID
    getChartOptions(salesData.value), // 配置项
    { renderer: 'canvas' }, // 初始化配置
    { delay: 200, enable: true } // 自适应配置
  )
  if (instance) {
    chartInstance.value = instance
    console.log('图表初始化成功')
  } else {
    console.log('图表初始化失败')
  }
}

// 5. 更新图表数据
const updateChartData = () => {
  if (!chartInstance.value) {
    console.log('请先初始化图表')
    return
  }

  // 模拟新数据
  const newData: SalesDataType[] = [
    { name: '周一', value: Math.floor(Math.random() * 300) },
    { name: '周二', value: Math.floor(Math.random() * 300) },
    { name: '周三', value: Math.floor(Math.random() * 300) },
    { name: '周四', value: Math.floor(Math.random() * 300) },
    { name: '周五', value: Math.floor(Math.random() * 300) },
    { name: '周六', value: Math.floor(Math.random() * 300) },
    { name: '周日', value: Math.floor(Math.random() * 300) }
  ]

  // 方式1：快捷更新系列数据（推荐）
  const updateSuccess = EchartsUtils.updateSeriesData<number>(
    chartInstance.value, // 传入实例
    '销售额(元)', // 系列名称
    newData // 新数据
  )

  if (updateSuccess) {
    salesData.value = newData
    console.log('数据更新成功')
  } else {
    console.log('数据更新失败')
  }
}

// 6. 手动触发重绘
const resizeChart = () => {
  const resizeSuccess = EchartsUtils.resize('sales-chart')
  console.log(resizeSuccess ? '图表重绘成功' : '图表重绘失败')
}

// 7. 销毁图表
const destroyChart = () => {
  if (!chartInstance.value) {
    console.log('图表未初始化')
    return
  }
  const destroySuccess = EchartsUtils.destroy(chartInstance.value)
  if (destroySuccess) {
    chartInstance.value = null
    console.log('图表销毁成功')
  } else {
    console.log('图表销毁失败')
  }
}

// 8. 生命周期管理
onMounted(() => {
  // 确保 DOM 渲染完成后初始化
  nextTick(() => {
    initChart()
  })
})

onUnmounted(() => {
  // 组件销毁时自动销毁图表，避免内存泄漏
  if (chartInstance.value) {
    EchartsUtils.destroy(chartInstance.value)
  }
})
</script>

<style scoped>
.chart-demo {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

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

.btn {
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}

.btn.primary {
  background: #409EFF;
}

.btn.warning {
  background: #E6A23C;
}

.btn.danger {
  background: #F56C6C;
}
</style>