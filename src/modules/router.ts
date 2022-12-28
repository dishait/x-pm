import type { App } from 'vue'
import {
	createRouter,
	createWebHistory
} from 'vue-router/auto'

const router = createRouter({
	history: createWebHistory()
})

export default (app: App) => app.use(router)
