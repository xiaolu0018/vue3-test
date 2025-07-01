<template>
  <div class="announcement-editor">
    <!-- 加载状态 -->
    <el-skeleton :loading="loading" animated>
      <template #template>
        <el-skeleton-item variant="h1" style="width: 50%; height: 40px; margin-bottom: 30px" />
        <el-skeleton-item variant="text" style="width: 100%; height: 24px; margin-bottom: 20px" />
        <el-skeleton-item variant="text" style="width: 80%; height: 24px; margin-bottom: 30px" />
        <div style="display: flex; gap: 20px; margin-top: 30px">
          <el-skeleton-item variant="caption" style="width: 50%; height: 300px" />
          <el-skeleton-item variant="caption" style="width: 50%; height: 300px" />
        </div>
      </template>

      <!-- 主体内容 -->
      <template #default>
        <el-row class="editor-container" :gutter="20">
          <el-col :span="16">
            <!-- 公告编辑表单 -->
            <div class="card editor-form">
              <div class="card-header">
                <h3 class="card-title">
                  <el-icon class="mr-1"><Edit /></el-icon>
                  {{ notice_id ? '编辑公告' : '创建新公告' }}
                </h3>
                <div>
                  <el-button :icon="Back" type="primary" plain class="mr-1" @click="goList">
                    返回列表
                  </el-button>
                  <span class="badge badge-primary" v-show="notice_id">
                    ID:
                    <span>{{ notice_id }}</span>
                  </span>
                </div>
              </div>
              <div class="card-body">
                <!-- 编辑提示信息 -->
                <div class="edit-info" v-show="notice_id">
                  <h5>
                    <el-icon class="mr-1"><InfoFilled /></el-icon>
                    编辑提示
                  </h5>
                  <p>您正在编辑一个已发布的公告。修改后需要重新审核，建议先保存为草稿再发布。</p>
                </div>

                <el-form
                  ref="formRef"
                  size="large"
                  label-width="auto"
                  label-position="top"
                  :model="formData"
                  :rules="formRules"
                  @submit.prevent="handleSubmit"
                >
                  <!-- 公告标题 -->
                  <el-form-item label="公告标题" prop="title">
                    <el-input
                      v-model="formData.title"
                      placeholder="请输入公告标题"
                      clearable
                      maxlength="100"
                      show-word-limit
                    />
                  </el-form-item>

                  <!-- 公告类型 -->
                  <el-form-item label="公告类型" prop="notice_type">
                    <el-radio-group v-model="formData.notice_type">
                      <el-radio-button
                        v-for="type in cacheStore.announcementTypes"
                        :key="type.id"
                        :value="type.id"
                      >
                        <Icon :icon="type.icon" class="mr-1" />
                        {{ type.name }}公告
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>

                  <!-- 富文本编辑器 -->
                  <el-form-item label="公告内容" prop="content">
                    <!-- <RichTextEditor v-model="formData.content" /> -->
                    <el-input
                      placeholder="请输入公告内容"
                      type="textarea"
                      :autosize="{ minRows: 12, maxRows: 12 }"
                      v-model="formData.content"
                    />
                    <!-- <div class="form-text">支持富文本编辑，可插入图片、链接等</div> -->
                  </el-form-item>

                  <!-- 时间范围 -->
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="发布时间" prop="publish_time">
                        <el-date-picker
                          v-model="formData.publish_time"
                          type="datetime"
                          placeholder="开始时间"
                          style="width: 100%"
                          :format="DateTime_Formate_For_Dayjs"
                          :value-format="DateTime_Formate_For_Dayjs"
                          :clearable="false"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="过期时间" prop="expire_time">
                        <el-date-picker
                          v-model="formData.expire_time"
                          type="datetime"
                          placeholder="过期时间"
                          style="width: 100%"
                          :format="DateTime_Formate_For_Dayjs"
                          :value-format="DateTime_Formate_For_Dayjs"
                        />
                        <div class="form-text">留空表示长期有效</div>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <!-- 优先级 -->
                  <!--
                  <el-form-item label="优先级" prop="priority">
                    <el-select v-model="formData.priority" placeholder="请选择优先级">
                      <el-option
                        v-for="item in cacheStore.announcementPriority"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                      />
                    </el-select>
                    <div class="form-text">紧急公告将以弹窗形式优先显示</div>
                  </el-form-item>
                  -->

                  <!-- 发布选项 -->
                  <!--
                  <el-form-item label="发布选项" prop="publish_option">
                    <el-checkbox-group v-model="formData.publish_option">
                      <el-checkbox
                        v-for="item in cacheStore.publishOptions"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                      />
                    </el-checkbox-group>
                  </el-form-item>
                  -->

                  <!-- 服务器范围 -->
                  <el-form-item label="服务器范围" prop="server_range">
                    <el-select
                      v-model="formData.server_range"
                      multiple
                      placeholder="请选择目标服务器"
                      style="width: 100%"
                      @change="handleServersChange"
                    >
                      <el-option value="all" label="全部服务器" />
                      <el-option
                        v-for="server in cacheStore.servers"
                        :key="server.id"
                        :label="server.name"
                        :value="server.id"
                      />
                    </el-select>
                  </el-form-item>

                  <!-- 操作按钮 -->
                  <el-form-item class="form-actions">
                    <!-- <el-button
                      type="warning"
                      size="large"
                      :loading="saving"
                      @click="handleSave('draft')"
                    >
                      <Icon icon="bi:save" class="mr-1" />
                      保存草稿
                    </el-button> -->
                    <el-button
                      type="primary"
                      size="large"
                      :loading="saving"
                      @click="handleSave('publish')"
                    >
                      <Icon icon="bi:send" class="mr-1" />
                      {{ notice_id ? '保存修改' : '发布公告' }}
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <!-- 实时预览 -->
            <div class="card preview-container">
              <div class="card-header">
                <h3 class="card-title">
                  <Icon icon="bi:eye" class="mr-1" />
                  实时预览
                </h3>
              </div>
              <div class="card-body">
                <AnnouncementPreview :data="formData" />
              </div>
            </div>
            <!-- 帮助提示 -->
            <div class="card help-section">
              <div class="card-header">
                <h3 class="card-title">
                  <Icon icon="bi:lightbulb" class="mr-1" />
                  帮助提示
                </h3>
              </div>
              <ul class="card-body help-list">
                <li>
                  <strong>标题要简洁明了</strong>
                  ：让玩家一眼就能了解公告内容
                </li>
                <li>
                  <strong>内容详细准确</strong>
                  ：提供完整的信息，避免歧义
                </li>
                <li>
                  <strong>时间设置合理</strong>
                  ：重要公告建议提前24小时发布
                </li>
                <li>
                  <strong>优先级慎重选择</strong>
                  ：紧急公告会打断玩家游戏体验
                </li>
                <li>
                  <strong>服务器范围</strong>
                  ：根据公告性质选择合适的服务器
                </li>
              </ul>
            </div>
            <!-- 版本历史 -->
            <!-- <div class="card version-history-card">
              <div class="card-header">
                <h3 class="card-title">
                  <Icon icon="bi:clock-history" class="mr-1" />
                  修改历史
                </h3>
              </div>
              <div class="card-body">
                <div class="version-history">
                  <div class="version-item" v-for="(version, index) in history" :key="index">
                    <div class="version-label">
                      <strong>{{ version.label }}</strong>
                    </div>
                    <div class="version-time">{{ version.time }}</div>
                   <small>{{ version.by }}</small>
                  </div>
                </div>
              </div>
            </div> -->
          </el-col>
        </el-row>
      </template>
    </el-skeleton>
  </div>
