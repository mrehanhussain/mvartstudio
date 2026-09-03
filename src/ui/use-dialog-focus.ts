'use client'

import { useEffect, useRef, type RefObject } from 'react'

const focusableSelector = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(',')

export default function useDialogFocus(
	open: boolean,
	onClose: () => void,
	dialogRef: RefObject<HTMLElement | null>,
	initialFocusRef?: RefObject<HTMLElement | null>,
) {
	const onCloseRef = useRef(onClose)
	useEffect(() => {
		onCloseRef.current = onClose
	}, [onClose])

	useEffect(() => {
		if (!open) return

		const previousFocus =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null
		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'

		const focusTimer = window.setTimeout(() => {
			const firstFocusable =
				initialFocusRef?.current ||
				dialogRef.current?.querySelector<HTMLElement>(focusableSelector)
			firstFocusable?.focus()
		}, 20)

		function onKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				event.preventDefault()
				onCloseRef.current()
				return
			}
			if (event.key !== 'Tab') return

			const focusable = Array.from(
				dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ||
					[],
			).filter((element) => element.offsetParent !== null)
			if (!focusable.length) return

			const first = focusable[0]
			const last = focusable[focusable.length - 1]
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault()
				last.focus()
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault()
				first.focus()
			}
		}

		document.addEventListener('keydown', onKeyDown)
		return () => {
			window.clearTimeout(focusTimer)
			document.removeEventListener('keydown', onKeyDown)
			document.body.style.overflow = previousOverflow
			previousFocus?.focus()
		}
	}, [dialogRef, initialFocusRef, open])
}
