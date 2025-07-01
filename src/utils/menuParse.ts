import type { AppRouteRecordRaw, MenuItem } from '@/types/menu'

export function generateMenu(routes: AppRouteRecordRaw[]): MenuItem[] {
  const route = (routes || []).find(ite => ite.name === 'Home')
  return (route?.children || []).reduce<MenuItem[]>((acc, route) => {
    if (route.meta?.hidden) return acc
    const menuItem: MenuItem = {
      path: route.path,
      name: route.name!.toString(),
      meta: { title: route.meta?.title || route.name!.toString() || '', ...route.meta },
    }
    acc.push(menuItem)
    return acc
  }, [])
}

