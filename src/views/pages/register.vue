<template>
  <div class="login-bg">
    <div class="login-container">
      <div class="login-header">
        <img class="logo mr10" src="~@/assets/img/logo.png" alt="" />
        <div class="login-title">{{ APP_TITLE }}</div>
      </div>
      <el-form :model="param" :rules="rules" ref="register" size="large">
        <!-- <el-form-item prop="phone_number">
          <el-input v-model="param.phone_number" placeholder="手机号">
            <template #prepend>
              <el-icon><Iphone /></el-icon>
            </template>
          </el-input>
        </el-form-item> -->
        <el-form-item prop="account_name">
          <el-input v-model="param.account_name" placeholder="用户名">
            <template #prepend>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="param.password"
            @keyup.enter="submitForm"
          >
            <template #prepend>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-button class="login-btn" type="primary" size="large" @click="submitForm">
          注册
        </el-button>
        <p class="login-text">
          已有账号，
          <el-link type="primary" @click="$router.push('/login')">立即登录</el-link>
        </p>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
  // import { Register } from '@/types/user'
  // import { PHONE_REGEXP } from '@/utils/contant'
  import { APP_TITLE } from '@/utils/contant'
  import { registUser } from '@/api/use'

  const router = useRouter()
  const param = reactive({
    // phone_number: '',
    account_name: '',
    password: ''
  })

  const rules: FormRules = {
    // phone_number: [
    //   {
    //     required: true,
    //     message: '请输入手机号',
    //     trigger: 'blur'
    //   },
    //   {
    //     pattern: PHONE_REGEXP, // 中国大陆手机号正则
    //     message: '请输入有效的手机号',
    //     trigger: 'blur'
    //   }
    // ],
    account_name: [
      {
        required: true,
        message: '请输入用户名',
        trigger: 'blur'
      }
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
  }
  const register = ref<FormInstance>()
  const submitForm = () => {
    if (!register.value) return
    ;(register.value as FormInstance).validate(async (valid: boolean) => {
      if (valid) {
        const data = await registUser({
          account_name: param.account_name,
          password: window.btoa(param.password)
        })
        console.log('registUser data ', data)
        ElMessage.success('注册成功，请登录')
        router.push('/')
      } else {
        return Promise.reject(false)
      }
    })
  }
</script>

<style scoped>
  .login-bg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background-color: #000;
    background-size: cover;
    position: relative;
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

  .login-container {
    width: 100%;
    max-width: 420px;
    padding: 40px;
    background-color: rgba(26, 26, 26, 0.9);
    border-radius: 8px;
    box-shadow: $shadow;
    z-index: 10;
  }

  .login-btn {
    display: block;
    width: 100%;
  }

  .login-text {
    display: flex;
    align-items: center;
    margin-top: 20px;
    font-size: 14px;
    color: #787878;
  }
</style>
