import {createApp} from 'vue'

import App from './App.vue'
import router from './router'
import store from "./store"
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import setInterceptors from "./services/setInterceptors"
import './registerServiceWorker'

setInterceptors(store)

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
