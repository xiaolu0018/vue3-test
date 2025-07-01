import type { RouteLocationNormalized } from 'vue-router';
import { APP_TITLE } from '@/utils/contant'

export function setDocumentTitle(to: RouteLocationNormalized) {
  document.title = (to?.meta?.title as string) || APP_TITLE
  // document.title = (to?.meta?.title ? (to?.meta?.title + '-') : '') + APP_TITLE
}
