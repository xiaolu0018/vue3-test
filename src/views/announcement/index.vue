<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h3>公告管理</h3>
        <el-button type="primary" :icon="Plus" @click="createAnnouncement">创建公告</el-button>
      </div>
      <div class="card-body">
        <el-input
          v-model="keyword"
          class="mb-4"
          placeholder="搜索公告..."
          clearable
          @input="handleSearch"
          @keyup.enter="handleSearch"
        />
        <el-table :data="announcementData" style="width: 100%" row-key="notice_id">
          <el-table-column prop="notice_id" label="ID" width="170" show-overflow-tooltip />
          <el-table-column prop="title" label="标题" show-overflow-tooltip />
          <el-table-column prop="type" label="类型" width="100">
            <template #default="{ row }">
              <el-tag :type="row.tagType" size="small">
                {{ row.typeText }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="publisher" label="发布人" width="100" show-overflow-tooltip />
          <el-table-column prop="publish_time" label="发布时间" width="160" />
          <el-table-column prop="expire_time" label="过期时间" width="160" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.statusTag" size="small">
                {{ row.statusText }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="230">
            <template #default="{ row }">
              <el-button type="primary" @click="handleView(row)">查看</el-button>
              <el-button type="warning" @click="handleEdit(row)">编辑</el-button>
              <el-button v-if="row.status === 'pending'" type="success" @click="handlePublish(row)">
                发布
              </el-button>
              <el-button v-else type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          background
          prev-text="上一页"
          next-text="下一页"
          layout="prev, pager, next"
          v-model:current-page="page"
          :page-size="limit"
          :total="total"
          @current-change="init"
        />
      </div>
    </div>
    <div class="announcement-statistics">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="card">
            <div class="card-header">
              <h3>公告类型统计</h3>
            </div>
            <div class="chart-body">
              <BarChart :data="noticeDistribution" bar-width="20%" />
            </div>
          </div>
        </el-col>
        <!--<el-col :span="12">
          <div class="card">
            <div class="card-header">
              <h3>公告模板</h3>
            </div>
            <div class="card-body">
              <div class="template-list">
                <div v-for="template in templates" :key="template.id" class="template-item">
                  <div class="template-title">{{ template.title }}</div>
                  <div class="template-description">{{ template.description }}</div>
                  <div class="template-actions">
                    <el-button type="primary" @click="handleUseTemplate(template)">
                      使用模板
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>-->
      </el-row>
    </div>
    <AnnouncementDetailDialog
      v-model="detailDialogVisible"
      :announcement="currentAnnouncement"
      @edit="handleEdit"
    />
  </div>
</template>

<script setup lang="ts">
  import type { Announcement } from './notice'
  import { Plus } from '@element-plus/icons-vue'
  import BarChart from '@/components/EchartVue/BarChart.vue'
  import AnnouncementDetailDialog from './ViewDetail.vue'
  import { useCacheStore } from '@/store/cacheData'
  import { getList, getNoticeType, publish, remove } from '@/api/announcement'
  import { BaseObject } from '@/types/form-option'

  const cacheStore = useCacheStore()
  const router = useRouter()

  const { getAnnouncementTypeAndText, getAnnouncementStatusAndText } = cacheStore
  const detailDialogVisible = ref(false)
  const currentAnnouncement = ref<Announcement | null>(null)

  const loading = ref(false)
  const announcementData = ref<Announcement[]>()
  const keyword = ref('')
  const page = ref(1)
  const limit = ref(10)
  const total = ref(0)

  const noticeDistribution = ref<BaseObject[]>([])
  const templates = ref([])

  const handleSearch = () => {
    page.value = 1
    init()
  }
  const createAnnouncement = () => {
    router.push({ name: 'AnnouncementCreate' })
  }
  const handleView = (announcement: Announcement) => {
    currentAnnouncement.value = announcement
    detailDialogVisible.value = true
  }

  const handleEdit = (row: Announcement) => {
    router.push({ name: 'AnnouncementCreate', query: { id: row.notice_id } })
  }

  const handlePublish = async (notice_id: number) => {
    await ElMessageBox.confirm('是否确认发布该公告？', '确认操作', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    try {
      loading.value = true
      await publish({ notice_id: notice_id })
      init()
      ElMessage.success('操作成功')
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const handleDelete = async (row: any) => {
    await ElMessageBox.confirm('确定要删除该公告吗？', '确认操作', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    try {
      loading.value = true
      await remove({ notice_id: row.notice_id })
      init()
      ElMessage.success('操作成功')
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  const handleUseTemplate = (template: any) => {
    // router.push({ name: 'AnnouncementCreate', query: { template: JSON.stringify(template) } })
  }
  const init = async () => {
    try {
      loading.value = true
      const params: { [key: string]: any } = {
        page: page.value,
        limit: limit.value
      }
      keyword.value && (params.keyword = keyword.value)
      const res = await getList(params)
      announcementData.value = (res.data || []).map((item: any) => {
        const { tagType, text } = getAnnouncementTypeAndText(item.notice_type)
        const { tagType: statusTag, text: statusText } = getAnnouncementStatusAndText(item.status)
        return {
          ...item,
          tagType,
          typeText: text,
          statusTag,
          statusText
        }
      })
      total.value = res.pages.total
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  const getDistribution = async () => {
    try {
      loading.value = true
      const res = await getNoticeType({})
      noticeDistribution.value = Object.entries(res.data || {}).map(([key, item]) => {
        const { text } = getAnnouncementTypeAndText(key)
        return {
          name: text,
          value: item || 0
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  onMounted(() => {
    init()
    getDistribution()
  })
</script>

<style lang="scss" scoped>
  .template-list {
    margin-top: 10px;
  }

  .template-item {
    padding: 15px;
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.03);
    margin-bottom: 15px;
    border-left: 3px solid var(--accent-color);
  }

  .template-title {
    font-weight: 500;
    margin-bottom: 8px;
  }

  .template-description {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 10px;
  }

  .template-actions {
    display: flex;
    justify-content: flex-end;
  }
</style>
