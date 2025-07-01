<template>
  <el-dialog
    v-model="dialogVisible"
    title="查看公告"
    width="800px"
    :close-on-click-modal="false"
    @open="handleOpen"
  >
    <div v-loading="loading">
      <AnPreview v-if="announcementData" :data="announcementData" />
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
      <el-button type="primary" @click="handleEdit">编辑公告</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { getDetail } from '@/api/announcement'
  import AnPreview from './AnPreview.vue'
  import type { AnnouncementDetail, Announcement } from './notice'
  const props = defineProps<{
    modelValue: boolean
    announcement: Announcement | null
  }>()

  const emit = defineEmits(['update:modelValue'])

  const router = useRouter()

  const dialogVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })

  const loading = ref(false)
  const announcementData = ref<AnnouncementDetail>()

  const handleEdit = () => {
    if (props.announcement) {
      router.push({ name: 'AnnouncementCreate', query: { id: props.announcement.notice_id } })
      dialogVisible.value = false
    }
  }
  const handleOpen = async () => {
    try {
      announcementData.value = undefined
      if (props.announcement) {
        loading.value = true
        const res = await getDetail({ notice_id: props.announcement.notice_id })
        announcementData.value = res.data
      }
    } catch (error) {
      console.error(error)
      announcementData.value = props.announcement as AnnouncementDetail
    } finally {
      loading.value = false
    }
  }
</script>
