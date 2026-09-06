import { PiCaretDown, PiNotePencil, PiSquaresFour } from 'react-icons/pi'
import HoverDetails from '@/ui/details/hover-details'
import {
	MegaMenuCard,
	MegaMenuFooterLink,
	MegaMenuPanel,
} from './mega-menu'

export const CUSTOM_NAV_LABELS = ['custom', 'custom projects']

export type CustomMenuImages = {
	namePlates?: any
	memorials?: any
	signage?: any
	calligraphy?: any
}

export default function CustomMenu({
	images,
	label = 'Custom',
	summaryClassName,
}: {
	images?: CustomMenuImages
	label?: string
	summaryClassName?: string
}) {
	const items = [
		{
			href: '/custom-projects/name-plates',
			eyebrow: 'Entrances',
			title: 'Name plates',
			image: images?.namePlates,
		},
		{
			href: '/custom-projects/memorials',
			eyebrow: 'Remembrance',
			title: 'Memorials',
			image: images?.memorials,
		},
		{
			href: '/commercial-signage',
			eyebrow: 'Architecture',
			title: 'Commercial signage',
			image: images?.signage,
		},
		{
			href: '/custom-projects?type=islamic-calligraphy#project-brief',
			eyebrow: 'Walls',
			title: 'Calligraphy & wall art',
			image: images?.calligraphy,
		},
	]

	return (
		<HoverDetails
			name="header"
			className="group/custom static"
			data-custom-menu
			closeAfterNavigate
			activePathPrefixes={['/custom-projects', '/commercial-signage']}
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
						className="size-3 transition group-open/custom:rotate-180"
					/>
				</span>
				<span className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 py-4 md:hidden">
					<span className="text-accent text-[10px] font-bold tracking-[.18em]">
						02
					</span>
					<span>
						<span className="block text-[1.65rem] leading-none font-[var(--font-serif)] font-semibold tracking-[-.025em]">
							{label}
						</span>
						<span className="text-muted-foreground mt-1.5 block text-xs leading-snug">
							Name plates, memorials, and made-to-order work
						</span>
					</span>
					<PiCaretDown
						aria-hidden="true"
						className="text-muted-foreground size-5 transition group-open/custom:rotate-180"
					/>
				</span>
			</summary>

			<MegaMenuPanel>
				<div className="grid gap-2 sm:grid-cols-2">
					{items.map((item) => (
						<MegaMenuCard key={item.href} {...item} />
					))}
				</div>
				<div className="mt-3 grid gap-2 sm:grid-cols-2">
					<MegaMenuFooterLink
						href="/custom-projects"
						icon={
							<PiSquaresFour
								aria-hidden="true"
								className="text-primary size-4"
							/>
						}
					>
						All custom work
					</MegaMenuFooterLink>
					<MegaMenuFooterLink
						href="/custom-projects#project-brief"
						icon={
							<PiNotePencil
								aria-hidden="true"
								className="text-primary size-4"
							/>
						}
					>
						Start a brief
					</MegaMenuFooterLink>
				</div>
			</MegaMenuPanel>
		</HoverDetails>
	)
}
