import { PortableText } from 'next-sanity'
import CustomHTML from '@/modules/custom-html'
import {
	getDynamicFetchOptions,
	type DynamicFetchOptions,
} from '@/sanity/lib/live'
import { getSite } from '@/sanity/lib/queries'
import Logo from '@/ui/logo'
import SocialNavigation from '@/ui/social-navigation'
import SanityLink, { type SanityLinkType } from '../sanity-link'
import Navigation from './navigation'

export async function DynamicFooter() {
	const { perspective, stega } = await getDynamicFetchOptions()
	return <CachedFooter perspective={perspective} stega={stega} />
}

export default async function Footer(props: DynamicFetchOptions) {
	return <CachedFooter {...props} />
}

async function CachedFooter({ perspective, stega }: DynamicFetchOptions) {
	'use cache'
	const site = await getSite({ perspective, stega })
	const blurb = site?.footer?.blurb

	return (
		<footer className="bg-[#0f172a] text-[#f8fafc]">
			<div className="section space-y-10 py-12 md:py-16">
				<div className="flex flex-col justify-between gap-12 max-md:flex-col md:flex-row md:items-start md:gap-16 lg:gap-20">
					<div className="flex max-w-sm shrink-0 flex-col items-center gap-4 max-md:text-center md:items-start">
						<Logo
							className="[&_img]:h-[2lh]"
							perspective={perspective}
							stega={stega}
						/>

						{blurb && (
							<div className="prose text-sm leading-relaxed text-[#f8fafc]/72">
								<PortableText
									value={blurb}
									components={{
										types: {
											'custom-html': ({ value }) => <CustomHTML {...value} />,
										},
									}}
								/>
							</div>
						)}

						<SocialNavigation
							className="social [&_svg]:size-lh link flex items-center gap-4 text-[#f8fafc] max-md:justify-center"
							perspective={perspective}
							stega={stega}
						/>
					</div>

					<Navigation perspective={perspective} stega={stega} />
				</div>

				{(site?.copyright || site?.bottom?.items) && (
					<div className="flex items-center justify-between gap-4 border-t border-white/15 pt-6 text-center text-sm text-[#f8fafc]/70 not-has-[.bottom-navigation]:justify-center max-md:flex-col">
						{site?.bottom?.items && (
							<ul className="bottom-navigation flex flex-wrap gap-x-4">
								{site?.bottom?.items?.map((item, i) => (
									<li key={`${item._key}-${i}`}>
										<SanityLink
											link={item as SanityLinkType}
											className="hover:text-accent text-current hover:underline"
										/>
									</li>
								))}
							</ul>
						)}

						{site?.copyright && (
							<div className="[&_a]:link copyright text-[#f8fafc]/65 md:order-first">
								<PortableText value={site.copyright} />
							</div>
						)}
					</div>
				)}
			</div>
		</footer>
	)
}
