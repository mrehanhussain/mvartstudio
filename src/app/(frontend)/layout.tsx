import { VisualEditing } from 'next-sanity/visual-editing'
import { Geist, Geist_Mono, Manrope, Playfair_Display } from 'next/font/google'
import { draftMode } from 'next/headers'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Suspense } from 'react'
import { preconnect } from 'react-dom'
import { dev, ROUTES } from '@/lib/env'
import { SanityLive } from '@/sanity/lib/live'
import Announcement, { DynamicAnnouncement } from '@/ui/announcement'
import DraftModeBanner from '@/ui/draft-mode-banner'
import Footer, { DynamicFooter } from '@/ui/footer'
import Header, { DynamicHeader } from '@/ui/header'
import MotionSystem from '@/ui/motion-system'
import RouteState from '@/ui/route-state'
import '@/app.css'

const fontSans = Geist({ subsets: ['latin'] })
const fontMono = Geist_Mono({ subsets: ['latin'] })
const fontManrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })
const fontPlayfair = Playfair_Display({
	subsets: ['latin'],
	variable: '--font-playfair',
})
const themeScript = `(function(){try{var k='mvart-theme';var s=localStorage.getItem(k);var t=s==='light'||s==='dark'?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;document.addEventListener('click',function(e){var b=e.target&&e.target.closest&&e.target.closest('button[data-theme-toggle]');if(!b)return;var n=document.documentElement.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem(k,n)}catch(err){}document.documentElement.dataset.theme=n;document.documentElement.style.colorScheme=n;document.querySelectorAll('button[data-theme-toggle]').forEach(function(el){el.setAttribute('aria-pressed',n==='dark'?'true':'false');el.setAttribute('aria-label','Switch to '+(n==='dark'?'light':'dark')+' theme')})},true)}catch(e){document.documentElement.dataset.theme='light'}})()`

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	preconnect('https://cdn.sanity.io')

	const { isEnabled: isDraftMode } = await draftMode()
	const showDrafts = isDraftMode || dev

	return (
		<html
			lang="en"
			data-scroll-behavior="smooth"
			data-theme="light"
			suppressHydrationWarning
		>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
			</head>
			<NuqsAdapter>
				<body
					className={`${fontManrope.variable} ${fontPlayfair.variable} ${fontSans.className} bg-background text-foreground antialiased`}
				>
					<RouteState />
					<a href="#main-content" className="skip-link">
						Skip to main content
					</a>
					<a href={`/${ROUTES.a11y}`} className="skip-link">
						Accessibility statement
					</a>

					{showDrafts ? (
						<Suspense>
							<DynamicAnnouncement />
						</Suspense>
					) : (
						<Announcement perspective="published" stega={false} />
					)}

					{showDrafts ? (
						<Suspense fallback={<div className="header-fallback" />}>
							<DynamicHeader />
						</Suspense>
					) : (
						<Header perspective="published" stega={false} />
					)}

					<main id="main-content" tabIndex={-1}>
						{children}
					</main>

					{showDrafts ? (
						<Suspense fallback={<div className="footer-fallback" />}>
							<DynamicFooter />
						</Suspense>
					) : (
						<Footer perspective="published" stega={false} />
					)}

					<MotionSystem />
					<SanityLive includeDrafts={showDrafts} />

					{isDraftMode && (
						<>
							<VisualEditing />
							<DraftModeBanner />
						</>
					)}
				</body>
			</NuqsAdapter>
		</html>
	)
}
