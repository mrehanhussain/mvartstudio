'use client'

import { useLayoutEffect, useState } from 'react'
import { PiMoonStars, PiSun } from 'react-icons/pi'
import { cn } from '@/lib/utils'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'mvart-theme'

function preferredTheme(): Theme {
	const stored = window.localStorage.getItem(STORAGE_KEY)
	if (stored === 'light' || stored === 'dark') return stored
	return window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light'
}

function applyTheme(theme: Theme) {
	document.documentElement.dataset.theme = theme
	document.documentElement.style.colorScheme = theme
}

export default function ThemeToggle({ className }: { className?: string }) {
	const [theme, setTheme] = useState<Theme>('light')

	useLayoutEffect(() => {
		const current = preferredTheme()
		applyTheme(current)
		setTheme(current)

		const media = window.matchMedia('(prefers-color-scheme: dark)')
		const syncSystemTheme = () => {
			if (window.localStorage.getItem(STORAGE_KEY)) return
			const next = media.matches ? 'dark' : 'light'
			applyTheme(next)
			setTheme(next)
		}
		media.addEventListener('change', syncSystemTheme)
		return () => media.removeEventListener('change', syncSystemTheme)
	}, [])

	function toggleTheme() {
		const next: Theme =
			document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
		window.localStorage.setItem(STORAGE_KEY, next)
		applyTheme(next)
		setTheme(next)
	}

	return (
		<button
			type="button"
			onClick={toggleTheme}
			aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
			aria-pressed={theme === 'dark'}
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
