import { PiCaretDown, PiSquaresFour, PiStar } from 'react-icons/pi'
import type { CatalogCategory } from '@/lib/catalog'
import HoverDetails from '@/ui/details/hover-details'
import {
	MegaMenuCard,
	MegaMenuFooterLink,
	MegaMenuPanel,
} from './mega-menu'

export const CATALOG_NAV_LABELS = ['shop', 'collections', 'categories']

export default function CatalogMenu({
	categories,
	label = 'Shop',
	summaryClassName,
}: {
	categories: CatalogCategory[]
	label?: string
	summaryClassName?: string
}) {
	return (
		<HoverDetails
			name="header"
			className="group/catalog static"
			data-catalog-menu
			closeAfterNavigate
			activePathPrefixes={['/collections']}
		>
			<summary
				className={
					(summaryClassName || '') +
					' max-md:border-border-subtle cursor-pointer list-none text-current marker:content-none max-md:border-b md:hover:no-underline'
				}
			>
				<span className="hidden items-center gap-1.5 md:inline-flex">
					{label}
					<PiCaretDown
						aria-hidden="true"
						className="size-3 transition group-open/catalog:rotate-180"
					/>
				</span>
				<span className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 py-4 md:hidden">
					<span className="text-accent text-[10px] font-bold tracking-[.18em]">
						01
					</span>
					<span>
						<span className="block text-[1.65rem] leading-none font-[var(--font-serif)] font-semibold tracking-[-.025em]">
							{label}
						</span>
						<span className="text-muted-foreground mt-1.5 block text-xs leading-snug">
							Browse the catalog by material and type
						</span>
					</span>
					<PiCaretDown
						aria-hidden="true"
						className="text-muted-foreground size-5 transition group-open/catalog:rotate-180"
					/>
				</span>
			</summary>

			<MegaMenuPanel>
				<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
					{categories.slice(0, 6).map((category) => (
						<MegaMenuCard
							key={category._id}
							href={'/collections/' + category.slug}
							image={category.image}
							eyebrow="Collection"
							title={category.title || 'Collection'}
						/>
					))}
				</div>
				<div className="mt-3 grid gap-2 sm:grid-cols-2">
					<MegaMenuFooterLink
						href="/collections/best-sellers"
						icon={
							<PiStar aria-hidden="true" className="text-primary size-4" />
						}
					>
						Best Sellers
					</MegaMenuFooterLink>
					<MegaMenuFooterLink
						href="/collections"
						icon={
							<PiSquaresFour
								aria-hidden="true"
								className="text-primary size-4"
							/>
						}
					>
						All collections
					</MegaMenuFooterLink>
				</div>
			</MegaMenuPanel>
		</HoverDetails>
	)
}
