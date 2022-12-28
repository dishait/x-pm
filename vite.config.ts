import { rmSync } from 'node:fs'
import Unocss from 'unocss/vite'
import pkg from './package.json'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

import Electron from 'vite-plugin-electron'
import Modules from 'vite-plugin-use-modules'
import VueRouter from 'unplugin-vue-router/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Renderer from 'vite-plugin-electron-renderer'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'

rmSync('dist-electron', { recursive: true, force: true })

const isDevelopment =
	process.env.NODE_ENV === 'development' ||
	!!process.env.VSCODE_DEBUG
const isProduction = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		VueRouter({
			routesFolder: 'src/pages',
			dts: 'types/typed-router.d.ts'
		}),
		Vue(),
		Modules({
			auto: true
		}),
		Unocss(),
		AutoImport({
			dts: './types/auto-imports.d.ts',
			resolvers: [ArcoResolver()],
			imports: ['vue', '@vueuse/core', VueRouterAutoImports]
		}),
		Components({
			dts: './types/components.d.ts',
			resolvers: [
				ArcoResolver({
					sideEffect: true
				})
			]
		}),
		Electron([
			{
				// Main-Process entry file of the Electron App.
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
