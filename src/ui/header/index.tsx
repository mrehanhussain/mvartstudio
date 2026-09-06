import { PortableText } from 'next-sanity'
import { cn } from '@/lib/utils'
import CustomHTML from '@/modules/custom-html'
import {
	getDynamicFetchOptions,
	type DynamicFetchOptions,
} from '@/sanity/lib/live'
import { getSite } from '@/sanity/lib/queries'
import type { Cta, SITE_QUERY_RESULT } from '@/sanity/types'
import CTAList from '@/ui/cta-list'
import Logo from '@/ui/logo'
import ThemeToggle from '@/ui/theme-toggle'
import HeaderSearch from './header-search'
import css from './header.module.css'
import MobileToggle from './mobile-toggle'
import Navigation from './navigation'
import Wrapper from './wrapper'

async function getCachedSite({
	perspective,
	stega,
}: DynamicFetchOptions): Promise<SITE_QUERY_RESULT> {
	'use cache'
	return getSite({ perspective, stega })
}

export async function DynamicHeader() {
	const { perspective, stega } = await getDynamicFetchOptions()
	return <Header perspective={perspective} stega={stega} />
}

export default async function Header({
	perspective,
	stega,
}: DynamicFetchOptions) {
	const site = await getCachedSite({ perspective, stega })
	const blurb = site?.header?.blurb

	return (
		<Wrapper className="layout-header bg-background/80 max-md:header-open:shadow-xl md:has-[nav>details:open]:bg-background sticky top-0 z-10 backdrop-blur-md transition-colors">
			<div
				className={cn(
					css.root,
					'section grid items-center gap-x-6 py-0 max-md:max-h-svh max-md:overflow-y-auto',
				)}
			>
				<div className="sticky top-0 z-1 flex items-center justify-between gap-4 py-2 [grid-area:top]">
					<Logo
						className="header-logo h-12 w-[88px] shrink-0 grow-0"
						perspective={perspective}
						stega={stega}
					/>
					<div className="flex items-center md:hidden">
						<HeaderSearch mode="mobile" />
						<ThemeToggle />
						<MobileToggle />
					</div>
				</div>

				<div
					id="mobile-menu"
					className={cn(
						css.menu,
						'max-md:header-open:pb-4 [grid-area:menu] md:contents',
					)}
				>
					<div className="md:contents">
						<Navigation perspective={perspective} stega={stega} />

						<div className="header-ctas max-md:border-border-subtle flex items-center gap-[.5em_1em] [grid-area:ctas] max-md:mt-5 max-md:w-full max-md:flex-col max-md:border-t max-md:pt-5">
							{blurb && (
								<div className="prose">
									<PortableText
										value={blurb}
										components={{
											types: {
												'custom-html': ({ value }) => (
													<CustomHTML {...value} />
												),
											},
										}}
									/>
								</div>
							)}

							<div className="flex items-center max-md:hidden">
								<HeaderSearch mode="desktop" />
								<ThemeToggle />
							</div>
							<CTAList
								ctas={site?.ctas as Cta[]}
								className="max-md:w-full max-md:*:w-full"
							/>
						</div>
					</div>
				</div>
			</div>
		</Wrapper>
	)
}
