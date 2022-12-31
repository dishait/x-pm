import { defineAsyncComponent } from 'vue'

const parallel = Promise.all.bind(Promise)

export const lazyUseNotification = createSharedComposable(
	async () => {
		const [{ default: Notification }] = await parallel([
			import('@arco-design/web-vue/es/notification'),
			import(
				// @ts-ignore
				'@arco-design/web-vue/es/notification/style/css.js'
			)
		])
		return Notification
	}
)

export const lazyUseModal = createSharedComposable(
	async () => {
		const [{ default: Modal }] = await parallel([
			import('@arco-design/web-vue/es/modal'),
			import(
				// @ts-ignore
				'@arco-design/web-vue/es/modal/style/css.js'
			)
		])
		return Modal
	}
)

export const LazyTable = defineAsyncComponent(
	() => import('../components/Table.vue')
)

export const LazySwitchDarkIcon = defineAsyncComponent(
	async () => {
		const [{ isDark, SwitchIcon }] = await parallel([
			import('vue-dark-switch'),
			import(
				// @ts-ignore
				'vue-dark-switch/dist/style.css'
			)
		])

		watchEffect(() => {
			if (isDark.value) {
				document.body.setAttribute('arco-theme', 'dark')
			} else {
				document.body.removeAttribute('arco-theme')
			}
		})

		return SwitchIcon
	}
)
