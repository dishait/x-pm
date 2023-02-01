import { rmSync } from 'node:fs'
import Unocss from 'unocss/vite'
import pkg from './package.json'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { outputFile } from 'fs-extra'
import { inferVersion } from 'go-get-folder-size'
import { createFsComputedWithStream } from 'file-computed'

import Electron from 'vite-plugin-electron'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { readFile } from 'node:fs/promises'
import Removelog from 'vite-plugin-removelog'
import AutoImport from 'unplugin-auto-import/vite'
import { HtmlPolyfill } from 'vue-dark-switch/vite'
import Renderer from 'vite-plugin-electron-renderer'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

const fsComputed = createFsComputedWithStream()

fsComputed(
	[
		'bin',
		'package.json',
		'pnpm-lock.yaml',
		'vite.config.ts'
	],
	async function () {
		rmSync('dist-electron', {
			recursive: true,
			force: true
		})

		const version = inferVersion()
		const name = `go-get-folder-size${
			version.startsWith('windows') ? '.exe' : ''
		}`
		const bin = resolve(
			`node_modules/go-get-folder-size/dist`,
			`go-get-folder-size_${version}/${name}`
		)

		await outputFile(`bin/${name}`, await readFile(bin))
	}
)

const isDevelopment =
	process.env.NODE_ENV === 'development' ||
	!!process.env.VSCODE_DEBUG
const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
	define: {
		__VUE_OPTIONS_API__: false // 明确不使用 options api
	},
	plugins: [
		HtmlPolyfill(),
		Removelog(),
		Vue({
			reactivityTransform: true // 开启响应式语法糖
		}),
		VueJsx(),
		Unocss(),
		AutoImport({
			dirs: ['src/composables'],
			dts: './types/auto-imports.d.ts',
			imports: [
				'vue',
				'@vueuse/core',
				{
					'naive-ui': [
						'useDialog',
						'useMessage',
						'useLoadingBar',
						'useNotification',
						'createDiscreteApi'
					]
				}
			]
		}),
		Components({
			directoryAsNamespace: true,
			resolvers: [NaiveUiResolver()],
			dts: './types/components.d.ts'
		}),
		Electron([
			{
				entry: 'electron/main/index.ts',
				onstart(options) {
					if (process.env.VSCODE_DEBUG) {
						console.log('[startup] Electron App')
					} else {
						options.startup()
					}
				},
				vite: {
					build: {
						sourcemap: isDevelopment,
						minify: isProduction,
						outDir: 'dist-electron/main',
						rollupOptions: {
							external: Object.keys(
								'dependencies' in pkg
									? pkg.dependencies
									: {}
							)
						}
					}
				}
			},
			{
				entry: 'electron/preload/index.ts',
				onstart(options) {
					// Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
					// instead of restarting the entire Electron App.
					options.reload()
				},
				vite: {
					build: {
						sourcemap: isDevelopment,
						minify: isProduction,
						outDir: 'dist-electron/preload',
						rollupOptions: {
							external: Object.keys(
								'dependencies' in pkg
									? pkg.dependencies
									: {}
							)
						}
					}
				}
			}
		]),
		// Use Node.js API in the Renderer-process
		Renderer({
			nodeIntegration: true
		})
	],
	server: !!process.env.VSCODE_DEBUG
		? (() => {
				const url = new URL(
					pkg.debug.env.VITE_DEV_SERVER_URL
				)
				return {
					host: url.hostname,
					port: +url.port
				}
		  })()
		: undefined,
	clearScreen: false
})
