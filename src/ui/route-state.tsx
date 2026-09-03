'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

function normalizedPath(value: string) {
	const path = value.replace(/\/$/, '')
	return path || '/'
}

export default function RouteState() {
	const pathname = usePathname()
	const initialRender = useRef(true)

	useEffect(() => {
		const current = normalizedPath(pathname)
		document.body.dataset.route = current
		let timer = 0
		const applyRouteState = () => {
			timer = window.setTimeout(() => {
				const links = document.querySelectorAll<HTMLAnchorElement>(
					'.layout-header a[href], footer a[href]',
				)
				for (const link of links) {
					const target = normalizedPath(
						new URL(link.href, window.location.href).pathname,
					)
					if (target === current) link.setAttribute('aria-current', 'page')
					else link.removeAttribute('aria-current')
				}

				const catalog = document.querySelector<HTMLElement>(
					'.layout-header details[data-catalog-menu]',
				)
				if (catalog) {
					const inCatalog =
						current === '/collections' ||
						current.startsWith('/collections/') ||
						current === '/islamic-art'
					catalog.dataset.current = String(inCatalog)
				}

				if (initialRender.current) initialRender.current = false
				else
					document
						.querySelector<HTMLElement>('#main-content')
						?.focus({ preventScroll: true })
			}, 80)
		}

		if (document.readyState === 'complete') applyRouteState()
		else window.addEventListener('load', applyRouteState, { once: true })

		return () => {
			window.clearTimeout(timer)
			window.removeEventListener('load', applyRouteState)
		}
	}, [pathname])

	return null
}
