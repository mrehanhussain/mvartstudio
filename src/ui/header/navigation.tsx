import { stegaClean } from 'next-sanity'
import { PiArrowUpRight } from 'react-icons/pi'
import { cn } from '@/lib/utils'
import type { DynamicFetchOptions } from '@/sanity/lib/live'
import type { LinkList, Megamenu as MegamenuType } from '@/sanity/types'
import SanityLink, { type SanityLinkType } from '@/ui/sanity-link'
import CatalogMenu, { CATALOG_NAV_LABELS } from './catalog-menu'
import CustomMenu, { CUSTOM_NAV_LABELS } from './custom-menu'
import Dropdown from './dropdown'
import Megamenu from './megamenu'
import { NavActiveProvider } from './nav-active'
import { getNavigationData } from './navigation-data'
import { collectNavTargets } from './nav-path'

const topLevelClassName = cn(
	'leading-tight md:text-center md:hover:no-underline',
)

const navigationMeta: Record<string, { index: string; description: string }> = {
	Custom: {
		index: '02',
		description: 'Commissioned pieces, name plates, and memorials',
	},
	'Custom Projects': {
		index: '02',
		description: 'Commissioned pieces for your exact space',
	},
	Commercial: {
		index: '03',
		description: 'Architectural signage and business identity',
	},
	About: {
		index: '03',
		description: 'Our Hyderabad studio and process',
	},
	Contact: {
		index: '04',
		description: 'Questions, visits, and general enquiries',
	},
}

export default async function ({ perspective, stega }: DynamicFetchOptions) {
	const { site, categories, customImages } = await getNavigationData({
		perspective,
		stega,
	})
	let catalogMenuRendered = false
	let customMenuRendered = false
	const navItemLabel = (item: {
		_type?: string
		label?: string | null
		link?: { label?: string | null } | null
	}) => {
		if (item._type === 'link.list') return stegaClean(item.link?.label)
		if (item._type === 'link') return stegaClean(item.label)
		return ''
	}
	const isCatalogNavLabel = (value?: string | null) =>
		CATALOG_NAV_LABELS.includes((value || '').trim().toLowerCase())
	const isCustomNavLabel = (value?: string | null) =>
		CUSTOM_NAV_LABELS.includes((value || '').trim().toLowerCase())
	const hasCatalogMenu = site?.header?.items?.some((item) =>
		isCatalogNavLabel(navItemLabel(item)),
	)
	const navTargets = collectNavTargets(
		site?.header?.items,
		hasCatalogMenu
			? [
					{ href: '/collections', label: 'Shop' },
					{ href: '/collections/best-sellers', label: 'Best Sellers' },
					...categories.flatMap((category) =>
						category.slug
							? [
									{
										href: `/collections/${category.slug}`,
										label: category.title,
									},
								]
							: [],
					),
				]
			: [],
	)

	return (
		<NavActiveProvider targets={navTargets}>
			<nav className="header-nav max-md:border-border-subtle flex items-stretch [grid-area:navigation] max-md:mt-6 max-md:flex-col max-md:border-t md:min-w-0 md:items-center">
				{site?.header?.items?.map((item, i) => {
				const label = navItemLabel(item)
				if (isCatalogNavLabel(label)) {
					if (catalogMenuRendered) return null
					catalogMenuRendered = true
					return (
						<CatalogMenu
							key="catalog-menu"
							label="Shop"
							categories={categories}
							summaryClassName={topLevelClassName}
						/>
					)
				}
				if (isCustomNavLabel(label)) {
					if (customMenuRendered) return null
					customMenuRendered = true
					return (
						<CustomMenu
							key="custom-menu"
							label="Custom"
							images={customImages}
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
									'group/nav-item max-md:border-border-subtle text-current max-md:block max-md:border-b max-md:no-underline',
								)}
								key={`${item._key}-${i}`}
							>
								<span className="hidden whitespace-nowrap md:inline">
									{label}
								</span>
								<span className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 py-4 md:hidden">
									<span className="text-accent text-[10px] font-bold tracking-[.18em]">
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
		</NavActiveProvider>
	)
}
