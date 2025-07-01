<template>
  <el-dialog
    v-model="dialogVisible"
    title="添加用户组"
    width="500px"
    @open="handleOpen"
    @close="handleClose"
    center
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" label-position="top">
      <el-form-item label="用户组名称" prop="group_name">
        <el-input v-model="form.group_name" placeholder="输入用户组名称" clearable />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="用户组描述"
          clearable
        />
      </el-form-item>

      <el-form-item label="初始权限设置" prop="permissions">
        <el-checkbox-group v-model="form.permissions">
          <el-checkbox
            v-for="permission in cacheStore.permissionModules"
            :key="permission.id"
            :value="permission.id"
            :label="permission.name"
          >
            {{ permission.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">创建</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus'
  import { useCacheStore } from '@/store/cacheData'
  import { addGroup } from '@/api/use'

  const cacheStore = useCacheStore()

  interface RoleForm {
    group_name: string
    description: string
    permissions: string[]
  }

  interface Props {
    modelValue: boolean
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'refresh'): void
  }
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const dialogVisible = computed({
    get: () => props.modelValue,
    set: (val: boolean) => emit('update:modelValue', val)
  })

  const loading = ref(false)
  const formRef = ref<FormInstance>()
  const initForm = {
    group_name: '',
    description: '',
    permissions: []
  }
  const form = reactive<RoleForm>({ ...initForm })

  const rules = reactive<FormRules<RoleForm>>({
    group_name: [
      { required: true, message: '请输入用户组名称', trigger: 'blur' },
      { min: 2, max: 20, message: '用户组名称长度在 2 到 20 个字符', trigger: 'blur' },
      {
        pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/,
        message: '用户组名称只能包含中文、英文、数字和下划线',
        trigger: 'blur'
      }
    ],
    description: [{ max: 200, message: '描述长度不能超过 200 个字符', trigger: 'blur' }]
  })

  const resetForm = () => {
    Object.assign(form, initForm)
    formRef.value?.clearValidate()
  }
  const handleOpen = async () => {}
  const handleClose = () => {
    resetForm()
    dialogVisible.value = false
  }

  const handleSubmit = async () => {
    if (!formRef.value) return
    try {
      await formRef.value.validate()
      loading.value = true
      await addGroup({
        ...form,
        permissions: form.permissions
          .map((permission) => {
            const subPermission = cacheStore.permissionModules
              .find((item) => item.id === permission)
              ?.permissions?.map((ite) => ite.id)
            return subPermission?.length ? subPermission.join(',') : undefined
          })
          .filter(Boolean)
          .join(',')
      })
      emit('refresh')
      ElMessage.success('用户组创建成功')
      handleClose()
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
  :deep(.el-checkbox-group) {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    grid-gap: 20px;
  }

  :deep(.el-checkbox) {
    margin-right: 0;
    white-space: nowrap;
  }

  :deep(.el-textarea .el-input__inner) {
    resize: vertical;
  }
</style>
