<template>
  <el-dialog
    v-model="dialogVisible"
    :title="props.id ? '编辑账号' : '添加账号'"
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="init"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="auto"
      label-position="top"
      hide-required-asterisk
      v-loading="loading"
    >
      <el-form-item label="用户名" prop="account_name">
        <el-input
          v-model="form.account_name"
          placeholder="请输入用户名"
          :minlength="5"
          :maxlength="20"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          :placeholder="props.id ? '请输入密码，置空则不修改密码' : '请输入密码'"
          show-password
          :minlength="8"
          :maxlength="20"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="password_confirm">
        <el-input
          v-model="form.password_confirm"
          type="password"
          placeholder="请再次输入密码"
          show-password
          :minlength="8"
          :maxlength="20"
        />
      </el-form-item>
      <el-form-item label="真实姓名" prop="real_name">
        <el-input v-model="form.real_name" placeholder="请输入真实姓名" />
      </el-form-item>
      <el-form-item label="用户组" prop="account_group_id">
        <el-select v-model="form.account_group_id" placeholder="请选择用户组" style="width: 100%">
          <el-option
            v-for="item in groupLists"
            :key="item.group_id"
            :value="item.group_id"
            :label="item.group_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" type="email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus'
  import { getUserDetail, registUser, updateUser, getGroups } from '@/api/use'
  import { BaseObject } from '@/types/form-option'
  import { ACCOUNT_PSD } from '@/utils/contant'

  interface AccountForm {
    account_name: string
    password: string
    password_confirm: string
    real_name: string
    account_group_id: string
    email: string
    phone: string
  }

  interface Props {
    visible: boolean
    id?: number | string
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'refresh'): void
  }
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const dialogVisible = computed({
    get: () => props.visible,
    set: (value: boolean) => emit('update:visible', value)
  })

  const loading = ref(false)
  const formRef = ref<FormInstance>()
  const initForm = {
    account_name: '',
    password: '',
    password_confirm: '',
    real_name: '',
    account_group_id: '',
    email: '',
    phone: ''
  }
  const form = reactive<AccountForm>({ ...initForm })
  const groupLists = ref<BaseObject[]>([])
  const validatePassword = (rule: any, value: string, callback: any) => {
    if (!props.id && value === '') {
      callback(new Error('请输入密码'))
    } else {
      callback()
    }
  }
  const validateConfirmPassword = (rule: any, value: string, callback: any) => {
    if (form.password && value === '') {
      callback(new Error('请再次输入密码'))
    } else if (value !== form.password) {
      callback(new Error('两次输入密码不一致'))
    } else {
      callback()
    }
  }

  const rules = reactive<FormRules<AccountForm>>({
    account_name: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      {
        // 长度限制5-20位
        type: 'string',
        min: 5,
        max: 20,
        message: '用户名长度在5-20个字符',
        trigger: 'blur'
      }
    ],
    password: [
      { required: true, validator: validatePassword, trigger: 'blur' },
      {
        type: 'string',
        min: 8,
        max: 20,
        message: '密码长度在8-20位之间',
        trigger: 'blur'
      },
      {
        pattern: ACCOUNT_PSD,
        message: '密码必须包含大小写字母、数字和特殊符号',
        trigger: 'blur'
      }
    ],
    password_confirm: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }],
    real_name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
    account_group_id: [{ required: true, message: '请选择用户组', trigger: 'change' }],
    email: [
      // { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    phone: [
      // { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
    ]
  })

  const resetForm = () => {
    Object.assign(form, initForm)
    formRef.value?.clearValidate()
  }
  const getUserGroups = async () => {
    try {
      loading.value = true
      const response = await getGroups({})
      groupLists.value = ((response.data as BaseObject[]) || []).filter(
        (item) => item.group_id !== 1 && item.group_id !== '1'
      )
    } catch (error) {
      console.error('获取用户组失败:', error)
    } finally {
      loading.value = false
    }
  }

  const init = async () => {
    resetForm()
    if (props.id) {
      try {
        loading.value = true
        const response = await getUserDetail({ account_id: props.id })
        Object.assign(form, response?.data)
      } catch (error) {
        console.error('获取用户详情失败:', error)
      } finally {
        loading.value = false
      }
    }
    await getUserGroups()
  }
  const handleClose = () => {
    resetForm()
    dialogVisible.value = false
  }

  const handleSubmit = async () => {
    if (!formRef.value) return
    try {
      await formRef.value.validate()
      loading.value = true
      const params: { [key: string]: any } = {
        ...form
        // account_group_name:
        //   groupLists.value.find((item) => item.group_id === form.account_group_id)?.group_name || ''
      }
      if (form.password) {
        const password_confirm = window.btoa(form.password)
        params.password_confirm = password_confirm
        params.password = password_confirm
      } else {
        delete params.password
        delete params.password_confirm
      }
      delete params.status
      delete params.created_at
      if (props.id) {
        await updateUser({
          ...params,
          account_id: props.id
        })
      } else {
        await registUser({
          ...params
        })
      }
      emit('refresh')
      ElMessage.success('修改成功')
      handleClose()
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
</script>
