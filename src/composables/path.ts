export function slash(path: string) {
	return path.replace(/\\/g, '/')
}

export function extractName(path: string) {
	return path.split('/').at(-1) as string
}
