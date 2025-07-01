import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router';
import type { User } from '@/types/user'
import { DynamicRoutes, filterAuthRoutes, injectDynamicRoutes, generateMenuData } from '@/router/Dynamic';
import { fetchUser } from '@/api/use';

export const useUserStore = defineStore('user', () => {
  // 状态定义
  const useInfo = ref<User>({
    account_name: '',
    email: '',
    real_name: "",
    status: 0,
    account_group_id: "",
    account_group_name: "",
    account_id: '',
    phone: '',
  })
  const isRoutesLoaded = ref(false) // 是否已加载动态路由
  const permissions = ref<string[]>([]) // 用户权限数组
  const menuData = ref<RouteRecordRaw[]>([]) // 动态菜单数据
  const menuCollapse = ref(false) // 菜单折叠状态

  // Getter
  const userName = computed(() => useInfo.value.account_name)
  const userId = computed(() => useInfo.value.account_id)
  const userStatus = computed(() => useInfo.value.status || 0)
  // Action
  function setUser(data?: User) {
    if (data) {
      useInfo.value = { ...data }
    } else {
      useInfo.value = {
        account_name: '',
        email: '',
        real_name: "",
        status: 0,
        account_group_id: "",
        account_group_name: "",
        account_id: '',
        phone: '',
      }
    }
  }
  async function initUser() {
    try {
      // 1. 获取用户信息
      if (isRoutesLoaded.value) return Promise.resolve(useInfo.value);

      // 2. 从后端获取权限数组
      const res = await fetchUser({});
      permissions.value = (res.data?.permissions || '').split(',').filter(Boolean);
      setUser(res.data);

      // 3. 过滤并注入动态路由
      const validRoutes = filterAuthRoutes(permissions.value, DynamicRoutes);
      // const validRoutes = DynamicRoutes;
      // injectDynamicRoutes(validRoutes);

      // 4. 存储路由数据供菜单渲染
      menuData.value = generateMenuData(validRoutes);
      isRoutesLoaded.value = true;
      return Promise.resolve(useInfo.value);
    } catch (error) {
      console.error('获取用户信息失败:', error);
      isRoutesLoaded.value = true;
      return Promise.resolve(useInfo.value);
    }

  }
  async function logout() {
    localStorage.removeItem('tokenName')
    // 清空用户信息和权限
    setUser();
    // 登出时清空动态路由
    // injectDynamicRoutes([]);
    // 重置状态
    isRoutesLoaded.value = false;
    window.location.reload(); // 刷新页面
  }
  function toggleMenuCollapse() {
    menuCollapse.value = !menuCollapse.value;
  }
  function setLoading(loading: boolean) {
    isRoutesLoaded.value = !!loading;
  }
  return {
    useInfo,
    menuCollapse,
    userName,
    userId,
    isRoutesLoaded,
    permissions,
    menuData,
    userStatus,
    setUser,
    initUser,
    logout,
    toggleMenuCollapse,
    setLoading,
  }
})
