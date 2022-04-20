import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueSocketIO from 'vue-3-socket.io'
import SocketIO from "socket.io-client"
import {baseURL} from "@/config/baseConfig";
import store from './store/index'

const app = createApp(App)

app.use(ElementPlus)
app.use(
  new VueSocketIO({
    debug: true,
    connection: SocketIO(baseURL + 'chat'),
      transports: ['websocket','polling'],
  })
)
app.use(store)
app.mount('#app')
