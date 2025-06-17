import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import VitePluginVueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig(() => {
    return {
        plugins: [
            vue(),
            VitePluginVueDevTools(),
            Components({
                resolvers: [PrimeVueResolver()]
            })
        ],
        // plugins: [vue()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        server: {
            port: 1072
        }
    };
});
