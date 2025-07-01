<template>
  <div v-loading="loading">
    <stats-card :data="stats" />
    <div class="grid-box">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">注册用户趋势</h3>
          <div class="card-controls">
            <el-date-picker
              v-model="register_time"
              type="year"
              placeholder="选择时间"
              :clearable="false"
              :format="Year_formate"
              :value-format="Year_formate"
              @change="init"
            />
          </div>
        </div>
        <div class="card-body">
          <line-chart :data="regitstTred" color="#ffd700" />
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">在线用户趋势</h3>
          <div class="card-controls">
            <el-date-picker
              v-model="online_time"
              type="date"
              :clearable="false"
              :format="Date_Formate_For_Dayjs"
              :value-format="Date_Formate_For_Dayjs"
              @change="init"
            />
          </div>
        </div>
        <div class="card-body">
          <line-chart :data="onlineTrend" color="#3498db" />
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">用户留存率</h3>
          <div class="card-controls">
            <el-date-picker
              v-model="selectDayForRetention"
              type="date"
              :clearable="false"
              :format="Date_Formate_For_Dayjs"
              :value-format="Date_Formate_For_Dayjs"
              @change="getRetentionRate"
            />
          </div>
        </div>
        <div class="card-body">
          <bar-chart :data="retentionRate" />
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">最近活动</h3>
        </div>
        <div class="card-body" style="min-height: 350px">
          <ul class="activity-list">
            <li v-for="activity in activities" :key="activity.id" class="activity-item">
              <Icon class="activity-icon" :icon="activity.icon || 'bi:megaphone'" />
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-text">{{ activity.text }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { BaseObject } from '@/types/form-option'
  import StatsCard from './statsCard.vue'
  import LineChart from '@/components/EchartVue/LineChart.vue'
  import BarChart from '@/components/EchartVue/BarChart.vue'
  import { Icon } from '@iconify/vue'
  import { Date_Formate_For_Dayjs } from '@/utils/contant'
  import { getData } from '@/api/dashboard'
  import { formatTime } from '@/utils/dayFormate'
  const loading = ref(false)
  const stats = ref({
    total_users: 0,
    online_users: 0,
    activityRate: 0,
    retentionRate: 0
  })
  const Year_formate = 'YYYY'
  const register_time = ref(formatTime(new Date(), Year_formate))
  const online_time = ref(formatTime(new Date()))
  const selectDayForRetention = ref(formatTime(new Date()))

  const regitstTred = ref<BaseObject[]>([])
  const onlineTrend = ref<BaseObject[]>([])
  const retentionRate = ref<BaseObject[]>([])
  const activities = ref<BaseObject[]>([])

  const init = async () => {
    try {
      loading.value = true
      // 初始化
      stats.value = {
        total_users: 0,
        online_users: 0,
        activityRate: 0,
        retentionRate: 0
      }
      const res = await getData({
        register_time: register_time.value,
        online_time: online_time.value
      })
      const data = res.data || {}

      stats.value = {
        total_users: data.total_users || 0,
        online_users: data.online_users || 0,
        activityRate: data.activityRate || 0,
        retentionRate: data.retentionRate || 0
      }
      regitstTred.value = (data.registration_trend || []).map((item: any) => {
        return {
          value: item.count || 0,
          name: item.month || ''
        }
      })
      onlineTrend.value = (data.online_trend || []).map((item: any) => {
        return {
          value: item.count || 0,
          name: item.time_range || ''
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const getRegisterTrend = async () => {
    console.log(register_time.value)
    try {
      loading.value = true
      // 初始化
      regitstTred.value = [
        { value: 12, name: '周一' },
        { value: 15, name: '周二' },
        { value: 22, name: '周三' },
        { value: 42, name: '周四' },
        { value: 2, name: '周五' },
        { value: 12, name: '周六' },
        { value: 142, name: '周日' }
      ]
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  const getOnlineTrend = async () => {
    console.log(online_time.value)
    try {
      loading.value = true
      // 初始化
      onlineTrend.value = [
        { value: 62, name: '次日' },
        { value: 10, name: '7日' },
        { value: 22, name: '15日' },
        { value: 42, name: '30日' }
      ]
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  const getRetentionRate = async () => {
    console.log(selectDayForRetention.value)
    try {
      loading.value = true
      // 初始化
      retentionRate.value = [
        { value: 12, name: '周一' },
        { value: 15, name: '周二' },
        { value: 22, name: '周三' },
        { value: 42, name: '周四' },
        { value: 2, name: '周五' },
        { value: 12, name: '周六' },
        { value: 142, name: '周日' }
      ]
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const opTypes = [
    { icon: 'bi:person-plus', type: 'regist', class: 'bg-primary', label: '新用户注册' },
    { icon: 'bi:shield-exclamation', type: 'warning', class: 'bg-warning', label: '系统警告' },
    { icon: 'bi:megaphone', type: 'notice', class: 'bg-success', label: '新公告发布' },
    { icon: 'bi:exclamation-triangle', type: 'ban', class: 'bg-danger', label: '玩家封禁' }
  ]
  const getUserLogs = async () => {
    try {
      loading.value = true
    } catch (error) {
      console.log(error)
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    await init()
    // Promise.allSettled([getRegisterTrend(), getOnlineTrend(), getRetentionRate(), getUserLogs()])
  })
</script>

<style lang="scss" scoped>
  .grid-box {
    display: grid;
    grid-template-columns: repeat(2, minmax(300px, 1fr));
    gap: 30px;
    align-items: start;
  }
  .activity-list {
    list-style: disc;
    list-style-type: disc;
  }
  .activity-item {
    list-style: disc;
    margin-bottom: 5px;
    font-size: 1rem;
  }
</style>
