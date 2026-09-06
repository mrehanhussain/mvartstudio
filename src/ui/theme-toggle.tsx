'use client'

import { useEffect, useState } from 'react'
import { PiMoonStars, PiSun } from 'react-icons/pi'
import { cn } from '@/lib/utils'

type Theme = 'light' | 'dark'

function readTheme(): Theme {
	if (typeof document === 'undefined') return 'light'
	return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export default function ThemeToggle({ className }: { className?: string }) {
	const [theme, setTheme] = useState<Theme>('light')

	useEffect(() => {
		setTheme(readTheme())
		const observer = new MutationObserver(() => setTheme(readTheme()))
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme'],
		})
		return () => observer.disconnect()
	}, [])

	return (
		<button
			type="button"
			data-theme-toggle=""
			aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
			aria-pressed={theme === 'dark'}
			suppressHydrationWarning
			className={cn(
				'theme-toggle border-border-subtle text-foreground hover:bg-foreground/5 focus-visible:outline-primary relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
				className,
			)}
		>
			<PiSun
				aria-hidden="true"
				className="theme-toggle-sun absolute size-5 transition duration-300"
			/>
			<PiMoonStars
				aria-hidden="true"
				className="theme-toggle-moon absolute size-5 transition duration-300"
			/>
		</button>
	)
}
