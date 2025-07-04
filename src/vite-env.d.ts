/// <reference types="vite/client" />



declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-schart';
declare module 'nprogress'

declare module 'json-bigint';
