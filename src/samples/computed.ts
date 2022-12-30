import type { Tabs } from '../types'
import type { TableData } from '@arco-design/web-vue'
import { readdir, resolve, existsSync } from './node-api'
import type {
	RemovableRef,
	AsyncComputedOnCancel
} from '@vueuse/core'

const _types = [
	{
		type: 'node',
		files: ['package.json']
	},
	{
		type: 'deno',
		files: ['mod.ts', 'deno.jsonc', 'deno.json']
	},
	{
		type: 'go',
		files: ['go.mod', 'main.go']
	}
]

export function computedProjects(tabs: RemovableRef<Tabs>) {
	const cachedProjects = ref<TableData[][]>([])

	const refreshRef = ref(true)

	async function showProjects(
		onCancel: AsyncComputedOnCancel
	) {
		try {
			if (!refreshRef.value) {
				return cachedProjects.value
			}

			const keys: string[] = []
			const promises = tabs.value.map(tab => {
				keys.push(tab.key)
				return readdir(tab.key, {
					withFileTypes: true
				})
			})
			const projectDirs = await Promise.all(promises)

			cachedProjects.value = projectDirs.map(
				(dir, index) => {
					const key = keys[index]
					return dir
						.filter(p => p.isDirectory())
						.map(p => {
							const name = p.name
							const types: string[] = []
							const path = resolve(key, name)

							_types.forEach(t => {
								const exists = t.files.some(file => {
									return existsSync(resolve(path, file))
								})

								if (exists) {
									types.push(t.type)
								}
							})

							function isUnknown() {
								return types.length === 0
							}

							if (isUnknown()) {
								types.push('unknown')
							}

							return {
								name,
								path,
								types
							}
						})
				}
			)
			return cachedProjects.value
		} catch (error) {
			onCancel(() => {
				refreshRef.value = true
			})
			return cachedProjects.value
		} finally {
			refreshRef.value = false
		}
	}

	const evaluating = ref(false)

	const projects = computedAsync<TableData[][]>(
		showProjects,
		[],
		{ lazy: true, evaluating }
	)

	const projectsTotal = computed(() => {
		if (refreshRef.value) {
			return 0
		}
		return projects.value.flat().length
	})

	function refresh() {
		refreshRef.value = true
	}

	return {
		refresh,
		projects,
		evaluating,
		projectsTotal
	}
}
