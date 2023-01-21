import type { Tabs } from '../types'
import { isNumber } from 'm-type-tools'

export function useTabs() {
	let tabs = $(useStorage<Tabs>('tabs', []))

	let tabPaths = $computed(() => tabs.map(tab => tab.path))

	let currentTab = $(
		useStorage('currentTab', tabs.at(0)?.path ?? 'Empty')
	)

	function handleTabsClose(path: string | number) {
		if (isNumber(path)) {
			return tabs.splice(path, 1)
		}
		tabs = tabs.filter(t => t.path !== path)
	}

	watchArray(
		$$(tabs),
		(newTabs, _, added, removed) => {
			if (currentTab === 'Search') {
				return
			}
			const shouldMove =
				Boolean(added.length) || Boolean(removed.length)

			if (shouldMove) {
				currentTab = newTabs.at(-1)?.path ?? 'Empty'
			}
		},
		{
			flush: 'post'
		}
	)

	return $$({
		tabs,
		tabPaths,
		currentTab,
		handleTabsClose
	})
}
