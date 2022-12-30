import type { Tabs } from '../types'
import type { TableData } from '@arco-design/web-vue'
import { readdir, resolve, existsSync } from './node-api'
import type {
	RemovableRef,
	AsyncComputedOnCancel
} from '@vueuse/core'

type Modified =
	| {
			type: 'reload'
	  }
	| {
			type: 'delete'
			index: number
	  }
	| {
			type: 'add'
			tabs: Tabs
	  }

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

async function showProjects(tabs: Tabs) {
	const paths: string[] = []
	const readdirs = tabs.map(tab => {
		paths.push(tab.key)
		return readdir(tab.key, { withFileTypes: true })
	})

	const dirs = await Promise.all(readdirs)

	return dirs.map((dir, index) => {
		const root = paths[index]
		return dir
			.filter(p => p.isDirectory())
			.map(p => {
				const name = p.name
				const types: string[] = []
				const path = resolve(root, name)

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
	})
}

export function computedProjects(tabs: RemovableRef<Tabs>) {
	const lastTotal = ref(0)
	const refreshRef = ref(true)
	const evaluating = ref(false)
	let modified: Modified = { type: 'reload' }
	const lastProjects = ref<TableData[][]>([])

	async function normalize(
		onCancel: AsyncComputedOnCancel
	) {
		try {
			if (!refreshRef.value) {
				return lastProjects.value
			}

			if (modified.type === 'delete') {
				const splicedProjects = lastProjects.value.splice(
					modified.index,
					1
				)
				lastTotal.value -= splicedProjects.flat().length
				return lastProjects.value
			}

			if (modified.type === 'add') {
				const newProjects = await showProjects(
					modified.tabs
				)
				lastTotal.value += newProjects.flat().length

				lastProjects.value.push(...newProjects)
				return lastProjects.value
			}

			if (modified.type === 'reload') {
				const newProjects = await showProjects(tabs.value)
				lastTotal.value = newProjects.flat().length
				lastProjects.value = newProjects
				return lastProjects.value
			}

			return lastProjects.value
		} catch (error) {
			onCancel(() => {
				refreshRef.value = true
			})
			return lastProjects.value
		} finally {
			refreshRef.value = false
			modified = { type: 'reload' }
		}
	}

	const projects = computedAsync<TableData[][]>(
		normalize,
		[],
		{ lazy: true, evaluating }
	)

	const total = computed(() => {
		if (refreshRef.value && modified.type === 'reload') {
			return 0
		}
		return lastTotal.value
	})

	function refresh(
		_modified: Modified = { type: 'reload' }
	) {
		refreshRef.value = true
		modified = _modified
	}

	return {
		total,
		refresh,
		projects,
		evaluating
	}
}
