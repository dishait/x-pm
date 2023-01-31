import { isDark } from 'vue-dark-switch'
import { UnPromiseReturnType } from 'm-type-tools'

export async function useDiscreteApi() {
	const [
		{ createDiscreteApi },
		{ messageDark, messageLight },
		{ loadingBarDark, loadingBarLight }
	] = await Promise.all([
		import('naive-ui/es/discrete'),
		import('naive-ui/es/message/styles'),
		import('naive-ui/es/loading-bar/styles')
	])

	const messageProviderProps = computed(() => {
		const themeOverrides = isDark.value
			? messageDark
			: messageLight

		return {
			themeOverrides
		}
	})

	const loadingBarProviderProps = computed(() => {
		const themeOverrides = isDark.value
			? loadingBarDark
			: loadingBarLight

		return {
			themeOverrides
		}
	})

	const { message, loadingBar } = createDiscreteApi(
		['message', 'loadingBar'],
		{
			messageProviderProps,
			loadingBarProviderProps
		}
	)
	return {
		message,
		loadingBar
	}
}

export let message: UnPromiseReturnType<
	typeof useDiscreteApi
>['message']
export let loadingBar: UnPromiseReturnType<
	typeof useDiscreteApi
>['loadingBar']

useDiscreteApi().then(api => {
	message = api.message
	loadingBar = api.loadingBar
})
