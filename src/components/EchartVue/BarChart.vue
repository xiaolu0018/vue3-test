<template>
  <base-chart :option="options" type="bar" class="chart-card" />
</template>

<script setup lang="ts">
  import BaseChart from '@/components/EchartVue/BaseChart.vue'
  import { FormValRef } from '@/types/form-option'
  import { generateColorArray } from '@/utils/color'

  const props = defineProps<{
    data: FormValRef[]
    colors?: string[]
    barWidth?: string
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
    const colors = [...(props.colors ?? []), ...generateColorArray(seriesData.length)]
    return {
      title: { text: '', left: 'left', show: false },
      grid: { top: '10px', left: '10px', right: '0', bottom: '10px', containLabel: true },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: { top: 'bottom' },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: { rotate: 45 }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          type: 'bar',
          data: seriesData,
          barWidth: props.barWidth || '60%',
          itemStyle: {
            color: function (params: any) {
              return colors[params.dataIndex] || colors[0]
            }
          }
        }
      ]
    }
  })
</script>
