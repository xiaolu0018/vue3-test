import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { setDocumentTitle } from './title'
import { NO_CHECK_LOGIN, staticRoutes } from './static-route';
import { useUserStore } from '@/store/user';

const router = createRouter({
  history: createWebHashHistory(),
  routes: staticRoutes,
});
// 重置路由
export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHashHistory(),
    routes: staticRoutes,
  });
  // @ts-ignore
  router.matcher = newRouter.matcher // 关键：替换匹配器
}
router.beforeEach(async (to, _, next) => {
  try {
    NProgress.start();
    // next();
    // preint
    const userStore = useUserStore();
    await useUserStore().initUser();
    setDocumentTitle(to);
    const token = localStorage.getItem('tokenName')
    // console.log('route fetch user = ', userStore)
    // @ts-ignore
    const user = token && (userStore.userName || userStore.userId || null);
    if (to.name && NO_CHECK_LOGIN.includes(to.name as string)) {
      if (to.name === 'login' && !!user) {
        next('/');
      } else {
        next();
      }
    } else {
      if (!!user) {
        if (!userStore.userStatus) {
          ElMessage.warning('账号被禁用！')
          userStore.logout()
          next('/login')
        } else {
          if (to.meta?.noAuth) return next();
          // 权限校验逻辑
          const routeAuth = to.meta?.auth;
          if (routeAuth) {
            const requiredAuths = Array.isArray(routeAuth) ? routeAuth : [routeAuth];
            const hasPermission = requiredAuths.some(auth =>
              userStore.permissions.includes(auth)
            );
            if (!hasPermission) {
              next('/403');
            } else {
              next()
            }
          }
        }

      } else {
        next('/login');
      }
    }


  } catch (error) {
    console.error('router error:', error);
    next();
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
