<template>
  <div
    ref="containerRef"
    class="virtual-list"
    :style="{ height: `${containerHeight}px`, overflow: 'auto' }"
    @scroll="handleScroll"
  >
    <!-- 占位元素，用于撑开总高度 -->
    <div :style="{ height: `${totalHeight}px`, position: 'relative' }">
      <!-- 可视区域列表 -->
      <div
        :style="{
          transform: `translateY(${offsetY}px)`,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0
        }"
      >
        <slot
          :items="visibleItems"
          :startIndex="startIndex"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

export interface VirtualListProps<T = any> {
  items: T[]
  itemHeight: number
  containerHeight?: number
  overscan?: number
}

const props = withDefaults(defineProps<VirtualListProps>(), {
  containerHeight: 600,
  overscan: 3
})

const emit = defineEmits<{
  (e: 'scroll', event: Event): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const scrollTop = ref(0)

// 计算总高度
const totalHeight = computed(() => props.items.length * props.itemHeight)

// 计算可见区域的起始和结束索引
const startIndex = computed(() => {
  const index = Math.floor(scrollTop.value / props.itemHeight)
  return Math.max(0, index - props.overscan)
})

const endIndex = computed(() => {
  const visibleCount = Math.ceil(props.containerHeight / props.itemHeight)
  const index = startIndex.value + visibleCount + props.overscan * 2
  return Math.min(props.items.length - 1, index)
})

// 计算可见区域的数据
const visibleItems = computed(() => {
  return props.items.slice(startIndex.value, endIndex.value + 1)
})

// 计算偏移量
const offsetY = computed(() => startIndex.value * props.itemHeight)

// 处理滚动事件
const handleScroll = (e: Event): void => {
  const target = e.target as HTMLElement
  scrollTop.value = target.scrollTop
  emit('scroll', e)
}

// 滚动到指定索引
const scrollToIndex = (index: number): void => {
  if (!containerRef.value) return
  const targetScrollTop = index * props.itemHeight
  containerRef.value.scrollTop = targetScrollTop
}

// 滚动到顶部
const scrollToTop = (): void => {
  scrollToIndex(0)
}

// 滚动到底部
const scrollToBottom = (): void => {
  scrollToIndex(props.items.length - 1)
}

// 暴露方法给父组件
defineExpose({
  scrollToIndex,
  scrollToTop,
  scrollToBottom
})
</script>

<style lang="scss" scoped>
.virtual-list {
  position: relative;
  -webkit-overflow-scrolling: touch;
}
</style>
