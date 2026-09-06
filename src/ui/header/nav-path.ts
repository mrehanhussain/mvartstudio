import { stegaClean } from 'next-sanity'

export type NavTarget = {
	href: string
	key?: string
	label?: string
}

export function normalizePath(value: string) {
	const path = value.split(/[?#]/)[0]?.replace(/\/$/, '')
	return path || '/'
}

function splitHref(href: string) {
	const [pathPart, queryPart] = href.split('?')
	return {
		path: normalizePath(pathPart || '/'),
		query: queryPart?.split('#')[0] || '',
	}
}

export function pathMatches(pathname: string, href: string) {
	const current = normalizePath(pathname)
	const target = splitHref(href).path
	if (target === '/') return current === '/'
	return current === target || current.startsWith(`${target}/`)
}

function labelScore(label: string | undefined, path: string) {
	const name = (label || '').trim().toLowerCase().replace(/\s+/g, ' ')
	const slug = (path.split('/').filter(Boolean).pop() || 'home').replace(
		/-/g,
		' ',
	)
	if (path === '/' && name === 'home') return 100
	if (name && name === slug) return 90
	if (
		path === '/collections' &&
		['categories', 'collections', 'shop'].includes(name)
	) {
		return 80
	}
	if (
		path === '/custom-projects' &&
		['custom', 'custom projects', 'custom designs'].includes(name)
	) {
		return 80
	}
	if (!name) return 0
	const labelWords = new Set(name.split(' '))
	return slug.split(' ').filter((word) => labelWords.has(word)).length * 10
}

export function pickBestTarget(
	pathname: string,
	search: string,
	targets: NavTarget[],
) {
	const currentPath = normalizePath(pathname)
	const currentQuery = search.replace(/^\?/, '')

	const matches = targets.flatMap((target) => {
		const { path, query } = splitHref(target.href)
		const pathOk =
			path === '/'
				? currentPath === '/'
				: currentPath === path || currentPath.startsWith(`${path}/`)
		if (!pathOk) return []
		if (query) {
			const expected = new URLSearchParams(query)
			const actual = new URLSearchParams(currentQuery)
			if (
				![...expected.entries()].every(
					([key, value]) => actual.get(key) === value,
				)
			) {
				return []
			}
		}
		return [{ ...target, path, query }]
	})

	matches.sort((a, b) => {
		if (b.path.length !== a.path.length) return b.path.length - a.path.length
		const queryRank = currentQuery
			? Number(Boolean(b.query)) - Number(Boolean(a.query))
			: Number(Boolean(a.query)) - Number(Boolean(b.query))
		if (queryRank) return queryRank
		return labelScore(b.label, b.path) - labelScore(a.label, a.path)
	})

	const best = matches[0]
	if (!best) return null
	return { href: best.href, key: best.key, label: best.label }
}

export function getLinkHref(link?: {
	type?: string | null
	internal?: { slug?: string | null } | null
	external?: string | null
	params?: string | null
}) {
	if (!link?.type) return

	if (link.type === 'internal') {
		const slug = stegaClean(link.internal?.slug)
		if (!slug) return
		const path = normalizePath(slug)
		const params = stegaClean(link.params) || ''
		if (params.startsWith('?')) {
			const query = params.slice(1).split('#')[0]
			return query ? `${path}?${query}` : path
		}
		return path
	}

	if (link.type === 'external') {
		const external = stegaClean(link.external)
		if (external?.startsWith('/')) return normalizePath(external)
	}
}

type NavLinkLike = {
	_key?: string
	label?: string | null
	_type?: string
	type?: string | null
	internal?: { slug?: string | null } | null
	external?: string | null
	params?: string | null
	link?: unknown
	links?: unknown[] | null
	items?: unknown[] | null
}

export function collectNavTargets(
	items: unknown[] | null | undefined,
	extra: NavTarget[] = [],
) {
	const targets: NavTarget[] = [...extra]

	function add(target?: NavTarget) {
		if (!target?.href) return
		const duplicate = targets.some(
			(existing) =>
				existing.href === target.href &&
				existing.key === target.key &&
				existing.label === target.label,
		)
		if (!duplicate) targets.push(target)
	}

	function walk(item?: unknown) {
		if (!item || typeof item !== 'object') return
		const value = item as NavLinkLike
		const href = getLinkHref(value)
		if (href) {
			add({
				href,
				key: value._key,
				label: stegaClean(value.label) || undefined,
			})
		}
		walk(value.link)
		value.links?.forEach(walk)
		value.items?.forEach(walk)
	}

	items?.forEach(walk)
	return targets
}

export function collectNavHrefs(
	items: unknown[] | null | undefined,
	extra: string[] = [],
) {
	return collectNavTargets(
		items,
		extra.map((href) => ({ href })),
	).map((target) => target.href)
}
