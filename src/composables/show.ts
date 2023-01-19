export function showNameFromPath(path: string) {
	return path.split('/').at(-1) as string
}
