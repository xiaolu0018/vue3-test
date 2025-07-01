// 登录成功后
import { RouteRecordRaw } from 'vue-router';
import router from '@/router/index'
import { OverviewRoute } from './static-route';
export const DynamicRoutes: RouteRecordRaw[] = [
  {
    path: '/account',
    name: 'Account',
    component: () => import('@/components/Layout.vue'),
    meta: {
      title: '账号管理',
      auth: ['account.view', 'account.permission'], // 需要的权限
      icon: "bi:people",
    },
    children: [
      {
        path: 'list',
        name: 'AccountList',
        component: () => import(/* webpackChunkName: "account_list" */ '@/views/account/index.vue'),
        meta: {
          title: '账号列表',
          auth: 'account.view',
          icon: "bi:person-lines-fill",
        },
      },
      {
        path: 'permission',
        name: 'AccountPermission',
        component: () => import(/* webpackChunkName: "account_permission" */ '@/views/account/permission.vue'),
        meta: {
          title: '用户组权限配置',
          auth: 'account.permission',
          icon: "bi:shield-lock",
        },
      }
    ],
  },
  {
    path: '/announcement',
    name: 'Announcement',
    component: () => import('@/components/Layout.vue'),
    meta: {
      title: '公告管理',
      auth: ['announcement.view', 'announcement.create'], // 需要的权限
      icon: "bi:megaphone",
    },
    children: [
      {
        path: 'list',
        name: 'AnnouncementList',
        component: () => import(/* webpackChunkName: "announcement_list" */ '@/views/announcement/index.vue'),
        meta: {
          title: '公告列表',
          auth: 'announcement.view',
          icon: "bi:card-list",
        },
      },
      {
        path: 'create',
        name: 'AnnouncementCreate',
        component: () => import(/* webpackChunkName: "announcement_create" */ '@/views/announcement/create.vue'),
        meta: {
          title: '创建公告',
          auth: 'announcement.create',
          icon: "bi:plus-circle",
        },
      }
    ],
  },
  {
    path: '/key',
    name: 'Key',
    component: () => import('@/components/Layout.vue'),
    meta: {
      title: '激活管理',
      auth: ['activation.view', 'activation.generate'], // 需要的权限
      icon: "bi:key",
    },
    children: [
      {
        path: 'generate',
        name: 'KeyGenerate',
        component: () => import(/* webpackChunkName: "key_generate" */ '@/views/key/generate.vue'),
        meta: {
          title: '密钥生成',
          auth: 'activation.generate',
          icon: "bi:plus-circle",
        },
      },
      {
        path: 'list',
        name: 'KeyList',
        component: () => import(/* webpackChunkName: "key_list" */ '@/views/key/index.vue'),
        meta: {
          title: '密钥管理',
          auth: 'activation.view',
          icon: "bi:list-task",
        },
      },
    ],
  },
]
/**
 * 根据用户权限过滤动态路由
 * @param userPermissions 用户权限数组
 * @param routes 待过滤的路由配置
 */
export const filterAuthRoutes = (
  userPermissions: string[],
  routes: RouteRecordRaw[]
): RouteRecordRaw[] => {
  return routes.reduce((filtered: RouteRecordRaw[], route) => {
    const clonedRoute = { ...route }
    const routeAuth = clonedRoute.meta?.auth

    // 检查路由权限
    let hasPermission = true
    if (routeAuth) {
      if (Array.isArray(routeAuth)) {
        hasPermission = routeAuth.some(auth => userPermissions.includes(auth))
      } else {
        hasPermission = userPermissions.includes(routeAuth as string)
      }
    }

    // 递归处理子路由
    if (clonedRoute.children?.length) {
      clonedRoute.children = filterAuthRoutes(userPermissions, clonedRoute.children)

      // 子路由全部被过滤则移除父路由
      if (clonedRoute.children.length === 0) return filtered
    }

    if (hasPermission) filtered.push(clonedRoute)
    return filtered
  }, [])
}
/**
 * 动态注入路由到Home子路由
 * @param routes 过滤后的动态路由
 */
export const injectDynamicRoutes = async (routes: RouteRecordRaw[]) => {

  const homeRoute = router.getRoutes().find(r => r.name === 'Home');

  if (!homeRoute) {
    throw new Error('未找到路由');
  } else {
    // 清空旧动态路由（避免重复添加）
    homeRoute?.children.forEach(child => {
      if (child.name && child.name !== 'overview') router.removeRoute(child.name);
    });
  }

  // 添加新路由到Home子节点
  routes.forEach(route => {
    router.addRoute('Home', route);
  });

  // 确保路由更新生效（解决首次添加不跳转问题）
  if (router.currentRoute.value.name === 'Home') {
    router.replace({ ...router.currentRoute.value, replace: true });
  }

}


/**
 * 生成菜单数据（包含仪表盘+动态路由）
 * @param routes 过滤后的动态路由
 */
export const generateMenuData = (routes: RouteRecordRaw[]) => {
  return [
    OverviewRoute,
    ...routes
  ].filter(Boolean) as RouteRecordRaw[]
}
