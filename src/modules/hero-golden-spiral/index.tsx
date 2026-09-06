import { PortableText } from 'next-sanity'
import { Module } from '@/modules'
import type { HeroGoldenSpiral } from '@/sanity/types'
import CTAList from '@/ui/cta-list'
import Eyebrow from '@/ui/eyebrow'
import Img from '@/ui/img'
import { GoldenSpiralDesktop, GoldenSpiralMobile } from './golden-spiral'

const defaultHighlights = [
	'Wall art & home decor',
	'Arabic & Islamic art',
	'Personalised name plates',
	'Wood, acrylic & more',
]

/**
 * MV Art Studio hero using the real golden-spiral SVG geometry from
 * 21st.dev "Hero Golden Spiral" (ncdai/hero-01). Full-bleed composition so
 * long Sanity headlines are never clipped by the φ aspect frame.
 */
export default function HeroGoldenSpiralModule({
	eyebrow,
	content = [],
	ctas,
	highlights,
	image,
	...props
}: HeroGoldenSpiral) {
	const items = highlights?.length
		? highlights.map((item) => item.title).filter(Boolean)
		: defaultHighlights

	return (
		<Module
			className="relative isolate overflow-hidden bg-[#0f172a] text-[#f8fafc]"
			{...props}
		>
			{image?.asset && (
				<Img
					image={image}
					width={1920}
					alt={image.alt || ''}
					loading="eager"
					className="pointer-events-none absolute inset-0 -z-20 size-full object-cover object-[68%_42%] opacity-40"
				/>
			)}
			<div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(15,23,42,.97)_0%,rgba(15,23,42,.88)_38%,rgba(25,67,145,.42)_68%,rgba(15,23,42,.2)_100%)]" />

			{/* 21st.dev spiral — mobile portrait geometry */}
			<div className="pointer-events-none absolute inset-0 md:hidden">
				<GoldenSpiralMobile />
			</div>
			{/* 21st.dev spiral — desktop landscape geometry, anchored right */}
			<div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[min(72vw,58rem)] md:block">
				<GoldenSpiralDesktop />
			</div>

			<div className="section relative flex min-h-[calc(100svh-4.5rem)] flex-col justify-center py-16 sm:py-20 lg:py-24">
				<div className="max-w-3xl">
					<Eyebrow value={eyebrow} className="text-accent mb-5 sm:mb-6" />
					<div className="prose headings:font-[family-name:var(--font-serif)] headings:font-medium headings:tracking-[-.035em] [&_h1]:max-w-[14ch] [&_h1]:text-5xl [&_h1]:leading-[.94] [&_h1]:text-[#f8fafc] [&_h1]:sm:text-6xl [&_h1]:lg:text-7xl [&_h1]:xl:text-[5.5rem] [&_p]:mt-5 [&_p]:max-w-xl [&_p]:text-base [&_p]:leading-7 [&_p]:text-[#f8fafc]/72 [&_p]:sm:text-lg">
						<PortableText value={content || []} />
					</div>
					<CTAList
						ctas={ctas}
						className="[&_.action-outline]:border-border-inverse mt-8 flex max-w-sm flex-col gap-3 [&_.action]:bg-accent [&_.action]:min-h-12 [&_.action]:rounded-sm [&_.action]:px-6 [&_.action]:font-semibold [&_.action]:tracking-[.04em] [&_.action]:text-[#0f172a] [&_.action]:uppercase [&_.action-outline]:min-h-12 [&_.action-outline]:rounded-sm [&_.action-outline]:bg-white/8 [&_.action-outline]:px-6 [&_.action-outline]:font-semibold [&_.action-outline]:tracking-[.04em] [&_.action-outline]:text-[#f8fafc] [&_.action-outline]:uppercase"
					/>
				</div>

				{!!items.length && (
					<ul
						aria-label="Materials and specialties"
						className="border-accent/28 mt-14 flex max-w-4xl flex-wrap items-center gap-x-7 gap-y-3 border-t pt-6 text-[10px] font-semibold tracking-[.16em] text-[#f8fafc]/68 uppercase sm:mt-16 sm:text-xs"
					>
						{items.map((item, index) =>
							item ? (
								<li
									key={`${item}-${index}`}
									className="flex items-center gap-2.5"
								>
									<span
										aria-hidden="true"
										className="bg-accent size-1.5 shrink-0 rounded-full shadow-[0_0_0_4px_rgba(193,168,117,.12)]"
									/>
									{item}
								</li>
							) : null,
						)}
					</ul>
				)}
			</div>
		</Module>
	)
}
