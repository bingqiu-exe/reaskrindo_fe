import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Points to your router/index.js

const app = createApp(App)

app.use(router) // Registers Vue Router
app.mount('#app')