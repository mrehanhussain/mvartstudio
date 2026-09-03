'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type ComponentProps } from 'react'
import { useIsDesktop } from '@/hooks/useMatchMedia'
import { cn } from '@/lib/utils'
import css from './hover-details.module.css'

/**
 * @param safeAreaOnHover - Adds a safe area around the details element to prevent it from closing when the mouse leaves the element
 * @param closeAfterNavigate - Closes the details element after a navigation event
 */
export default function ({
	safeAreaOnHover,
	closeAfterNavigate,
	activePathPrefixes,
	delay,
	className,
	...props
}: {
	safeAreaOnHover?: boolean
	closeAfterNavigate?: boolean
	activePathPrefixes?: string[]
	delay?: number
} & ComponentProps<'details'>) {
	const isDesktop = useIsDesktop()
	const [open, setOpen] = useState(false)
	const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)

	const events = isDesktop
		? {
				onMouseEnter: () => {
					clearTimeout(timeout.current)

					if (delay) {
						timeout.current = setTimeout(() => setOpen(true), delay)
					} else {
						setOpen(true)
					}
				},
				onMouseLeave: () => {
					clearTimeout(timeout.current)
					setOpen(false)
				},
			}
		: {}

	// Close after navigation
	const pathname = usePathname()
	const isCurrent = activePathPrefixes?.some(
		(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
	)
	useEffect(() => {
		if (closeAfterNavigate) setOpen(false)
	}, [pathname])

	return (
		<details
			className={cn(safeAreaOnHover && css.safearea, className)}
			open={open}
			{...events}
			{...props}
			data-current={activePathPrefixes ? String(Boolean(isCurrent)) : undefined}
			onToggle={(e) => {
				setOpen(e.currentTarget.open)
				props.onToggle?.(e)
			}}
		/>
	)
}
