import { NTag, NSpace } from 'naive-ui'

const TYPES = {
	go: 'info',
	node: 'success',
	deno: 'warning',
	unknown: 'default'
} as const

interface IProps {
	tags: Array<keyof typeof TYPES>
}

export default defineComponent({
	props: ['tags'],
	setup(props: IProps) {
		return () => (
			<NSpace justify="center">
				{props.tags?.map(tag => {
					return (
						<NTag bordered={false} type={TYPES[tag]}>
							{tag}
						</NTag>
					)
				})}
			</NSpace>
		)
	}
})
