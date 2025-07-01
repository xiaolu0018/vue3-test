<!-- MultiSelect.vue -->
<template>
  <el-select
    v-model="selectedValues"
    multiple
    clearable
    collapse-tags
    :placeholder="placeholder"
    :popper-class="popperClass"
    :max-collapse-tags="maxCollapseTags"
    :style="{ width: width }"
    @change="handleChange"
  >
    <!-- 头部全选插槽 -->
    <template v-if="showCheckAll" #header>
      <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">
        {{ checkAllLabel }}
      </el-checkbox>
    </template>

    <!-- 默认选项渲染 -->
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      <!-- 作用域插槽允许自定义选项内容 -->
      <slot name="option" :option="item"></slot>
    </el-option>

    <!-- 底部自定义插槽 -->
    <template v-if="$slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </el-select>
</template>

<script setup lang="ts" name="MultiSelect">
  import type { CheckboxValueType } from 'element-plus'

  const props = defineProps({
    options: {
      type: Array as () => Array<{ value: string; label: string }>,
      required: true,
      default: () => []
    },
    modelValue: {
      type: Array as () => CheckboxValueType[],
      default: () => []
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    width: {
      type: String,
      default: '240px'
    },
    maxCollapseTags: {
      type: Number,
      default: 1
    },
    popperClass: {
      type: String,
      default: 'ua-custom-select-header'
    },
    showCheckAll: {
      type: Boolean,
      default: true
    },
    checkAllLabel: {
      type: String,
      default: 'All'
    }
  })

  const emit = defineEmits(['update:modelValue', 'change'])

  const selectedValues = ref<CheckboxValueType[]>(props.modelValue)
  const checkAll = ref(false)
  const indeterminate = ref(false)

  // 监听选中值变化
  watch(selectedValues, (val) => {
    if (val.length === 0) {
      checkAll.value = false
      indeterminate.value = false
    } else if (val.length === props.options.length) {
      checkAll.value = true
      indeterminate.value = false
    } else {
      indeterminate.value = true
    }
    emit('update:modelValue', val)
  })

  // 全选/反选逻辑
  const handleCheckAll = (val: CheckboxValueType) => {
    indeterminate.value = false
    const newVal = val ? props.options.map((item) => item.value) : []
    selectedValues.value = newVal
    emit('change', newVal)
  }
  const handleChange = (val: CheckboxValueType[]) => {
    selectedValues.value = val
    emit('change', val)
  }
  // 对外暴露方法
  const clearSelection = () => {
    selectedValues.value = []
  }

  defineExpose({ clearSelection })
</script>

<style lang="scss">
  /* 可扩展样式 */
  .ua-custom-select-header {
    .el-select-dropdown__header {
      text-align: left;
      padding: 5px 10px;
    }
    .el-checkbox {
      display: flex;
      height: unset;
      padding: 8px 12px;
    }
  }
</style>
