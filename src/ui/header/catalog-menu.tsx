import Link from 'next/link'
import { PiArrowRight, PiCaretDown, PiSquaresFour } from 'react-icons/pi'
import type { CatalogCategory } from '@/lib/catalog'
import HoverDetails from '@/ui/details/hover-details'
import Img from '@/ui/img'

export default function CatalogMenu({
	categories,
	summaryClassName,
}: {
	categories: CatalogCategory[]
	summaryClassName?: string
}) {
	return (
		<HoverDetails
			className="group/catalog static"
			data-catalog-menu
			closeAfterNavigate
		>
			<summary
				className={
					(summaryClassName || '') +
					' cursor-pointer list-none text-current marker:content-none max-md:border-b max-md:border-black/10 md:hover:no-underline'
				}
			>
				<span className="hidden items-center gap-1.5 md:inline-flex">
					Shop
					<PiCaretDown
						aria-hidden="true"
						className="size-3 transition group-open/catalog:rotate-180"
					/>
				</span>
				<span className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 py-4 md:hidden">
					<span className="text-[10px] font-bold tracking-[.18em] text-[#765523]">
						01
					</span>
					<span>
						<span className="block text-[1.65rem] leading-none font-[var(--font-serif)] font-semibold tracking-[-.025em]">
							Shop
						</span>
						<span className="mt-1.5 block text-xs leading-snug text-black/60">
							Six material-led collections
						</span>
					</span>
					<PiCaretDown
						aria-hidden="true"
						className="size-5 text-black/60 transition group-open/catalog:rotate-180"
					/>
				</span>
			</summary>

			<div className="z-20 mt-2 overflow-hidden text-left text-[#211d18] max-md:mx-0 max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none max-md:backdrop-blur-none md:absolute md:inset-x-4 md:top-full md:mx-auto md:w-auto md:max-w-5xl md:rounded-[1.5rem] md:border md:border-black/10 md:bg-[#fffaf0]/98 md:p-3 md:shadow-[0_28px_80px_rgba(22,34,28,.2)] md:backdrop-blur-2xl">
				<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
					{categories.slice(0, 6).map((category) => (
						<Link
							key={category._id}
							href={'/collections/' + category.slug}
							className="group relative min-h-36 overflow-hidden rounded-[1.1rem] bg-[#e8dfd2]"
						>
							<Img
								image={category.image}
								alt=""
								width={520}
									className="absolute inset-0 !size-full !max-h-none object-cover transition-opacity duration-300 group-hover:opacity-90"
							/>
							<span className="absolute inset-0 bg-gradient-to-t from-[#0d211c]/88 via-[#0d211c]/20 to-transparent" />
							<span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white">
								<span>
									<span className="block text-[9px] font-bold tracking-[.17em] text-[#e1bf80] uppercase">
										Collection
									</span>
									<span className="mt-1 block text-lg leading-tight font-semibold">
										{category.title}
									</span>
								</span>
								<PiArrowRight
									aria-hidden="true"
									className="size-5 shrink-0 transition group-hover:translate-x-1"
								/>
							</span>
						</Link>
					))}
				</div>
				<Link
					href="/collections"
					className="mt-3 flex items-center justify-between rounded-xl border border-black/8 bg-white/65 px-4 py-3 text-sm font-semibold transition hover:bg-white"
				>
					<span className="flex items-center gap-2">
						<PiSquaresFour
							aria-hidden="true"
							className="size-4 text-[#765523]"
						/>
						Browse every collection
					</span>
					<PiArrowRight aria-hidden="true" className="size-4" />
				</Link>
			</div>
		</HoverDetails>
	)
}
