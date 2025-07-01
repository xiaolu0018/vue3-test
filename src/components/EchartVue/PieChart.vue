<template>
  <base-chart :option="options" type="pie" class="chart-card" />
</template>

<script setup lang="ts">
  // 饼图
  import BaseChart from '@/components/EchartVue/BaseChart.vue'
  import { FormValRef } from '@/types/form-option'
  import { generateColorArray } from '@/utils/color'
  const props = defineProps<{
    title?: string
    radius?: string[]
    legend?: { [key: string]: any }
    data: FormValRef[]
  }>()
  const options = computed(() => ({
    title: {
      text: props.title || '统计',
      left: 'left',
      show: false
    },
    tooltip: {
      trigger: 'item'
    },
    grid: { top: '10px', left: '10px', right: '0', bottom: '10px', containLabel: true },
    legend: props.legend || {
      orient: 'vertical',
      right: '10px',
      left: 'right',
      textStyle: {
        color: '#fff'
      }
    },
    color: generateColorArray(props.data.length),
    series: [
      {
        type: 'pie',
        radius: props.radius || '65%',
        avoidLabelOverlap: false,
        label: {
          show: false,
          formatter: '{b|{b}}\n{d}%',
          rich: { b: { fontWeight: 'bold' } }
        },
        data: props.data || [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }))
</script>
