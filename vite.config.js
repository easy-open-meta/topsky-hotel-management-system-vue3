import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      vue(),
     Components({
       resolvers: [
         AntDesignVueResolver({
           resolveIcons: true,
           importStyle: 'less',
         })
       ],
       dts: true,
     })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: mode === 'development' ? env.VITE_API_DEV_URL : env.VITE_API_PROD_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
   css: {
     preprocessorOptions: {
       less: {
         modifyVars: {
           'primary-color': '#1890ff',
         },
         javascriptEnabled: true,
       }
     }
   }
  };
});