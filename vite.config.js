import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import Components from 'unplugin-vue-components/vite'
// import { VantResolver } from 'unplugin-vue-components/resolvers' // 暂时不使用，因为已在 main.js 中手动注册所有 Vant 组件
import AutoImport from 'unplugin-auto-import/vite'
import viteCompression from 'vite-plugin-compression'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const isProduction = mode === 'production'

  return {
    base: './',
    plugins: [
      vue(),
      // 自动导入组件（主要用于自定义组件，Vant 组件已在 main.js 中手动注册）
      Components({
        // 暂时禁用 VantResolver，因为所有 Vant 组件已在 main.js 中手动注册
        // 如果需要自动导入其他组件库，可以在这里添加其他 resolvers
        // resolvers: [VantResolver()],
        dts: false, // 暂时不使用 TypeScript，设为 false
        // 排除所有 Vant 组件，避免自动导入冲突
        exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.vite[\\/]/, /van-/i, /^Van/]
      }),
      // 自动导入Vue组合式API
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia'
        ],
        dts: false, // 暂时不使用 TypeScript，设为 false
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json'
        }
      }),
      // 生产环境压缩
      isProduction &&
        viteCompression({
          verbose: true,
          disable: false,
          threshold: 10240, // 只压缩大于 10KB 的文件
          algorithm: 'gzip',
          ext: '.gz'
        })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@base': resolve(__dirname, 'src/components/base'),
        '@business': resolve(__dirname, 'src/components/business'),
        '@layout': resolve(__dirname, 'src/layouts')
      },
      extensions: ['.js', '.vue', '.json']
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_APP_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      chunkSizeWarningLimit: 2000,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'vant': ['vant'],
            'utils': ['axios']
          },
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]'
        }
      },
      // 生产环境移除 console 和 debugger
      minify: isProduction ? 'terser' : false,
      terserOptions: isProduction
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true
            }
          }
        : {}
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 全局注入变量和mixins
          // 使用 @use 替代 @import 以避免弃用警告
          // 注意：additionalData 中使用 @use 是安全的，不会产生警告
          additionalData: `@use "@/assets/styles/variables.scss" as *; @use "@/assets/styles/mixins.scss" as *;`
        }
      }
    },
    optimizeDeps: {
      include: ['vant'],
      exclude: ['vue-demi']
    }
  }
})

