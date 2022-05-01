// vite.config.js
import Components from 'unplugin-vue-components/vite'
import {
  AntDesignVueResolver,
} from 'unplugin-vue-components/resolvers'

// your plugin installation
Components({
  resolvers: [
    AntDesignVueResolver(),
  ],
})
