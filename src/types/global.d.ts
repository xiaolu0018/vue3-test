// 全局表单校验规则
declare global {
  interface Rule {
    validator: (rule: any, value: any) => Promise<boolean> | boolean
  }
}

// 扩展 Vue 类型
import { DefineComponent } from 'vue'

declare module 'vue' {
  interface GlobalComponents {
    DynamicForm: DefineComponent<{
      formConfig: Array<import('./dyForm').FormField | import('./dyForm').DynamicRowField>
      // initialData: Record<string, any>
    }>
  }
}

declare module 'path-browserify' {
  const path: {
    join(...paths: string[]): string;
    resolve(...paths: string[]): string;
    dirname(path: string): string;
    basename(path: string, ext?: string): string;
    extname(path: string): string;
    // Add other methods as needed
  };
  export default path;
}