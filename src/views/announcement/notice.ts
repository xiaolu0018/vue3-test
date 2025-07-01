
import type { UaTagType } from '@/types/dyForm'
export interface Announcement {
  id: string;
  title: string;
  notice_type: string;
  publisher: string;
  publish_time: string;
  status: number;
  priority?: number;
  content: string;
  publish_option?: string[];
  servers?: string[];
  expire_time?: string;
  created_at?: string;
  server_range?: string[];
  [kye: string]: any
}

export type AnnouncementDetail = Announcement & {
  typeTag?: UaTagType
  typeText?: string
  priorityTag?: UaTagType
  priorityText?: string
}


export const announcementTemplates = [
  {
    id: 1,
    title: '维护公告模板',
    description: '用于发布游戏服务器维护的公告模板'
  },
  {
    id: 2,
    title: '版本更新公告模板',
    description: '用于发布游戏版本更新的公告模板'
  },
  {
    id: 3,
    title: '活动公告模板',
    description: '用于发布游戏活动的公告模板'
  },
  {
    id: 4,
    title: '新服开启公告模板',
    description: '用于发布新服务器开启的公告模板'
  }
];

