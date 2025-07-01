<template>
  <div v-if="announcementData" class="announcementData-detail">
    <h4>{{ announcementData.title }}</h4>
    <div class="announcementData-meta">
      <el-tag :type="announcementData.typeTag" class="light-theme-tag" size="small">
        {{ announcementData.typeText }}
      </el-tag>
      <el-tag
        class="light-theme-tag ml-1"
        v-if="announcementData.priorityText"
        size="small"
        :type="announcementData.priorityTag"
      >
        {{ announcementData.priorityText }}
      </el-tag>
      <div class="meta-info">
        <small class="text-muted">
          发布人：{{ announcementData.publisher }} | 发布时间：{{
            announcementData.publish_time || announcementData.created_at || formatTime()
          }}
        </small>
      </div>
    </div>
    <div class="announcementData-content">{{ announcementData.content }}</div>
  </div>
</template>

<script setup lang="ts">
  import { useCacheStore } from '@/store/cacheData'
  import type { Announcement } from './notice'
  import { formatTime } from '@/utils/dayFormate'
  const props = defineProps<{
    data: Partial<Announcement>
  }>()

  const cacheStore = useCacheStore()
  const { getAnnouncementTypeAndText, getAnnouncementPriorityAndText } = cacheStore

  const announcementData = computed(() => {
    if (props.data) {
      const { tagType: typeTag, text: typeText } = getAnnouncementTypeAndText(
        props.data!.notice_type
      )
      const { tagType: priorityTag, text: priorityText } = getAnnouncementPriorityAndText(
        props.data!.priority
      )
      // @ts-ignore
      return {
        ...props.data,
        typeTag,
        typeText,
        priorityTag,
        priorityText
      }
    }
  })
</script>

<style lang="scss" scoped>
  .announcementData-detail {
    min-height: 150px;
    background: $ua-edit-bg;
    color: $ua-edit-color;
    padding: 20px;
    h4 {
      margin-top: 0;
    }

    .announcementData-meta {
      margin-bottom: 15px;

      .meta-info {
        margin-top: 5px;
      }
    }

    .announcementData-content {
      border-top: 1px solid #eee;
      padding-top: 15px;
      white-space: pre-wrap;
    }
  }
</style>
