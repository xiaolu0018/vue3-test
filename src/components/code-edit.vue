<template>
  <VAceEditor
    class="ua-code-edit"
    :value="modelValue"
    @update:value="handleChange"
    :lang="lang"
    theme="monokai"
    :options="editorOptions"
    :height="400"
    @init="onEditorInit"
  />
</template>

<script setup lang="ts" name="uat-code-edit">
  import { VAceEditor } from 'vue3-ace-editor'
  import ace from 'ace-builds'
  import { getModeFromFileName } from '@/utils/ace-config'
  ace.config.set('basePath', '/node_modules/ace-builds/src-noconflict/') // 修正资源路径

  const props = defineProps({
    modelValue: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: 'python'
    }
  })
  const editRef = ref(null)
  const emit = defineEmits(['update:modelValue'])

  const lang = computed(() => getModeFromFileName(props.fileName))

  const editorOptions = ref({
    fontSize: 15,
    tabSize: 2,
    showLineNumbers: true, // 显示行号
    showPrintMargin: false, // 去掉灰色的线，printMarginColumn
    useWorker: false, // 关闭语法检查（需要时单独配置）
    enableBasicAutocompletion: true, // 自动补全
    enableLiveAutocompletion: true, // 智能补全
    enableSnippets: true, // 启用代码段
    highlightActiveLine: true, // 高亮行
    highlightSelectedWord: true, // 高亮选中的字符
    wrap: false // 是否换行
    // readonly: false // 是否可编辑
  })

  // 处理代码变化的函数
  const handleChange = (newCode: string) => {
    emit('update:modelValue', newCode || '') // 触发父组件的change事件
  }
  // 编辑器初始化回调
  const onEditorInit = (editor: any) => {
    editRef.value = editor
    editor?.setOptions?.({
      enableMultiselect: true // 支持多光标
    })
  }

  watch(
    () => lang.value,
    async (newVal) => {
      if (newVal) {
        console.log('lang = ', newVal)
        // await loadMode(newVal)
        try {
          // @ts-ignore
          editRef.value?.getSession()?.setMode?.(newVal)
        } catch (err) {
          console.error(err)
          // @ts-ignore
          editRef.value?.getSession()?.setMode?.('text')
        }
      }
    },
    { immediate: true }
  )
  onMounted(async () => {
    await import('ace-builds/src-noconflict/ext-searchbox')
  })
</script>
<style scoped lang="scss">
  .ua-code-edit {
    width: 100%;
    min-height: 350px;
    line-height: 1.3;
    // padding-bottom: 10px;
  }
</style>
