// import { createApp } from 'vue'
// import App from './App.vue'

// import './style.css'

// createApp(App).mount('#app')

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './style.css'

createApp(App)
  .use(router)
  .mount('#app')