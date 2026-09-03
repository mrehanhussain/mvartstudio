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

		if (initialRender.current) initialRender.current = false
		else
			window.requestAnimationFrame(() => {
				document
					.querySelector<HTMLElement>('#main-content')
					?.focus({ preventScroll: true })
			})
	}, [pathname])

	return null
}
