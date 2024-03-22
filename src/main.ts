import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import router from './router'

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//时间导入 还未使用
// import filters from "@/views/caseStudy/filters";

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

//时间导入 还未使用
// filters(app)

app.use(Antd)
app.use(router)
app.use(ElementPlus)
app.mount('#app')