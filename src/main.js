import {createApp} from 'vue'
import App from '@/App.vue'
import router from '@/router'
import '@/assets/main.css'
import store from '@/store'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(ElementPlus, {
    locale: zhCn
})
app.mount('#app')
