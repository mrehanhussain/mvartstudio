'use client'

import { createContext, Suspense, useContext, type ReactNode } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { pickBestTarget, type NavTarget } from './nav-path'

const NavActiveContext = createContext<NavTarget | null | undefined>(undefined)

function NavActiveInner({
	targets,
	children,
}: {
	targets: NavTarget[]
	children: ReactNode
}) {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const active = pickBestTarget(pathname, searchParams.toString(), targets)

	return (
		<NavActiveContext.Provider value={active}>
			{children}
		</NavActiveContext.Provider>
	)
}

export function NavActiveProvider({
	targets,
	children,
}: {
	targets: NavTarget[]
	children: ReactNode
}) {
	return (
		<Suspense
			fallback={
				<NavActiveContext.Provider value={null}>
					{children}
				</NavActiveContext.Provider>
			}
		>
			<NavActiveInner targets={targets}>{children}</NavActiveInner>
		</Suspense>
	)
}

export function useNavActive() {
	return useContext(NavActiveContext)
}
