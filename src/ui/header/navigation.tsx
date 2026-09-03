import { stegaClean } from 'next-sanity'
import { PiArrowUpRight } from 'react-icons/pi'
import { CATALOG_CATEGORIES_QUERY, type CatalogCategory } from '@/lib/catalog'
import { cn } from '@/lib/utils'
import { sanityFetch, type DynamicFetchOptions } from '@/sanity/lib/live'
import { getSite } from '@/sanity/lib/queries'
import type { LinkList, Megamenu as MegamenuType } from '@/sanity/types'
import SanityLink, { type SanityLinkType } from '@/ui/sanity-link'
import CatalogMenu from './catalog-menu'
import Dropdown from './dropdown'
import Megamenu from './megamenu'

const topLevelClassName = cn(
	'leading-tight md:grid md:place-content-center md:rounded-full md:px-3 md:py-2 md:text-center md:text-balance md:transition-colors md:hover:bg-foreground/5',
)

const navigationMeta: Record<string, { index: string; description: string }> = {
	'Custom Projects': {
		index: '02',
		description: 'Commissioned pieces for your exact space',
	},
	Commercial: {
		index: '03',
		description: 'Architectural signage and business identity',
	},
	Journal: {
		index: '04',
		description: 'Notes on material, craft, and placement',
	},
	About: {
		index: '05',
		description: 'Our Hyderabad studio and process',
	},
	Contact: {
		index: '06',
		description: 'Questions, visits, and general enquiries',
	},
}

export default async function ({ perspective, stega }: DynamicFetchOptions) {
	const [site, categoriesResult] = await Promise.all([
		getSite({ perspective, stega }),
		sanityFetch({
			query: CATALOG_CATEGORIES_QUERY,
			params: {},
			perspective,
			stega,
		}),
	])
	const categories = categoriesResult.data as CatalogCategory[]
	let catalogMenuRendered = false

	return (
		<nav className="gap-x-lh max-md:border-border-subtle flex items-stretch [grid-area:navigation] max-md:mt-6 max-md:flex-col max-md:border-t">
			{site?.header?.items?.map((item, i) => {
				const label =
					item._type === 'link'
						? stegaClean((item as SanityLinkType).label)
						: ''
				if (label === 'Collections' || label === 'Islamic Art') {
					if (catalogMenuRendered) return null
					catalogMenuRendered = true
					return (
						<CatalogMenu
							key="catalog-menu"
							categories={categories}
							summaryClassName={topLevelClassName}
						/>
					)
				}

				switch (item._type) {
					case 'link':
						const meta = navigationMeta[label ?? ''] ?? {
							index: String(i + 1).padStart(2, '0'),
							description: 'Explore MV Art Studio',
						}
						return (
							<SanityLink
								link={item as SanityLinkType}
								className={cn(
									topLevelClassName,
									'group/nav-item max-md:border-border-subtle text-current max-md:block max-md:border-b max-md:no-underline md:hover:no-underline',
								)}
								key={`${item._key}-${i}`}
							>
								<span className="hidden md:inline">{label}</span>
								<span className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 py-4 md:hidden">
									<span className="text-primary text-[10px] font-bold tracking-[.18em]">
										{meta.index}
									</span>
									<span>
										<span className="block text-[1.65rem] leading-none font-[var(--font-serif)] font-semibold tracking-[-.025em]">
											{label}
										</span>
										<span className="text-muted-foreground mt-1.5 block text-xs leading-snug">
											{meta.description}
										</span>
									</span>
									<PiArrowUpRight
										aria-hidden="true"
										className="text-muted-foreground size-5 transition group-hover/nav-item:translate-x-0.5 group-hover/nav-item:-translate-y-0.5"
									/>
								</span>
							</SanityLink>
						)

					case 'link.list':
						return (
							<Dropdown
								key={`${item._key}-${i}`}
								{...(item as LinkList & { _key: string })}
								summaryClassName={topLevelClassName}
							/>
						)

					case 'megamenu':
						return (
							<Megamenu
								key={`${item._key}-${i}`}
								{...(item as MegamenuType)}
								summaryClassName={topLevelClassName}
							/>
						)

					default:
						return null
				}
			})}
		</nav>
	)
}