</template>

<script lang="ts" setup name="AnnouncementCreate">
  import type { FormInstance, FormRules } from 'element-plus'
  import { Back } from '@element-plus/icons-vue'
  import { Icon } from '@iconify/vue'
  import { Announcement } from './notice'
  // import RichTextEditor from '@/components/myEdit.vue'
  import AnnouncementPreview from './AnPreview.vue'
  import { useCacheStore } from '@/store/cacheData'
  import { add, edit, getDetail, getHistory } from '@/api/announcement'
  import { DateTime_Formate_For_Dayjs } from '@/utils/contant'
  const router = useRouter()
  const route = useRoute()
  const cacheStore = useCacheStore()

  const notice_id = ref(route.query?.id)
  // 表单引用
  const formRef = ref<FormInstance>()
  const loading = ref(true)
  const saving = ref(false)

  // 表单数据
  const initForm = {
    title: '',
    content: '',
    notice_type: undefined,
    publish_time: undefined,
    expire_time: undefined,
    server_range: []
    // priority: undefined,
    // publish_option: []
  }
  const formData = reactive<Partial<Announcement>>({ ...initForm })

  // 版本历史数据
  const history = ref([
    { label: '初始版本', time: '2023-10-01 09:30', by: '管理员' },
    { label: '更新公告内容', time: '2023-10-03 14:22', by: '管理员' },
    { label: '修改结束时间', time: '2023-10-05 10:15', by: '管理员' }
  ])
  const validateExpireTime = (_: any, value: any, callback: Function) => {
    if (formData.publish_time && value && new Date(value) < new Date(formData.publish_time)) {
      callback(new Error('过期时间不能早于开始时间'))
    } else {
      callback()
    }
  }
  // 表单验证规则
  const formRules = reactive<FormRules>({
    title: [
      { required: true, message: '请输入公告标题', trigger: 'blur' },
      { min: 4, max: 100, message: '标题长度在4-100个字符之间', trigger: 'blur' }
    ],
    notice_type: [{ required: true, message: '请选择公告类型', trigger: 'change' }],
    content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }],
    publish_time: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
    expire_time: [{ validator: validateExpireTime, trigger: 'change' }],
    // priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
    // publish_option: [{ required: true, message: '请选择发布选项', trigger: 'change' }],
    server_range: [{ required: true, message: '请选择服务器范围', trigger: 'change' }]
  })

  // 初始化方法
  const init = async () => {
    try {
      resetForm()
      notice_id.value = route.query?.id
      if (notice_id.value) {
        loading.value = true
        // 从API获取公告详情
        const res = await getDetail({ notice_id: notice_id.value })

        const data = res.data || {}

        // 填充表单数据
        formData.title = data.title
        formData.content = data.content
        formData.notice_type = data.notice_type
        formData.publish_time = data.publish_time || undefined
        formData.expire_time = data.expire_time || undefined
        formData.server_range = (data.server_range || '').split(',').filter(Boolean)
        // formData.priority = data.priority
        // formData.publish_option = (data.publish_option || '').split(',').filter(Boolean)
      } else {
        formData.notice_type = cacheStore.announcementTypes[0].id
      }
    } catch (error) {
      console.error('加载公告失败:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchHistory = async () => {
    if (notice_id.value) {
      try {
        loading.value = true
        const res = await getHistory({ id: notice_id.value })
        history.value = res.data
      } catch (error) {
        console.error(error)
      } finally {
      }
    } else {
      history.value = []
    }
  }
  const goList = () => {
    router.push({ name: 'AnnouncementList' })
  }
  // 表单提交
  const handleSubmit = async () => {
    handleSave('publish')
  }

  // 保存公告
  const handleSave = async (notice_type: 'draft' | 'publish') => {
    try {
      await formRef.value?.validate()
      saving.value = true

      // 构造保存数据
      const saveData = {
        ...formData,
        // publish_option: (formData.publish_option as string[]).join(','),
        server_range: (formData.server_range as string[]).join(',')
      }
      if (!saveData.expire_time) {
        delete saveData.expire_time
      }
      const result = notice_id.value
        ? await edit({
            ...saveData,
            notice_id: notice_id.value
          })
        : await add(saveData)
      goList()
      ElMessage.success({
        message: notice_id.value ? '保存成功' : '发布成功',
        type: 'success'
      })
    } catch (error) {
      console.error('保存公告失败:', error)
    } finally {
      saving.value = false
    }
  }
  const handleServersChange = (value: string[]) => {
    if (value.includes('all')) {
      formData.server_range = cacheStore.servers.map((server) => server.id)
    }
  }
  // 重置表单
  const resetForm = () => {
    Object.assign(formData, initForm)
    formRef.value?.resetFields()
  }

  // 组件挂载时初始化数据
  onMounted(() => {
    init()
    cacheStore.fetchServers()
    // fetchHistory()
  })
</script>

<style lang="scss" scoped>
  /* 编辑页面特有样式 */
  .edit-info {
    background: #e3f2fd;
    border: 1px solid #2196f3;
    border-radius: 6px;
    padding: 15px;
    margin-bottom: 20px;
  }

  .edit-info h5 {
    color: #1976d2;
    margin-bottom: 10px;
  }

  .edit-info p {
    color: #424242;
    margin: 0;
    font-size: 0.9rem;
  }
  /* 帮助提示样式 */
  .help-section {
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
  }

  .help-section h4 {
    margin-bottom: 15px;
    font-size: 1.1rem;
  }

  .help-section ul {
    margin: 0;
    padding-left: 20px;
    list-style: disc;
    list-style-type: disc;
  }

  .help-section li {
    list-style: disc;
    margin-bottom: 8px;
    font-size: 0.9rem;
  }
  /* 版本历史样式 */
  .version-history {
    max-height: 300px;
    overflow-y: auto;
  }

  .version-item {
    padding: 10px;
    border-bottom: 1px solid #eee;
    font-size: 0.9rem;
  }

  .version-item:last-child {
    border-bottom: none;
  }

  .version-time {
    color: #6c757d;
    font-size: 0.8rem;
  }
</style>
