<template>
  <div class="login-bg">
    <div class="login-container">
      <div class="login-header">
        <img class="logo mr10" src="~@/assets/img/logo.png" alt="" />
        <h1 class="login-title">{{ APP_TITLE }}</h1>
      </div>
      <el-form
        v-loading="loading"
        :model="param"
        :rules="rules"
        ref="loginRef"
        size="large"
        label-width="auto"
        label-position="top"
        hide-required-asterisk
        @keyup.enter.native="submitForm"
      >
        <el-form-item prop="account_name" label="用户名">
          <el-input
            v-model="param.account_name"
            placeholder="用户名"
            :minlength="5"
            :maxlength="20"
          />
        </el-form-item>
        <el-form-item prop="password" label="密码" class="mb-5">
          <el-input
            type="password"
            placeholder="密码"
            v-model="param.password"
            show-password
            :minlength="8"
            :maxlength="20"
          />
        </el-form-item>
        <div class="pwd-tips">
          <el-checkbox class="pwd-checkbox" v-model="checked" label="记住密码" />
          <!-- <el-link type="primary" @click="$router.push('/reset-pwd')">忘记密码</el-link> -->
        </div>
        <el-button
          class="login-btn"
          type="primary"
          size="large"
          :loading="loading"
          @click="submitForm"
        >
          登录
        </el-button>
        <!-- <p class="login-text">
          没有账号？
          <el-link type="primary" @click="$router.push('/register')">立即注册</el-link>
        </p> -->
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ACCOUNT_PSD, APP_TITLE } from '@/utils/contant'
  import { loginUse } from '@/api/use'
  // import { PHONE_REGEXP } from '@/utils/contant'
  import { useUserStore } from '@/store/user'

  const PsdStorageKey = 'ppss'

  interface LoginInfo {
    account_name: string
    password: string
  }

  const checked = ref(false)
  const loading = ref(false)
  const router = useRouter()
  const userStore = useUserStore()

  const param = reactive<LoginInfo>({
    account_name: '',
    password: ''
  })

  const rules: FormRules = {
    account_name: [
      {
        required: true,
        message: '请输入用户名',
        trigger: 'blur'
      },
      {
        // 长度限制5-20位
        type: 'string',
        min: 5,
        max: 20,
        message: '用户名长度在5-20位之间',
        trigger: 'blur'
      }
    ],
    // 密码8-20位大小写字母加数字特殊符号组合
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
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
    ]
  }

  const remenberHandle = (val: boolean) => {}
  const loginRef = ref<FormInstance>()
  const submitForm = async () => {
    if (!loginRef.value) return // 确保 loginRef 引用存在
    await loginRef.value.validate()
    try {
      loading.value = true
      let psd = null
      try {
        if (checked.value) {
          localStorage.setItem('vuems_name', param.account_name)
          localStorage.setItem(PsdStorageKey, param.password || '')
        } else {
          localStorage.removeItem(PsdStorageKey)
        }
        psd = window.btoa(param.password)
      } catch (error: any) {
        ElMessage.error(error?.message || '登录失败')
        throw error
      }
      const res = await loginUse({
        account_name: param.account_name,
        password: psd
      })
      const data = res.data || {}
      if (data?.token) {
        // token写入cookie作为登录凭证
        await localStorage.setItem('tokenName', data.token || '')
        userStore.setLoading(false)
        ElMessage.success('登录成功')
        router.push('/')
      }
    } catch (error) {
      console.log(error)
    } finally {
      loading.value = false
    }
  }
  // 初始化
  onMounted(() => {
    // 检查是否有记住的用户
    const psd = localStorage.getItem(PsdStorageKey) || ''
    const aname = localStorage.getItem('vuems_name') || ''
    checked.value = !!(psd && aname)
    if (checked.value) {
      param.account_name = aname
      param.password = psd
    }
  })
</script>

<style scoped lang="scss">
  .login-bg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100vh;
    /* background: url(../images/drone-bg.jpg) no-repeat center center; */
    background-color: #000;
    background-size: cover;
    position: relative;
  }
  .login-container {
    width: 100%;
    max-width: 420px;
    padding: 40px;
    background-color: rgba(26, 26, 26, 0.9);
    border-radius: 8px;
    box-shadow: $shadow;
    z-index: 10;
  }
  .login-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .logo {
    height: 60px;
    margin-bottom: 15px;
  }

  .login-title {
    font-size: 24px;
    color: $text-color;
    margin: 0;
  }

  .pwd-tips {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    margin: 10px 0 10px;
    color: #787878;
  }

  .pwd-checkbox {
    height: auto;
  }

  .login-btn {
    display: block;
    width: 100%;
  }

  .login-tips {
    font-size: 12px;
    color: #999;
  }

  .login-text {
    display: flex;
    align-items: center;
    margin-top: 20px;
    font-size: 14px;
    color: #787878;
  }
</style>
