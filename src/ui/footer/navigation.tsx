import type { DynamicFetchOptions } from '@/sanity/lib/live'
import { getSite } from '@/sanity/lib/queries'
import type { LinkList as LinkListType } from '@/sanity/types'
import SanityLink, { type SanityLinkType } from '@/ui/sanity-link'
import LinkList from './link.list'

export default async function ({ perspective, stega }: DynamicFetchOptions) {
	const site = await getSite({ perspective, stega })

	return (
		<nav aria-label="Footer" className="w-full min-w-0 md:max-w-3xl lg:max-w-4xl">
			<ul className="footer-nav">
				{site?.footer?.items?.map((item, i) => {
					switch (item._type) {
						case 'link':
							return (
								<li key={`${item._key}-${i}`} className="footer-nav__col">
									<SanityLink
										link={item as SanityLinkType}
										className="hover:text-accent text-sm hover:underline"
									/>
								</li>
							)

						case 'link.list':
							return (
								<LinkList
									key={`${item._key}-${i}`}
									{...(item as unknown as LinkListType)}
								/>
							)

						default:
							return null
					}
				})}
			</ul>
		</nav>
	)
}
