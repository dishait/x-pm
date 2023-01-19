import { rmSync } from 'node:fs'
import Unocss from 'unocss/vite'
import pkg from './package.json'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

import Electron from 'vite-plugin-electron'
import Removelog from 'vite-plugin-removelog'
import AutoImport from 'unplugin-auto-import/vite'
import Renderer from 'vite-plugin-electron-renderer'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

rmSync('dist-electron', { recursive: true, force: true })

const isDevelopment =
	process.env.NODE_ENV === 'development' ||
	!!process.env.VSCODE_DEBUG
const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
	define: {
		__VUE_OPTIONS_API__: false // 明确不使用 options api
	},
	optimizeDeps: {
		include: ['@arco-design/web-vue']
	},
	plugins: [
		Removelog(),
		Vue({
			reactivityTransform: true // 开启响应式语法糖
		}),
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
