import { createApp } from 'vue';
import { createPinia } from 'pinia';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import router from './router';
// import 'element-plus/dist/index.css';
// import './assets/css/icon.css';
import '@/style/var.css'
import '@/style/common.scss'
import '@/style/element-global.scss'
import '@/style/global.scss'
import 'element-plus/es/components/message/style/css'; // 全局导入el-message样式
import 'element-plus/es/components/notification/style/css'; // 全局导入el-notification样式
import 'element-plus/es/components/message-box/style/css'; // 全局导入el-message-box样式
import 'element-plus/es/components/loading/style/css'; // 全局导入el-loading样式

// 图标已在 iconfy-load.ts 中统一配置
import { loadIcons } from '@/utils/iconfy-load'

import { vPermission } from '@/directives/permission'

// import { createTerminal } from 'vue-web-terminal'

const app = createApp(App);
app.use(createPinia());
app.use(router);
// app.use(createTerminal());

// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

loadIcons()

app.directive('permission', vPermission)

app.mount('#app');
