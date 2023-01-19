import 'modern-css-reset'

import 'uno.css'

import { createApp } from 'vue'
import App from './App.vue'
import './assets/global.css'

const app = createApp(App)

app.mount('#app').$nextTick(() => {
	postMessage({ payload: 'removeLoading' }, '*')
})
