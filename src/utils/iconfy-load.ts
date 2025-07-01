import { addIcon } from '@iconify/vue';
// 所有在项目中使用的 Bootstrap Icons 图标列表
const iconsToLoad = {
  // 原有图标
  "save": () => import('@iconify/icons-bi/save'),
  "send": () => import('@iconify/icons-bi/send'),
  "eye": () => import('@iconify/icons-bi/eye'),
  "lightbulb": () => import('@iconify/icons-bi/lightbulb'),
  "clock-history": () => import('@iconify/icons-bi/clock-history'),
  "gear": () => import('@iconify/icons-bi/gear'),
  "building": () => import('@iconify/icons-bi/building'),
  "calendar-range": () => import('@iconify/icons-bi/calendar-range'),
  "clock": () => import('@iconify/icons-bi/clock'),
  "check-circle": () => import('@iconify/icons-bi/check-circle'),
  "megaphone": () => import('@iconify/icons-bi/megaphone'),
  "person-plus": () => import('@iconify/icons-bi/person-plus'),
  "shield-exclamation": () => import('@iconify/icons-bi/shield-exclamation'),
  "exclamation-triangle": () => import('@iconify/icons-bi/exclamation-triangle'),

  // 路由中使用的图标
  "speedometer2": () => import('@iconify/icons-bi/speedometer2'),
  "people": () => import('@iconify/icons-bi/people'),
  "person-lines-fill": () => import('@iconify/icons-bi/person-lines-fill'),
  "shield-lock": () => import('@iconify/icons-bi/shield-lock'),
  "person-badge": () => import('@iconify/icons-bi/person-badge'),
  "person-vcard": () => import('@iconify/icons-bi/person-vcard'),
  "card-list": () => import('@iconify/icons-bi/card-list'),
  "plus-circle": () => import('@iconify/icons-bi/plus-circle'),
  "key": () => import('@iconify/icons-bi/key'),
  "list-task": () => import('@iconify/icons-bi/list-task'),

  // 注释部分包含的图标
  "person-slash": () => import('@iconify/icons-bi/person-slash'),
  "person-check": () => import('@iconify/icons-bi/person-check'),
  "mic-mute": () => import('@iconify/icons-bi/mic-mute'),
  "door-closed": () => import('@iconify/icons-bi/door-closed'),

  // 新增从搜索结果中提取的图标
  "gear-fill": () => import('@iconify/icons-bi/gear-fill'),
  "server": () => import('@iconify/icons-bi/server'),
  "pencil-square": () => import('@iconify/icons-bi/pencil-square'),
  "trash": () => import('@iconify/icons-bi/trash'),
  "check-lg": () => import('@iconify/icons-bi/check-lg'),
  "person-dash": () => import('@iconify/icons-bi/person-dash'),
  "envelope": () => import('@iconify/icons-bi/envelope'),
  "trophy": () => import('@iconify/icons-bi/trophy'),
  "layout-text-window-reverse": () => import('@iconify/icons-bi/layout-text-window-reverse'),
  "journal-text": () => import('@iconify/icons-bi/journal-text'),
  "people-fill": () => import('@iconify/icons-bi/people-fill'),
  "person-check-fill": () => import('@iconify/icons-bi/person-check-fill'),
  "activity": () => import('@iconify/icons-bi/activity'),
  "graph-up": () => import('@iconify/icons-bi/graph-up'),
  "tools": () => import('@iconify/icons-bi/tools'),
  "gift": () => import('@iconify/icons-bi/gift'),
  "info-circle": () => import('@iconify/icons-bi/info-circle'),
  "calendar-event": () => import('@iconify/icons-bi/calendar-event'),
};



// export default () => {
//   // 添加图标集合
//   addCollection({
//     prefix: 'bi',
//     icons: data.reduce((t, item) => {
//       return {
//         ...t,
//         [item]: (bootstrapIcons as any)[item] as { body: string }
//       }
//     }, {})
//   });
// }

// 使用动态导入，避免整包打包
export const loadIcons = async () => {
  const loadPromises: Promise<void>[] = [];
  Object.entries(iconsToLoad).forEach(([name, loader]) => {
    if (!loader) {
      console.warn(`[Icon Loader] Icon "${name}" not found in map`);
      return;
    }
    const loadPromise = loader()
      .then(module => {
        addIcon(`bi:${name}`, module.default);
      })
      .catch(err => {
        console.error(`[Icon Loader] Failed to load bi:${name}`, err);
      });

    loadPromises.push(loadPromise);
  });
  await Promise.all(loadPromises); // 等待所有图标加载完成
};