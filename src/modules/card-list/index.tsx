import { PortableText, stegaClean } from 'next-sanity'
import {
	PiBuildings,
	PiDoorOpen,
	PiMoonStars,
	PiShapes,
	PiSignpost,
	PiStorefront,
} from 'react-icons/pi'
import { cn } from '@/lib/utils'
import { Module } from '@/modules'
import type { CardList } from '@/sanity/types'
import CTAList from '@/ui/cta-list'
import Eyebrow from '@/ui/eyebrow'
import Img from '@/ui/img'

const SIGNAGE_ICONS = [
	PiBuildings,
	PiDoorOpen,
	PiSignpost,
	PiMoonStars,
	PiStorefront,
	PiShapes,
]

export default function ({
	eyebrow,
	intro,
	cards,
	ctas,
	layout: l = 'grid',
	columns,
	...props
}: CardList) {
	const layout = stegaClean(l)
	const isSignageSolutions = props.attributes?.uid === 'signage-solutions'

	return (
		<Module className="section space-y-8" {...props}>
			{(eyebrow || intro) && (
				<header className="prose mx-auto max-w-3xl text-center">
					<Eyebrow value={eyebrow} />
					<PortableText value={intro ?? []} />
				</header>
			)}

			{!!cards?.length && (
				<div
					className={cn(
						'grid gap-8',
						layout === 'carousel'
							? 'carousel carousel-scroll-buttons carousel-scroll-marker max-md:full-bleed auto-rows-fr pb-2 max-md:px-4 md:mask-r-from-[calc(100%-2rem)] md:pr-4'
							: [
									'md:auto-rows-fr',
									columns
										? 'lg:grid-cols-[repeat(var(--columns,1),minmax(0px,1fr))]'
										: 'lg:grid-cols-[repeat(auto-fit,minmax(var(--container-3xs),1fr))]',
								],
					)}
					style={{ '--columns': columns }}
				>
					{cards.map((item, i) => {
						const SignageIcon = isSignageSolutions
							? SIGNAGE_ICONS[i % SIGNAGE_ICONS.length]
							: null

						return (
							<article
								key={`${item._key}-${i}`}
								className={cn(
									'prose',
									isSignageSolutions &&
										'group rounded-card border-border-subtle bg-surface/45 hover:border-border-accent hover:bg-surface border p-6 transition-[background-color,border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_color-mix(in_oklab,var(--color-foreground)_8%,transparent)]',
								)}
							>
								{SignageIcon && (
									<div className="rounded-card border-border-accent bg-primary/10 text-primary mb-6 grid size-12 place-items-center border transition-transform duration-300 group-hover:scale-105">
										<SignageIcon className="size-6" aria-hidden="true" />
									</div>
								)}
								{(item.image || item.icon) && (
									<figure>
										<Img
											className="w-full object-cover"
											image={item.image}
											width={1000}
											alt=""
										/>
										<Img
											className="h-12 w-auto object-cover"
											image={item.icon}
											width={120}
											alt=""
										/>
									</figure>
								)}

								<Eyebrow value={item.eyebrow} />

								<PortableText
									value={item.content ?? []}
									components={{
										types: {
											image: ({ value }) => (
												<figure>
													<Img
														className="mx-auto w-full"
														image={value}
														width={1000}
														alt={value.alt ?? ''}
													/>
												</figure>
											),
										},
									}}
								/>

								<CTAList ctas={item.ctas} className="max-sm:*:w-full" />
							</article>
						)
					})}
				</div>
			)}

			<CTAList ctas={ctas} className="justify-center max-sm:*:w-full" />
		</Module>
	)
}
