## 后台管理系统

 1. echart图标，`src\components\EchartVue`
 2. 富文本编辑器，`src\components\myEdit.vue`
 3. 代码编辑器，`src\components\cod-edit.vue`
 4. iconfy离线打包配置，`src\utils\iconfy-load.ts`

### 环境
- node v20.11.0
- npm 10.2.4
- vite@3.2.10+typescript@4.9.5+vue@3.4.21+element-plus@^2.10.2+pinia@2.1.7

#### 安装依赖

npm install

#### 开发环境

* npm run dev 启动服务
* `vue, @vueuse/core, vue-router` 自动导入和类型全局声明
* `element-plus` 组件按需自动导入和类型全局声明，
* `element-plus` 暗黑模式配置，`src\style\element.scss`
* `scss` 变量全局声明，`src\style\variables.scss`

#### 生产打包

npm run build

### 打包配置

gzip+去除console.log
