import type { App } from 'vue'
import {
	createRouter,
	createWebHashHistory
} from 'vue-router/auto'

const router = createRouter({
	history: createWebHashHistory()
})

export default (app: App) => app.use(router)
