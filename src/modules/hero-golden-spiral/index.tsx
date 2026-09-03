import { PortableText } from 'next-sanity'
import { Module } from '@/modules'
import type { HeroGoldenSpiral } from '@/sanity/types'
import CTAList from '@/ui/cta-list'
import Eyebrow from '@/ui/eyebrow'
import Img from '@/ui/img'

const defaultHighlights = [
	'Islamic calligraphy',
	'Layered acrylic',
	'Wood',
	'Architectural steel',
]

function GoldenSpiral() {
	return (
		<svg
			aria-hidden="true"
			className="absolute inset-0 size-full"
			viewBox="0 0 1440 760"
			preserveAspectRatio="xMidYMid slice"
		>
			<g fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke">
				<path d="M0 0h1440v760H0z" opacity=".16" />
				<path
					d="M890 0v760M0 470h1440M890 290h550M1100 0v290M1100 180h340M1310 180v110M1310 248h130"
					opacity=".19"
				/>
				<path
					d="M0 0c0 420 340 760 760 760 376 0 680-304 680-680M0 0c420 0 760 340 760 760M760 760c0-260 210-470 470-470 116 0 210 94 210 210M1230 290c0 116-94 210-210 210-72 0-130-58-130-130M890 370c0-44 36-80 80-80 28 0 50 22 50 50M1020 340c0 17-13 30-30 30"
					opacity=".42"
					strokeWidth="1.5"
				/>
				<path
					d="M0 0 1440 760M1440 0 0 760"
					opacity=".07"
					strokeDasharray="5 10"
				/>
			</g>
		</svg>
	)
}

export default function HeroGoldenSpiral({
	eyebrow,
	content = [],
	ctas,
	highlights,
	image,
	textAlign: _textAlign,
	verticalAlign: _verticalAlign,
	...props
}: HeroGoldenSpiral & { textAlign?: unknown; verticalAlign?: unknown }) {
	const items = highlights?.length
		? highlights.map((item) => item.title).filter(Boolean)
		: defaultHighlights

	return (
		<Module
			className="relative isolate overflow-hidden bg-[#102e27] text-[#fffaf0]"
			{...props}
		>
			{image?.asset && (
				<Img
					image={image}
					width={1920}
					alt={image.alt || ''}
					className="pointer-events-none absolute inset-0 -z-20 size-full object-cover opacity-45"
					priority
				/>
			)}
			<div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,28,23,.96)_0%,rgba(8,28,23,.78)_44%,rgba(8,28,23,.24)_100%)]" />
			<div className="pointer-events-none absolute inset-0 text-[#d4ad69]">
				<GoldenSpiral />
			</div>
			<div className="section relative flex min-h-[calc(100svh-4.25rem)] items-center py-20 sm:py-24 lg:py-28">
				<div className="max-w-3xl">
					<Eyebrow value={eyebrow} className="mb-6 text-[#d9b875]" />
					<div className="prose headings:font-[family-name:var(--font-cormorant)] headings:font-medium headings:tracking-[-.035em] [&_h1]:max-w-3xl [&_h1]:text-5xl [&_h1]:leading-[.94] [&_h1]:sm:text-7xl [&_h1]:lg:text-[5.75rem] [&_p]:max-w-xl [&_p]:text-base [&_p]:leading-7 [&_p]:text-white/72 [&_p]:sm:text-lg">
						<PortableText value={content} />
					</div>
					<CTAList
						ctas={ctas}
						className="mt-8 gap-3 max-sm:*:w-full [&_.action]:min-h-12 [&_.action]:rounded-full [&_.action]:bg-[#d4ad69] [&_.action]:px-6 [&_.action]:font-semibold [&_.action]:text-[#102e27] [&_.action-outline]:min-h-12 [&_.action-outline]:rounded-full [&_.action-outline]:border-white/35 [&_.action-outline]:bg-white/5 [&_.action-outline]:px-6 [&_.action-outline]:text-white"
					/>
					<ul
						aria-label="Materials and specialties"
						className="mt-12 grid max-w-3xl grid-cols-2 gap-x-7 gap-y-4 border-t border-[#d4ad69]/30 pt-6 text-xs font-semibold tracking-[.16em] text-white/68 uppercase sm:flex sm:flex-wrap sm:items-center sm:gap-7"
					>
						{items.map((item, index) => (
							<li
								key={`${item}-${index}`}
								className="flex items-center gap-2.5"
							>
								<span
									aria-hidden="true"
									className="size-1.5 rounded-full bg-[#d4ad69] shadow-[0_0_0_4px_rgba(212,173,105,.12)]"
								/>
								{item}
							</li>
						))}
					</ul>
				</div>
			</div>
		</Module>
	)
}
