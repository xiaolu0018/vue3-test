<template>
  <base-chart :option="options" type="line" class="chart-card" />
</template>

<script setup lang="ts">
  // 折线图
  import BaseChart from '@/components/EchartVue/BaseChart.vue'
  import { FormValRef } from '@/types/form-option'
  import { generateColorArray } from '@/utils/color'
  const props = defineProps<{
    title?: string
    data: FormValRef[]
    color?: string
  }>()

  const options = computed(() => {
    const { xAxisData, seriesData } = (props.data || []).reduce(
      (t, item) => {
        t.xAxisData.push(item.name as string)
        t.seriesData.push(item.value as number)
        return t
      },
      { xAxisData: [] as string[], seriesData: [] as number[] }
    )
    const color = props.color || generateColorArray(1)[0]
    return {
      title: { text: '', left: 'left', show: false },
      tooltip: { trigger: 'axis' },
      grid: { top: '10px', left: '10px', right: '0', bottom: '10px', containLabel: true },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: {
          rotate: 60, // 增加旋转角度
          interval: 0 // 强制显示所有标签
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: props.title || '数量',
          type: 'line',
          smooth: true,
          data: seriesData,
          itemStyle: {
            color: function () {
              return color
            }
          },
          lineStyle: {
            width: 2,
            color: color
          },
          symbolSize: 10
        }
      ]
    }
  })
</script>
