<template>
  <div>
    <div class="w-e-for-vue">
      <Toolbar class="w-e-for-vue-toolbar" :editor="editorRef" :defaultConfig="toolbarConfig" />
      <Editor
        class="w-e-for-vue-editor"
        style="height: 300px"
        :defaultConfig="editorConfig"
        @onChange="handleChange"
        @onCreated="handleCreated"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
      required: true
    }
  })

  const emit = defineEmits(['update:modelValue']) // 关键：声明事件

  const toolbarConfig = { excludeKeys: ['group-video'] }
  const defaultMenuUploadConfig = {
    server: '/api/file/upload',
    headers: { Authorization: `Bearer ${localStorage.getItem('tokenName')}` }
  }
  const editorRef = shallowRef<any>()
  const editorConfig = reactive({
    placeholder: 'please input......',
    MENU_CONF: { uploadImage: defaultMenuUploadConfig }
  })

  // 监听父组件传入的值，同步到编辑器
  watch(
    () => props.modelValue,
    (newVal) => {
      if (editorRef.value?.getHtml() !== newVal) {
        editorRef.value?.setHtml(newVal || '')
      }
    }
  )

  // 编辑器内容变化时触发 v-model 更新
  const handleChange = (editor: any) => {
    const html = editor.getHtml()
    emit('update:modelValue', html) // 关键：通知父组件更新
  }

  const handleCreated = (editor: any) => {
    editorRef.value = editor
    editor.setHtml(props.modelValue || '') // 初始化内容
  }

  onBeforeUnmount(() => {
    editorRef.value?.destroy?.()
  })

  // defineExpose({
  //   getEditorText: () => editorRef.value?.getText() || '',
  //   getEditorHtml: () => editorRef.value?.getHtml() || ''
  // })
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>

<style lang="scss" scoped>
  .w-e-full-screen-container {
    z-index: 99;
  }

  .w-e-for-vue {
    margin: 0;
    border: 1px solid #ccc;

    .w-e-for-vue-toolbar {
      border-bottom: 1px solid #ccc;
    }

    .w-e-for-vue-editor {
      height: auto;

      :deep(.w-e-text-container) {
        background-color: $ua-edit-bg;
        color: $ua-edit-color;
        font-size: 16px;
        font-weight: 400;
        font-family:
          'Roboto', 'Segoe UI', Arial, sans-serif, 'Helvetica Neue', 'PingFang SC',
          'Microsoft Yahei', 'simsun', arial, verdana;
        .w-e-text-placeholder {
          top: 6px;
          color: #444;
        }

        pre {
          code {
            text-shadow: unset;
          }
        }

        p {
          margin: 5px 0;
          font-size: 14px; // 设置编辑器的默认字体大小为14px
        }
      }
    }
  }
</style>
