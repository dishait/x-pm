export const LoadingText = defineComponent({
	setup() {
		return () => <div>loading...</div>
	}
})

export const LoadingTextVNode = h(LoadingText)
