
export interface Role {
  group_id: string
  group_name: string
  description?: string
  isDefault: boolean
  permissions: string[] // 权限id列表
}
export interface Permission {
  id: string
  name: string
}

export interface PermissionModule {
  id: string
  name: string
  icon: string
  permissions: Permission[]
}