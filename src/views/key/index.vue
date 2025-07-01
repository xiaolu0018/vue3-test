<template>
  <div v-loading="loading">
    <!-- 统计信息 -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">{{ staticData.Total || 0 }}</div>
        <div class="stat-label">总密钥数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ staticData.UnUsedCount || 0 }}</div>
        <div class="stat-label">未使用</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ staticData.UsedCount || 0 }}</div>
        <div class="stat-label">已使用</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ staticData.ExpiredCount || 0 }}</div>
        <div class="stat-label">已过期</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ staticData.LockedCount || 0 }}</div>
        <div class="stat-label">已封禁</div>
      </div>
    </div>
    <!-- 筛选工具栏 -->
    <div class="card">
      <div class="mb-2">
        <el-form
          class="ua-form-inline"
          :model="filterForm"
          inline
          label-width="auto"
          label-position="top"
        >
          <el-form-item label="状态">
            <el-select
              v-model="filterForm.status"
              placeholder="全部状态"
              clearable
              @change="initSearch"
            >
              <el-option label="全部状态" :value="undefined as any" />
              <el-option
                v-for="server in cacheStore.keyStatus"
                :key="server.id"
                :label="server.name"
                :value="server.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="搜索密钥">
            <el-input
              v-model="filterForm.search_key"
              placeholder="输入密钥"
              clearable
              @change="initSearch"
            />
          </el-form-item>
          <el-form-item label="学校筛选">
            <el-input
              v-model="filterForm.school_name"
              placeholder="输入学校名称"
              clearable
              @change="initSearch"
            />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-select
              v-model="filterForm.create_at"
              placeholder="全部时间"
              clearable
              @change="initSearch"
            >
              <el-option label="全部时间" :value="undefined as any" />
              <el-option label="今天" value="today" />
              <el-option label="本周" value="week" />
              <el-option label="本月" value="month" />
              <el-option label="最近三月" value="quarter" />
            </el-select>
          </el-form-item>

          <el-form-item class="ua-form-inline-item-no-label">
            <el-button type="primary" @click="init">搜索</el-button>
            <el-button :icon="Refresh" @click="resetFilter">重置</el-button>
            <el-button :icon="Document" type="primary" @click="exportData">导出筛选</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 密钥列表 -->
    <div class="card">
      <div class="card-body">
        <el-table
          :data="datas"
          style="width: 100%"
          row-key="ID"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" :reserve-selection="false" width="55" />
          <el-table-column prop="license" label="密钥" min-width="170" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="key-display">{{ row.license }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.statusTagType" size="small">
                {{ row.statusText }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="school_name" label="学校" min-width="100" show-overflow-tooltip />
          <el-table-column prop="remarks" label="备注" min-width="100" show-overflow-tooltip />
          <el-table-column prop="count" label="设备使用" width="150" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="device-count">
                {{ row.device_count || 0 }} / {{ row.device_limit || 0 }}
              </span>
              <span class="device-limit">{{ row.device_count > 0 ? '已绑定' : '未绑定' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remaining" label="剩余时长" width="150" show-overflow-tooltip />
          <el-table-column prop="created_at" label="创建时间" width="180" show-overflow-tooltip />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" :icon="Edit" title="编辑" @click="handleEdit(row)" />
              <el-button
                type="warning"
                :icon="CopyDocument"
                title="复制"
                @click="handleCopy(row)"
              />
              <el-button
                type="success"
                v-if="row.status === 3"
                :icon="Unlock"
                title="解封"
                @click="handleUnban(row)"
              />
              <el-button type="danger" v-else :icon="Lock" title="封禁" @click="handleBan(row)" />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          background
          layout="prev, pager, next"
          prev-text="上一页"
          next-text="下一页"
          :total="total"
          v-model:page-size="limit"
          v-model:current-page="page"
          @current-change="init"
        />
      </div>
    </div>
    <EditKey v-model:visible="showEditModal" :keyData="currentRowData" @refresh="init" />
  </div>
</template>

<script lang="ts" setup name="KeyManager">
  import { Refresh, CopyDocument, Unlock, Lock, Document, Edit } from '@element-plus/icons-vue'
  import type { FormValRef } from '@/types/form-option'
  import { banned, getList, getStatic, unBanned } from '@/api/key'
  import EditKey from './EditKey.vue'
  import { useCacheStore } from '@/store/cacheData'
  import { SchoolKey, exportCsvKeyList } from './type'
  import { copyToClip } from '@/utils/export'
  import { getTimeFormatForRange, getTimeDiffNow, type RangeType } from '@/utils/dayFormate'
  const cacheStore = useCacheStore()
  const { getKeyStatusAndText } = cacheStore
  // 状态管理
  const loading = ref(false)
  const page = ref(1)
  const limit = ref(10)
  const total = ref(0)
  const multipleSelection = ref<SchoolKey[]>([])
  const showEditModal = ref(false)
  const currentRowData = ref<SchoolKey | null>(null)
  // 筛选表单
  const filterForm = ref<FormValRef>({
    search_key: undefined,
    school_name: undefined,
    create_at: undefined,
    status: undefined
  })

  // 统计数据
  const staticData = ref<{ [key: string]: number }>({
    Total: 0,
    UsedCount: 0,
    UnUsedCount: 0,
    ExpiredCount: 0,
    LockedCount: 0
  })

  // 玩家数据
  const datas = ref<SchoolKey[]>([])

  const handleSelectionChange = (val: SchoolKey[]) => {
    multipleSelection.value = val
  }
  const exportData = async () => {
    // await exportKey(datas.value.map((item: any) => item.id as string))
    if (datas.value.length > 0) {
      // @ts-ignore
      exportCsvKeyList(
        multipleSelection.value.length > 0 ? multipleSelection.value : datas.value,
        `school_keys_${new Date().toISOString().split('T')[0]}`
      )
    } else {
      ElMessage.warning('请选择要导出的密钥')
    }
  }

  const handleEdit = (row: object) => {
    currentRowData.value = row as SchoolKey
    showEditModal.value = true
  }
  const handleCopy = async (row: SchoolKey) => {
    await copyToClip(row.license || '')
    ElMessage.success('复制成功')
  }
  const handleBan = async (row: SchoolKey) => {
    await ElMessageBox.confirm('确定封禁该密钥吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await banned({ id: row.id })
    init()
    ElMessage.success('封禁成功')
  }
  const handleUnban = async (row: SchoolKey) => {
    await ElMessageBox.confirm('确定解封该密钥吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await unBanned({ id: row.id })
    init()
    ElMessage.success('解封成功')
  }
  // 重置筛选
  const resetFilter = () => {
    filterForm.value = {
      search_key: undefined,
      status: undefined,
      school_name: undefined,
      create_at: undefined
    }
    page.value = 1
    init()
  }
  const initSearch = () => {
    page.value = 1
    init()
  }
  const init = async () => {
    try {
      loading.value = true
      multipleSelection.value = []
      const query = { ...filterForm.value }
      if (!query.search_key) {
        delete query.search_key
      }
      if (!query.school_name) {
        delete query.school_name
      }
      if (query.create_at) {
        const [st, et] = getTimeFormatForRange(query.create_at as RangeType)
        query.create_start_time = st
        query.create_end_time = et
      }
      delete query.create_at
      if (!query.status && query.status !== 0) {
        query.status = 5
      }
      const res = await getList({
        ...query,
        page: page.value,
        limit: limit.value
      })
      total.value = res.pages?.total || 0
      datas.value = (res.data || []).map((item: any) => {
        const { tagType, text } = getKeyStatusAndText(item.status || 0)
        const remaining = getTimeDiffNow(item.activation_end_time || item.end_time) || '--'
        // ActivationEndTime
        return {
          ...item,
          statusTagType: tagType,
          statusText: text,
          remaining
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  const getKeyStatic = async () => {
    try {
      loading.value = true
      const res = await getStatic({})
      staticData.value = res.data || {}
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  onMounted(() => {
    Promise.allSettled([init(), getKeyStatic()])
  })
</script>
<style scoped>
  /* 现代简约深色主题样式 */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 28px 24px;
    text-align: center;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #64b5f6, #42a5f5);
  }

  .stat-card:hover {
    border-color: rgba(255, 255, 255, 0.12);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    transform: translateY(-4px);
  }

  .stat-value {
    font-size: 32px;
    font-weight: 800;
    color: #64b5f6;
    margin-bottom: 8px;
    text-shadow: 0 2px 4px rgba(100, 181, 246, 0.3);
  }

  .stat-label {
    color: #e0e0e0;
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  /* 表格样式 */
  .key-display {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    font-size: 12px;
    color: #64b5f6;
    font-weight: 600;
    background: rgba(100, 181, 246, 0.1);
    padding: 4px 8px;
    border-radius: 4px;
    letter-spacing: 0.5px;
    word-break: break-all;
  }
  .device-count {
    color: #ffffff;
    font-weight: 600;
    display: block;
  }

  .device-limit {
    color: #757575;
    font-size: 11px;
  }
</style>
