'use client'

import { animate, inView, stagger } from 'motion'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const EASE_OUT = [0.22, 1, 0.36, 1] as const
const ROOT_SELECTOR = [
	'#main-content [data-module]:not([data-module="custom-html"])',
	'#main-content > header',
	'#main-content > section',
	'#main-content > article',
	'#main-content > div > section',
	'#main-content > main > header',
	'#main-content > main > section',
	'#main-content > main > article',
	'#main-content > main > div > section',
].join(',')

function repeatedItems(root: HTMLElement) {
	return Array.from(
		root.querySelectorAll<HTMLElement>(
			':scope .grid > article, :scope .grid > li, :scope > ol > li, :scope > ul > li, :scope > div > article',
		),
	).slice(0, 12)
}

export default function MotionSystem() {
	const pathname = usePathname()
	const previousPathname = useRef(pathname)

	useEffect(() => {
		// The initial page is already visible from the server. Waiting for a real
		// route change avoids mutating streamed markup before React has claimed it.
		if (previousPathname.current === pathname) return
		previousPathname.current = pathname

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

		const cleanups: Array<() => void> = []
		const animations: Array<{ stop: () => void }> = []
		const animatedRoots: Array<{ root: HTMLElement; items: HTMLElement[] }> = []
		let startTimer: number | undefined
		const main = document.querySelector<HTMLElement>('#main-content')
		if (!main) return

		const bind = () => {
			const roots = Array.from(
				document.querySelectorAll<HTMLElement>(ROOT_SELECTOR),
			)

			for (const root of roots) {
				if (
					root.dataset.motionBound ||
					root.hidden ||
					!root.getClientRects().length
				)
					continue
				root.dataset.motionBound = 'true'
				root.style.opacity = '0'
				root.style.transform = 'translate3d(0, 24px, 0)'
				root.style.willChange = 'opacity, transform'

				const items = repeatedItems(root)
				for (const item of items) {
					item.style.opacity = '0'
					item.style.transform = 'translate3d(0, 16px, 0)'
					item.style.willChange = 'opacity, transform'
				}
				animatedRoots.push({ root, items })

				let stopObserving = () => {}
				stopObserving = inView(
					root,
					() => {
						stopObserving()
						root.dataset.motionVisible = 'true'
						animations.push(
							animate(
								root,
								{
									opacity: [0, 1],
									transform: [
										'translate3d(0, 24px, 0)',
										'translate3d(0, 0, 0)',
									],
								},
								{ duration: 0.44, ease: EASE_OUT },
							),
						)

						if (items.length > 1) {
							animations.push(
								animate(
									items,
									{
										opacity: [0, 1],
										transform: [
											'translate3d(0, 16px, 0)',
											'translate3d(0, 0, 0)',
										],
									},
									{
										duration: 0.34,
										delay: stagger(0.045, { startDelay: 0.04 }),
										ease: EASE_OUT,
									},
								),
							)
						}

						window.setTimeout(() => {
							root.style.removeProperty('will-change')
							for (const item of items) item.style.removeProperty('will-change')
						}, 1200)
					},
					{ amount: 0.12, margin: '0px 0px -8% 0px' },
				)
				cleanups.push(stopObserving)
			}
		}

		// This component sits above a streamed route segment. Give React a short
		// post-paint window to claim that server markup before Motion adds inline
		// styles, otherwise the animation setup itself creates hydration mismatches.
		startTimer = window.setTimeout(bind, 250)

		return () => {
			if (startTimer) window.clearTimeout(startTimer)
			for (const cleanup of cleanups) cleanup()
			for (const animation of animations) animation.stop()
			for (const { root, items } of animatedRoots) {
				delete root.dataset.motionBound
				delete root.dataset.motionVisible
				root.style.removeProperty('opacity')
				root.style.removeProperty('transform')
				root.style.removeProperty('will-change')
				for (const item of items) {
					item.style.removeProperty('opacity')
					item.style.removeProperty('transform')
					item.style.removeProperty('will-change')
				}
			}
		}
	}, [pathname])

	return null
}
