<template>
  <component :is="iconComponent" :class="className" :style="iconStyle" v-if="resolvedComponent" />
  <span v-else class="icon-error">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path
        d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
      />
    </svg>
  </span>
</template>

<script setup>
  import { defineProps, computed, h, resolveComponent } from 'vue'
  import { Icon } from '@iconify/vue' // 显式导入 Icon 组件

  const props = defineProps({
    icon: {
      type: String,
      required: true,
      validator: (val) => val.includes(':') || val.startsWith('i-')
    },
    size: {
      type: [String, Number],
      default: '1em',
      validator: (value) => {
        if (typeof value === 'string') {
          return (
            /^\d+(\.\d+)?(px|em|rem|%)$/.test(value) ||
            ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
          )
        }
        return Number.isInteger(value) && value > 0
      }
    },
    color: String,
    spin: Boolean
  })

  // 图标样式计算
  const iconStyle = computed(() => ({
    fontSize: typeof props.size === 'number' ? `${props.size}px` : props.size
  }))

  // 动态生成样式类
  const className = computed(() => [
    'inline-block align-middle',
    props.color ? `text-${props.color}` : '',
    { 'animate-spin': props.spin }
  ])

  // 组件解析核心逻辑
  const resolvedComponent = computed(() => {
    try {
      let componentName = ''

      if (props.icon.includes(':')) {
        // 处理自定义图标 (my-icons:check)
        const [collection, name] = props.icon.split(':')
        componentName = `i-${collection}-${name}`
      } else {
        // 处理内置图标 (bi:check-circle)
        componentName = props.icon.startsWith('i-') ? props.icon : `i-${props.icon}`
      }

      // 尝试解析组件
      const component = resolveComponent(componentName)
      return component || null
    } catch (error) {
      console.error(`图标解析失败: ${props.icon}`, error)
      return null
    }
  })

  // 安全渲染组件
  const iconComponent = computed(() => {
    if (!resolvedComponent.value) return null

    return h(resolvedComponent.value, {
      class: className.value
    })
  })
</script>

<style scoped>
  .icon-error {
    @apply inline-block align-middle text-red-500;
    width: v-bind('typeof size === "number" ? `${size}px` : size');
    height: v-bind('typeof size === "number" ? `${size}px` : size');
  }
</style>
