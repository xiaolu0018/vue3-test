import { RouteRecordRaw } from 'vue-router';
import Home from '../views/home.vue';
import { DynamicRoutes } from '@/router/Dynamic';

export const NO_CHECK_LOGIN = ['login', 'register', '404', '403'];


export const OverviewRoute: RouteRecordRaw = {
  path: '/overview',
  name: 'overview',
  meta: {
    title: '仪表盘',
    icon: 'bi:speedometer2',
    noAuth: true,
  },
  component: () => import(/* webpackChunkName: "overview" */ '../views/overview/index.vue'),
}



export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/overview',
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      OverviewRoute,
      ...DynamicRoutes
    ],
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      noAuth: true,
    },
    component: () => import(/* webpackChunkName: "login" */ '../views/pages/login.vue'),
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      title: '注册',
      noAuth: true,
    },
    component: () => import(/* webpackChunkName: "register" */ '../views/pages/register.vue'),
  },
  {
    path: '/403',
    name: '403',
    meta: {
      title: '没有权限',
      noAuth: true,
    },
    component: () => import(/* webpackChunkName: "403" */ '../views/pages/403.vue'),
  },
  {
    path: '/404',
    name: '404',
    meta: {
      title: '找不到页面',
      noAuth: true,
    },
    component: () => import(/* webpackChunkName: "404" */ '../views/pages/404.vue'),
  },
  { path: '/:path(.*)', redirect: '/404' },
]

