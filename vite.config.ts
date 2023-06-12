import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte()],
    server: {
        proxy: {
            '/api': {
                target: 'https://vuta-music.boon4681.com/',
                changeOrigin: true
            },
            '/donate': {
                target: 'https://vuta-music.boon4681.com/',
                changeOrigin: true
            }
        }
    }
})
