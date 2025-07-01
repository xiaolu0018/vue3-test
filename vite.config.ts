
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

// import vueDevTools from 'vite-plugin-vue-devtools'
// import dynamicImport from 'vite-plugin-dynamic-import';
import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
// import { FileSystemIconLoader } from 'unplugin-icons/loaders';

import eslintPlugin from 'vite-plugin-eslint';
// import ElementPlus from 'unplugin-element-plus/vite'

import viteCompression from 'vite-plugin-compression'; // gzip

const pathSrc = path.resolve(__dirname, 'src')


export default defineConfig({
  base: './',
  plugins: [
    vue(),
    // vueDevTools(),
    VueSetupExtend(),
    // dynamicImport(),
    AutoImport({
      imports: ['vue', '@vueuse/core', 'vue-router'],
      dirs: [path.resolve(pathSrc, 'composables')],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass' // 必须启用 SASS 模式[1,5](@ref)
        }),
        // Auto import icon components
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon',
        })
      ],
      dts: 'src/auto-imports.d.ts', // 确保生成类型声明文件（默认路径为根目录/auto-imports.d.ts）
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json'
      }
    }),
    Components({
      resolvers: [
        // Auto register icon components
        IconsResolver({
          prefix: 'icon',
          enabledCollections: ['bi'],
          // customCollections: ['my-icons']
        }),
        ElementPlusResolver({
          importStyle: 'sass' // 必须同步配置[5,8](@ref)
        })
      ],
      dts: path.resolve(pathSrc, 'types', 'components.d.ts'),
    }),
    eslintPlugin({
      include: ['src/​**​/*.ts', 'src/​**​/*.vue', 'src/**/*.tsx'], // 实时检查范围[6](@ref)
      fix: true, // 自动修复可修复的问题
      cache: false,
      failOnWarning: false,
      failOnError: false,
    }),
    Icons({
      autoInstall: true,
      compiler: 'vue3',
      // customCollections: {
      //   'my-icons': FileSystemIconLoader(
      //     './src/assets/icons',
      //     svg => svg.replace(/^<svg /, '<svg fill="currentColor" ') // 关键预处理
      //   )
      // }
    }),
    // ElementPlus({
    //   useSource: true
    // }),
    viteCompression({
      algorithm: 'gzip', // 可选 Brotli（algorithm: 'brotliCompress'）
      threshold: 10240, // 仅压缩 >10KB 的文件
      deleteOriginFile: false, // 保留源文件
    }),
  ],
  // assetsInclude: ['**/*.json'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~': '/src/assets',
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/style/element.scss" as element;
          @use "@/style/variables.scss" as *;
          @use "@/style/mixin.scss" as *;
        `,
        // @use "@/style/global.scss" as *;
        silenceDeprecations: ['legacy-js-api', 'global-builtin']
      }
    },
  },
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true",
    __VUE_PROD_DEVTOOLS__: true
  },
  server: {
    port: 6655,
    proxy: {
      '/api': {
        // target: 'https://192.168.199.79:8091',
        // target: 'https://192.168.199.16:8091',
        target: 'https://162.14.68.246:8091',
        // target: 'https://127.0.0.1:8091',
        // rewrite: (path) => path.replace(/^\/api/, '')
        changeOrigin: true,
        secure: false, // 跳过证书验证
      },
    },
    hmr: {
      overlay: false
    },
    host: '0.0.0.0',
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'keys/server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'keys/server.crt')),
    }
  },
  build: {
    commonjsOptions: {
      // 关键：解决JSON解析兼容问题
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@iconify/icons-bi')) {
            return 'bi-icons'; // 合并所有图标到单个chunk
          }
        }
      }
    },
    minify: 'esbuild', // 使用 esbuild 进行压缩
    reportCompressedSize: true, // 显示压缩后体积（可选）
  },
  optimizeDeps: {
    include: [
      "element-plus/es",
      "element-plus/es/components/tabs/style/index",
      "element-plus/es/components/dropdown/style/index",
      "element-plus/es/components/dropdown-menu/style/index",
      'element-plus/es/components/dropdown-item/style/index',
      'element-plus/es/components/icon/style/index',
      'element-plus/es/components/avatar/style/index',
      "element-plus/es/components/menu/style/index",
      "element-plus/es/components/menu-item/style/index",
      "element-plus/es/components/footer/style/index",
      "element-plus/es/components/container/style/index",
      "element-plus/es/components/main/style/index",
      "element-plus/es/components/aside/style/index",
      "element-plus/es/components/tab-pane/style/index",
      "element-plus/es/components/divider/style/index",
      "element-plus/es/components/header/style/index",
      "element-plus/es/components/tag/style/index",
      "element-plus/es/components/button/style/index",
      "element-plus/es/components/input/style/index",
      "element-plus/es/components/message/style/index",
      "element-plus/es/components/space/style/index",
      "element-plus/es/components/dialog/style/index",
      "element-plus/es/components/form/style/index",
      "element-plus/es/components/form-item/style/index",
      "element-plus/es/components/table/style/index",
      "element-plus/es/components/table-column/style/index",
      "element-plus/es/components/loading/style/index",
      "element-plus/es/components/tree/style/index",
      "element-plus/es/components/input-number/style/index",
      "element-plus/es/components/select/style/index",
      "element-plus/es/components/option/style/index",
      "element-plus/es/components/upload/style/index",
      "element-plus/es/components/checkbox/style/index"
    ],
    esbuildOptions: {
      drop: ['console', 'debugger'], // 移除 console 和 debugger
      pure: ['console.log', 'console.warn'], // 标记纯函数（可选）
    }
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    pure: process.env.NODE_ENV === 'production' ? ['console.log', 'console.warn', 'console.error'] : [],
  }, // 生产环境移除 console 和 debugger
});
