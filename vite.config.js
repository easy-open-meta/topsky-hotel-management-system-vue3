import { defineConfig, loadEnv } from 'vite';
import commonjs from 'vite-plugin-commonjs';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      vue(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            resolveIcons: true,
            importStyle: false,
            cjs: false,
          })
        ],
        dts: true,
        include: [/\.vue$/, /\.vue\?vue/] 
      }),
      commonjs({
        filter: (id) => {
          return id.includes('node_modules/dayjs');
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'ant-design-vue/es': 'ant-design-vue/es',
        'dayjs/plugin/advancedFormat': path.resolve(__dirname, 'node_modules/dayjs/plugin/advancedFormat.js'),
        'dayjs/plugin/customParseFormat': path.resolve(__dirname, 'node_modules/dayjs/plugin/customParseFormat.js')
      }
    },
    optimizeDeps: {
      exclude: [
        'ant-design-vue/es',
        'dayjs/plugin/advancedFormat',
      ],
      include: ['lodash-es']
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            'primary-color': '#1890ff',
            'border-radius-base': '4px'
          },
          javascriptEnabled: true,
          additionalData: `@import "${path.resolve(__dirname, 'src/styles/antd.less')}";`
        }
      }
    },
    server: {
      proxy: {
        '/api': {
          target: mode === 'development' 
            ? env.VITE_API_DEV_URL 
            : env.VITE_API_PROD_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    }
  };
});