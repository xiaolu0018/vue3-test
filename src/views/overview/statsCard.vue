<template>
  <el-row :gutter="20" justify="space-between">
    <el-col :span="6" v-for="item in configEntries" :key="item[0]">
      <div class="card">
        <div class="stat-card">
          <div>
            <el-statistic
              class="stat-value"
              :value="props.data[item[0] as keyof StatsProps] || 0"
            />
            <!-- <div class="stat-value">{{ props.data[item[0] as keyof StatsProps] || 0 }}</div> -->
            <div class="stat-label">{{ item[1].label }}</div>
          </div>
          <Icon class="stat-icon" :icon="item[1].icon" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  interface StatsProps {
    total_users: number
    online_users: number
    activityRate: number
    retentionRate: number
  }

  const props = defineProps<{ data: StatsProps }>()

  const config = {
    total_users: {
      label: '总注册用户',
      icon: 'bi:people-fill'
    },
    online_users: {
      label: '当前在线用户',
      icon: 'bi:person-check-fill'
    },
    activityRate: {
      label: '用户活跃度',
      icon: 'bi:activity'
    },
    retentionRate: {
      label: '7日留存率',
      icon: 'bi:graph-up'
    }
  }

  const configEntries = Object.entries(config)
</script>

<style scoped lang="scss">
  .stat-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .stat-value {
    margin-bottom: 5px;
    & > :deep(.el-statistic__content) {
      font-size: 2rem;
      font-weight: 700;
    }
  }

  .stat-label {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .stat-icon {
    font-size: 3rem;
    opacity: 0.7;
    color: var(--accent-color);
  }
</style>
