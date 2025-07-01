import type { Directive, DirectiveBinding } from 'vue';
import { useUserStore } from '@/store/user'; // 用户状态管理


/**
 * 检查元素权限的指令处理函数
 *
 * @param el - 绑定的HTML元素
 * @param binding - Vue指令绑定对象，包含value(权限字符串)、modifiers(修饰符)和arg(参数)
 * @remarks
 * - 根据用户权限与指令值比较，决定是否显示/移除元素
 * - 支持通过修饰符控制处理方式：
 *   - .css: 使用CSS隐藏元素而非直接移除
 *   - disable/tooltip参数: 分别添加禁用类或提示文本
 *   - 例如：v-permission:disable.css="'player:export'"
 * - 权限格式为逗号分隔的字符串，满足任一权限即显示
 */
const checkPermission = (el: HTMLElement, binding: DirectiveBinding<string>) => {
  const userStore = useUserStore()
  const userPermissions = userStore.permissions
  const requiredPermissions = binding.value.split(',').map(p => p.trim())
  const hasPermission = binding.value.length && requiredPermissions.length ? requiredPermissions.some(perm =>
    userPermissions.includes(perm)
  ) : true;

  if (!hasPermission) {
    if (binding.modifiers.css) {
      el.title = '无权限'
      switch (binding.arg) {
        case 'disable':
          el.classList.add('disabled', 'is-disabled');
          break;
        case 'tooltip':
          // el.title = '无权限';
          break;
        default:
          el.style.display = 'none'
        // el.style.display = 'none';
      }
    } else {
      el.parentNode?.removeChild(el)
    }
  }
}

// 指令定义
export const vPermission: Directive = {
  mounted: checkPermission,
  updated: checkPermission // 响应权限变化
}
