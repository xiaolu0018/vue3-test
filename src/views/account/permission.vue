<template>
  <div class="roles-container" v-loading="loading">
    <!-- 角色列表侧边栏 -->
    <div class="roles-sidebar">
      <div class="role-header">
        <h3 class="role-title">用户组列表</h3>
        <el-button :icon="Plus" type="primary" @click="showAddRoleModal = true">添加</el-button>
      </div>

      <div class="search-box">
        <el-input
          type="text"
          :suffix-icon="Search"
          class="form-control"
          placeholder="搜索用户组..."
          v-model="group_name"
          @change="init"
        />
      </div>

      <div class="role-list">
        <div
          class="role-item"
          :class="{ active: activeRole?.group_id === role.group_id }"
          v-for="role in filteredRoles"
          :key="role.group_id"
          @click="selectRole(role)"
        >
          <div class="role-name">{{ role.group_name }}</div>
          <div class="role-actions">
            <el-button
              title="删除"
              type="danger"
              @click.stop="deleteRole(role)"
              :disabled="role.isDefault"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 权限配置主内容 -->
    <div class="roles-content">
      <div class="role-header">
        <h3 class="role-title">
          <span>{{ activeRole?.group_name || '未选择' }}</span>
          - 权限配置
        </h3>
      </div>

      <div class="permissions-container">
        <!-- 权限模块 permissionModules-->
        <el-collapse v-model="expandedModules" class="permission-collapse">
          <el-collapse-item
            v-for="permissionMod in cacheStore.permissionModules"
            :key="permissionMod.id"
            :name="permissionMod.id"
            class="permission-module"
          >
            <template #title>
              <div class="module-header">
                <div class="module-title">
                  <Icon class="module-icon" :icon="permissionMod.icon" />
                  <span>{{ permissionMod.name }}</span>
                </div>
                <div class="module-actions" @click.stop>
                  <el-checkbox
                    :model-value="isModuleAllChecked(permissionMod)"
                    @update:model-value="
                      (val) => toggleAllPermissions(permissionMod, val as boolean)
                    "
                  >
                    全选
                  </el-checkbox>
                </div>
              </div>
            </template>
            <div class="permission-grid">
              <div
                v-for="permission in permissionMod.permissions"
                :key="permission.id"
                class="permission-item"
              >
                <el-checkbox
                  :model-value="isPermissionChecked(permission.id)"
                  @update:model-value="(val) => togglePermission(permission.id, val as boolean)"
                >
                  {{ permission.name }}
                </el-checkbox>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>

        <!-- 保存按钮 -->
        <div class="form-actions">
          <el-button type="default" @click="init">取消</el-button>
          <el-button type="primary" @click="savePermissions" :loading="loading">保存修改</el-button>
        </div>
      </div>
    </div>
    <add-permission v-model="showAddRoleModal" @refresh="init" />
  </div>
</template>

