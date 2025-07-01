<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script setup lang="ts">
  import * as echarts from 'echarts/core'
  import { LineChart, PieChart, HeatmapChart, BarChart } from 'echarts/charts'
  import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    VisualMapComponent
  } from 'echarts/components'
  import { CanvasRenderer } from 'echarts/renderers'
  import { useUserStore } from '@/store/user'

  type ChartType = 'line' | 'pie' | 'heatmap' | 'bar'

  const userStore = useUserStore()
  echarts.use([
    LineChart,
    PieChart,
    BarChart,
    HeatmapChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    VisualMapComponent,
    CanvasRenderer
  ])

  const props = defineProps<{
    option: echarts.EChartsCoreOption
    type: ChartType
    height?: string
  }>()

  const chartRef = ref<HTMLElement>()
  let chart: echarts.ECharts

  const resizeChart = () => {
    chart?.resize?.()
  }
  watch(
    () => userStore.menuCollapse,
    () => {
      resizeChart()
    }
  )
  watch(
    () => props.option,
    () => {
      chart.setOption(props.option)
    }
  )

  const initChart = () => {
    if (chartRef.value) {
      chart = echarts.init(chartRef.value)
      chart.setOption(props.option)
      window.addEventListener('resize', resizeChart)
    }
  }
  onMounted(() => {
    initChart()
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeChart)
    chart?.dispose?.()
  })
</script>

<style scoped>
  .chart-container {
    width: 100%;
    height: v-bind('props.height || "300px"');
  }
</style>
