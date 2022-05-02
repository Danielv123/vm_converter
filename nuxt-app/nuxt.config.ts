import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  hooks: {
    "builder:watch": console.log,
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
  ssr: false, // Made things harder to debug
  css: ['ant-design-vue/dist/antd.dark.css'],
});
