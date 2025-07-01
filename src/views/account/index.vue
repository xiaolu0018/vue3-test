<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">后台账号管理</h3>
        <el-button :icon="Plus" @click="addAccount" type="primary">添加账号</el-button>
      </div>
      <div class="card-body">
        <div class="table-container">
          <div class="mb-4">
            <el-input
              type="text"
              class="form-control table-search"
              v-model="account_name"
              placeholder="搜索账号..."
              clearable
              @input="handleSizeChange"
            />
          </div>
          <el-table :data="datas" v-loading="loading" style="width: 100%">
            <el-table-column prop="account_id" label="ID" width="170" show-overflow-tooltip />
            <el-table-column prop="account_name" label="用户名" show-overflow-tooltip />
            <el-table-column prop="real_name" label="真实姓名" show-overflow-tooltip />
            <el-table-column prop="account_group_id" label="用户组" show-overflow-tooltip>
              <template #default="{ row }">
                <!-- <span class="badge badge-success">{{ row.account_group_id }}</span> -->
                <el-tag
                  :type="
                    row.account_group_name
                      ? row.account_group_id === '1'
                        ? 'primary'
                        : 'warning'
                      : 'danger'
                  "
                  size="small"
                >
                  {{ row.account_group_name || '未分配' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status ? 'success' : 'danger'" size="small">
                  {{ row.status ? '启用' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="last_login" label="最后登录" show-overflow-tooltip />
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button type="primary" @click="handleEdit(row)" :disabled="row.is_admin">
                  修改
                </el-button>
                <el-button
                  type="danger"
                  v-if="!!row.status"
                  @click="handleDisable(row)"
                  :disabled="row.is_admin"
                >
                  禁用
                </el-button>
                <el-button
                  type="success"
                  v-else
                  @click="handleEnable(row)"
                  :disabled="row.is_admin"
                >
                  启用
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-model:current-page="page"
            v-model:page-size="limit"
            :total="total"
            layout="prev, pager, next"
            class="pagination"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
            prev-text="上一页"
            next-text="下一页"
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">用户组分布</h3>
        </div>
        <div class="card-body">
          <PieChart :radius="['50%', '80%']" :data="groupData" />
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">账号操作日志</h3>
        </div>
        <div class="card-body log-box">
          <ul class="activity-list">
            <li class="activity-item" v-for="item in opLogs" :key="item.account_id">
              <div :class="`activity-icon ${item.iconClass}`">
                <Icon :icon="item.icon" />
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ item.label }}</div>
                <div class="activity-text">{{ item.operation_desc }}</div>
                <div class="activity-time">{{ item.updated_at || item.created_at }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <edit-account :id="editId" @refresh="init" v-model:visible="editVisible" />
  </div>
</template>

<script setup lang="ts">
  import { Plus } from '@element-plus/icons-vue'
  import { Icon } from '@iconify/vue'
  import PieChart from '@/components/EchartVue/PieChart.vue'
  import type { FormValRef } from '@/types/form-option'
  import EditAccount from './EditAccount.vue'
  import { getOpIcon } from './optIcon'
  import { getUsers, disableUser, enableUser, getGroupDistribution, getUserLogs } from '@/api/use'

  const loading = ref(false)
  const datas = ref<FormValRef[]>([])
  const page = ref(1)
  const limit = ref(10)
  const total = ref(0)
  const opLogs = ref<{ [key: string]: any }[]>([])
  const account_name = ref('')
  const editVisible = ref(false)
  const editId = ref()

  const groupData = ref([])

  const handleEdit = (row: FormValRef) => {
    if (row.is_admin) {
      return ElMessage.warning('超级管理员不可编辑')
    }
    editId.value = row.account_id
    editVisible.value = true
  }

  const addAccount = () => {
    editId.value = null
    editVisible.value = true
  }

  const handleDisable = async (row: FormValRef) => {
    if (row.is_admin) {
      return ElMessage.warning('超级管理员不可编辑')
    }
    await ElMessageBox.confirm('是否确认禁用？', '禁用', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await disableUser({ account_id: row.account_id, account_name: row.account_name })
    init()
  }
  const handleEnable = async (row: FormValRef) => {
    if (row.is_admin) {
      return ElMessage.warning('超级管理员不可编辑')
    }
    await ElMessageBox.confirm('是否确认启用？', '启用', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await enableUser({ account_id: row.account_id, account_name: row.account_name })
    init()
  }
  const handlePageChange = () => {
    init()
  }
  const handleSizeChange = () => {
    page.value = 1
    init()
  }
  const init = async () => {
    try {
      loading.value = true
      const params: { [key: string]: any } = {
        page: page.value,
        limit: limit.value
      }
      account_name.value && (params.account_name = account_name.value)
      editId.value = null
      const res = await getUsers(params)
      total.value = res.pages?.total || 0
      datas.value = (res.data || []).map((item: any) => {
        return {
          ...item,
          is_admin: item.account_group_id === 1 || item.account_group_id === '1'
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  // 用户组分布
  const getGroupData = async () => {
    try {
      loading.value = true
      const res = await getGroupDistribution()
      groupData.value = (res.data || []).map((item: any) => ({
        name: item.group_name || '未知',
        value: item.group_count || 0
      }))
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  //操作日志
  const getLogs = async () => {
    try {
      loading.value = true
      const res = await getUserLogs({})
      opLogs.value = (res.data || []).map((item: any) => {
        const { label, icon, iconClass } = getOpIcon(item.operation_type)
        return {
          ...item,
          label,
          icon,
          iconClass
        }
      })
    } catch (error) {
      console.log(error)
    } finally {
      loading.value = false
    }
  }
  onMounted(() => {
    init()
    Promise.allSettled([getGroupData(), getLogs()])
  })
</script>

<style lang="scss" scoped>
  .row {
    display: flex;
    flex-wrap: wrap;
    margin: 0 0 20px;
    gap: 30px;
    align-items: start;
    & > .card {
      flex: 1;
    }
  }
  .activity-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .activity-item {
    display: flex;
    padding: 15px 0;
    border-bottom: 1px solid var(--border-color);
  }

  .activity-item:last-child {
    border-bottom: none;
  }

  .activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 15px;
    flex-shrink: 0;
    font-size: 18px;
    color: #fff;
  }

  .bg-primary {
    background-color: var(--accent-color);
  }

  .bg-success {
    background-color: var(--success-color);
  }

  .bg-warning {
    background-color: var(--warning-color);
  }

  .bg-danger {
    background-color: var(--danger-color);
  }
  .log-box {
    height: 340px;
    overflow-y: auto;
  }
</style>
