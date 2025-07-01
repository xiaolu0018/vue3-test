// src/components/EditKeyModal.vue
<template>
  <el-dialog
    v-model="dialogVisible"
    class="limit-height-dialog"
    title="编辑密钥"
    width="600px"
    top="65px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="handleOpen"
    @close="handleClose"
    center
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="auto"
      label-position="top"
      v-loading="loading"
      hide-required-asterisk
      size="large"
    >
      <el-form-item label="密钥" prop="license">
        <el-input :value="formData.license" readonly class="key-input" />
      </el-form-item>

      <el-form-item label="备注说明" prop="remarks">
        <el-input
          v-model="formData.remarks"
          type="textarea"
          :rows="4"
          placeholder="请输入备注说明"
        />
      </el-form-item>

      <el-form-item label="学校标记" prop="school_name">
        <el-input v-model="formData.school_name" placeholder="请输入学校名称或标识" />
      </el-form-item>

      <el-form-item label="密钥有效期" prop="end_time">
        <el-date-picker
          v-model="formData.end_time"
          type="date"
          placeholder="选择有效期"
          style="width: 100%"
          :format="DateTime_Formate_For_Dayjs"
          :value-format="DateTime_Formate_For_Dayjs"
        />
      </el-form-item>

      <el-form-item label="激活有效期" prop="activation_end_time">
        <el-date-picker
          v-model="formData.activation_end_time"
          type="date"
          placeholder="选择激活有效期"
          style="width: 100%"
          :format="DateTime_Formate_For_Dayjs"
          :value-format="DateTime_Formate_For_Dayjs"
        />
      </el-form-item>

      <el-form-item label="设备上限数量" prop="device_limit">
        <el-input-number
          v-model="formData.device_limit"
          :min="1"
          :max="1000"
          controls-position="right"
          style="width: 100%"
        />
      </el-form-item>

      <el-divider direction="horizontal" content-position="left">IP段设置（可选）</el-divider>
      <el-form-item label="起始IP" prop="start_ip">
        <el-input v-model="formData.start_ip" placeholder="例如：192.168.1.1" />
      </el-form-item>
      <el-form-item label="结束IP" prop="end_ip">
        <el-input v-model="formData.end_ip" placeholder="例如：192.168.1.255" />
      </el-form-item>

      <el-form-item label="状态操作">
        <div class="status-actions">
          <el-button
            size="default"
            :type="keyData?.status === 3 ? 'success' : 'danger'"
            :icon="keyData?.status === 3 ? Unlock : Lock"
            @click="handleToggleBan"
          >
            {{ keyData?.status === 3 ? '解封密钥' : '封禁密钥' }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSave">保存修改</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="EditKey">
  import type { FormInstance, FormRules } from 'element-plus'
  import { Unlock, Lock } from '@element-plus/icons-vue'
  import { DateTime_Formate_For_Dayjs, IPv4_REGEX } from '@/utils/contant'
  import type { SchoolKey } from './type'
  import { edit, getDetail, unBanned, banned } from '@/api/key'

  type FormData = Pick<
    SchoolKey,
    | 'license'
    | 'remarks'
    | 'school_name'
    | 'end_time'
    | 'activation_end_time'
    | 'device_limit'
    | 'start_ip'
    | 'end_ip'
  >

  // Props 定义
  interface Props {
    visible: boolean
    keyData?: SchoolKey | null
  }

  // Emits 定义
  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'refresh'): void
  }

  const props = withDefaults(defineProps<Props>(), {
    visible: false,
    keyData: null
  })

  const emit = defineEmits<Emits>()

  const initForm = {
    license: '',
    remarks: '',
    school_name: '',
    end_time: '',
    activation_end_time: '',
    device_limit: 1,
    start_ip: '',
    end_ip: ''
  }

  // data
  const dialogVisible = computed({
    get: () => props.visible,
    set: (val: boolean) => emit('update:visible', val)
  })

  const loading = ref(false)
  const formRef = ref<FormInstance>()
  const formData = reactive<FormData>({ ...initForm })

  // 表单验证规则
  const rules = reactive<FormRules<FormData>>({
    remarks: [{ max: 200, message: '备注说明不能超过200个字符', trigger: 'blur' }],
    school_name: [{ max: 50, message: '学校标记不能超过50个字符', trigger: 'blur' }],
    device_limit: [
      { required: true, message: '请设置设备上限数量', trigger: 'blur' },
      { type: 'number', min: 1, max: 1000, message: '设备上限必须在1-1000之间', trigger: 'blur' }
    ],
    start_ip: [{ pattern: IPv4_REGEX, message: '请输入有效的IP地址', trigger: 'blur' }],
    end_ip: [{ pattern: IPv4_REGEX, message: '请输入有效的IP地址', trigger: 'blur' }]
  })

  // 重置表单
  const resetForm = () => {
    formRef.value?.resetFields()
    Object.assign(formData, initForm)
  }

  // 关闭弹窗
  const handleClose = () => {
    dialogVisible.value = false
    resetForm()
  }

  // 打开弹窗
  const handleOpen = async () => {
    resetForm()
    try {
      if (props.keyData?.id) {
        loading.value = true
        Object.assign(formData, props.keyData)
        // const res = await getDetail({ id: props.keyData.id })
        // Object.assign(formData, res.data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  // 保存修改
  const handleSave = async () => {
    if (!formRef.value || !props.keyData) return
    try {
      await formRef.value.validate()
      loading.value = true
      await edit({ ...formData, id: props.keyData.id })
      ElMessage.success('密钥信息已更新')
      emit('refresh')
      handleClose()
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  // 切换封禁状态
  const handleToggleBan = async () => {
    if (!props.keyData?.id) return
    try {
      await ElMessageBox.confirm(
        `确定要${props.keyData.status === 3 ? '解封' : '封禁'}这个密钥吗？`,
        '确认操作',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      loading.value = true
      ;(await props.keyData.status) === 3
        ? unBanned({ id: props.keyData.id })
        : banned({ id: props.keyData.id })
      ElMessage.success(`${props.keyData.status === 3 ? '解封' : '封禁'}成功`)
      emit('refresh')
      handleClose()
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  // 重置密钥
  const handleResetKey = async () => {
    if (!props.keyData?.id) return

    try {
      await ElMessageBox.confirm(
        '确定要重置这个密钥吗？这将清除绑定信息并将状态重置为未使用。',
        '确认重置',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      handleClose()
    } catch {
      // 用户取消操作
    }
  }
</script>
