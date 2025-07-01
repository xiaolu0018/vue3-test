// 基础字段接口
export interface BaseField {
  label: string
  prop: string
  type: string
  props?: Record<string, any>
}

// 常规字段类型
export interface FormField extends BaseField {
  type: 'input' | 'select' | 'date'
  rules?: Array<{
    required?: boolean
    message: string
    trigger: 'blur' | 'change'
  }>
}

// 动态行字段类型
export interface DynamicRowField extends BaseField {
  type: 'dynamic-row'
  fields: FormField[]
}

// tag type
export type UaTagType = 'primary' | 'success' | 'warning' | 'danger' | 'info'