<script setup lang="ts">
  import type { Role, PermissionModule } from '@/types/role'
  import { Plus, Search, Delete } from '@element-plus/icons-vue'
  import { Icon } from '@iconify/vue'
  import { getPermissionIcon } from './optIcon'
  import AddPermission from './AddPermission.vue'
  import { deleteGroup, editGroup, getGroups } from '@/api/use'
  import { useCacheStore } from '@/store/cacheData'

  const cacheStore = useCacheStore()

  // 响应式状态
  const loading = ref(false)
  const showAddRoleModal = ref(false)
  const group_name = ref('')
  const activeRole = ref<Role | null>(null)
  const expandedModules = ref<string[]>([])

  // 角色数据
  const roles = ref<Role[]>([])

  // 计算属性 - 过滤角色
  const filteredRoles = computed(() => {
    if (!group_name.value) return roles.value
    const searchTerm = group_name.value.toLowerCase()
    return roles.value.filter((role) => role.group_name.toLowerCase().includes(searchTerm))
  })

  // 方法 - 选择角色
  const selectRole = (role: Role) => {
    activeRole.value = role
    // 初始化时展开第一个模块
    if (cacheStore.permissionModules.length > 0 && expandedModules.value.length === 0) {
      expandedModules.value = [cacheStore.permissionModules[0].id]
    }
  }

  // 方法 - 检查模块是否全选
  const isModuleAllChecked = (module: PermissionModule) => {
    if (!activeRole.value) return false
    return module.permissions.every((permission) =>
      activeRole.value!.permissions.includes(permission.id)
    )
  }

  // 方法 - 切换模块所有权限
  const toggleAllPermissions = (module: PermissionModule, checked: boolean) => {
    if (!activeRole.value) return

    const permissionIds = module.permissions.map((p) => p.id)

    if (checked) {
      // 添加所有权限
      permissionIds.forEach((id) => {
        if (!activeRole.value!.permissions.includes(id)) {
          activeRole.value!.permissions.push(id)
        }
      })
    } else {
      // 移除所有权限
      activeRole.value.permissions = activeRole.value.permissions.filter(
        (id) => !permissionIds.includes(id)
      )
    }
  }

  // 方法 - 检查权限是否选中
  const isPermissionChecked = (permissionId: string): boolean => {
    if (!activeRole.value) return false
    return activeRole.value.permissions.includes(permissionId)
  }

  // 方法 - 切换权限选中状态
  const togglePermission = (permissionId: string, checked: boolean) => {
    if (!activeRole.value) return

    if (checked) {
      if (!activeRole.value.permissions.includes(permissionId)) {
        activeRole.value.permissions.push(permissionId)
      }
    } else {
      activeRole.value.permissions = activeRole.value.permissions.filter(
        (id) => id !== permissionId
      )
    }
  }

  // 方法 - 保存权限
  const savePermissions = async () => {
    if (!activeRole.value?.group_id) {
      showNotification('请先选择一个用户组', 'warning')
      return
    }
    if (String(activeRole.value?.group_id) === '1') {
      showNotification('超级管理员权限不可修改', 'warning')
      return
    }
    await editGroup({
      group_id: activeRole.value.group_id,
      permissions: (activeRole.value.permissions || []).join(',')
    })
    init()
    showNotification('用户组权限保存成功', 'success')
  }

  // 方法 - 删除角色
  const deleteRole = async (role: Role) => {
    if (role.isDefault) return
    await ElMessageBox.confirm('是否确认删除？', '删除', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteGroup({ group_id: role.group_id })
    init()
    showNotification('删除成功', 'success')
  }

  // 方法 - 显示通知
  const showNotification = (message: string, type: 'success' | 'warning' | 'info' = 'info') => {
    ElMessage({
      message,
      type
    })
  }
  const init = async () => {
    // 获取所有角色
    try {
      loading.value = true
      const res = await getGroups({})
      roles.value = (res.data || []).reduce((t: Role[], role: any) => {
        if (role.group_id !== '1' && role.group_id !== 1) {
          role.permissions = (role.permissions || '').split(',') || []
          t.push(role)
        }
        return t
      }, [] as Role[])
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
      if (roles.value.length > 0 && !activeRole.value) {
        selectRole(roles.value[0])
      }
    }
  }
  // 初始化
  onMounted(init)
</script>

<style lang="scss" scoped>
  /* 用户组权限配置页面样式 */

  /* 角色列表样式 */
  .roles-container {
    display: flex;
    gap: 20px;
    min-height: calc(100vh - 135px);
  }

  .roles-sidebar {
    flex: 0 0 300px;
    background-color: var(--secondary-color);
    border-radius: 8px;
    padding: 15px;
    box-shadow: var(--shadow);
  }

  .roles-content {
    flex: 1;
    background-color: var(--secondary-color);
    border-radius: 8px;
    padding: 20px;
    box-shadow: var(--shadow);
  }

  .role-list {
    margin-bottom: 20px;
  }

  .role-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    margin-bottom: 8px;
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.03);
    transition: var(--transition);
    cursor: pointer;
  }

  .role-item:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  .role-item.active {
    background-color: rgba(52, 152, 219, 0.2);
    border-left: 3px solid var(--accent-color);
  }

  .role-name {
    font-weight: 500;
  }

  .role-actions {
    display: flex;
    gap: 8px;
  }

  .role-actions button {
    opacity: 0.7;
    transition: var(--transition);
  }

  .role-actions button:hover {
    opacity: 1;
  }

  .role-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .role-title {
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--accent-color);
  }

  /* 权限配置样式 */
  .permissions-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-height: calc(100% - 55px);
    position: relative;
  }

  /* 权限模块样式 */
  .permission-collapse {
    border: none;
    border-radius: 8px;
    max-height: calc(100vh - 310px);
    overflow: hidden;
    overflow-y: auto;
  }

  .permission-module {
    margin-bottom: 35px;
    background-color: var(--el-bg-color-overlay);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: var(--el-box-shadow-light);
  }

  .module-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    height: 56px;
    cursor: pointer;
  }

  .module-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
  }

  .module-icon {
    font-size: 18px;
    color: var(--el-color-primary);
  }

  .module-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .permission-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 15px;
    padding: 15px;
  }

  .permission-item {
    display: flex;
    align-items: center;
  }

  /* 表单动作按钮 */
  .form-actions {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--el-border-color);
    position: absolute;
    bottom: 0;
  }

  /* 响应式布局 */
  @media (max-width: 992px) {
    .roles-container {
      flex-direction: column;
    }

    .roles-sidebar {
      flex: none;
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    .permission-grid {
      grid-template-columns: 1fr;
    }
  }

  /* 搜索框样式 */
  .search-box {
    position: relative;
    margin-bottom: 15px;
    :deep(.el-input__wrapper) {
      background-color: rgba(255, 255, 255, 0.05);
      padding-top: 6px;
      padding-bottom: 6px;
    }
  }
</style>
