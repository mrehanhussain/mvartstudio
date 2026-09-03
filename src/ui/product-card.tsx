import Link from 'next/link'
import { PiArrowUpRight, PiImages } from 'react-icons/pi'
import type { CatalogProduct } from '@/lib/catalog'
import Img from '@/ui/img'

const availabilityLabels: Record<string, string> = {
	'made-to-order': 'Made to order',
	'ready-to-ship': 'Ready to ship',
	'custom-enquiry': 'Custom enquiry',
}

export default function ProductCard({ product }: { product: CatalogProduct }) {
	const href = `/collections/${product.category?.slug}/${product.slug}`
	const image = product.gallery?.[0]
	const alternateImage = product.gallery?.[1]
	const imageCount = product.gallery?.length || 0

	return (
		<article className="group flex h-full flex-col">
			<Link
				href={href}
				className="rounded-card bg-art-backdrop relative block aspect-[4/5] overflow-hidden shadow-[0_16px_45px_rgba(0,0,0,.12)]"
			>
				<Img
					image={image}
					alt={image?.alt || product.title || ''}
					width={900}
					className="size-full object-cover transition-opacity duration-300 ease-out"
				/>
				{alternateImage && (
					<Img
						image={alternateImage}
						alt=""
						width={900}
						className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:hidden"
					/>
				)}
				<div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
					{product.featured ? (
						<span className="bg-brand-green rounded-full px-3 py-1.5 text-[10px] font-bold tracking-[.16em] text-white uppercase shadow-sm">
							Featured
						</span>
					) : (
						<span />
					)}
					{imageCount > 1 && (
						<span className="bg-surface-raised/90 text-foreground inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold shadow-sm backdrop-blur-sm">
							<PiImages aria-hidden="true" className="size-4" />
							{imageCount}
						</span>
					)}
				</div>
				<span className="bg-surface-raised text-primary absolute right-4 bottom-4 grid size-10 translate-y-2 place-items-center rounded-full opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
					<PiArrowUpRight aria-hidden="true" className="size-5" />
					<span className="sr-only">View {product.title}</span>
				</span>
			</Link>
			<div className="flex flex-1 flex-col gap-2 px-1 pt-3 pb-2 sm:pt-5">
				<div className="text-primary flex items-center justify-between gap-3 text-[10px] font-semibold tracking-[.08em] sm:text-[11px]">
					<span>{product.category?.title}</span>
					{product.materials?.[0] && (
						<span className="text-muted-foreground hidden sm:inline">
							{product.materials[0]}
						</span>
					)}
				</div>
				<h3 className="text-foreground text-[1.2rem] leading-[1.08] sm:text-[1.7rem]">
					<Link
						href={href}
						className="decoration-accent text-inherit no-underline decoration-1 underline-offset-4 group-hover:underline"
					>
						{product.title}
					</Link>
				</h3>
				{product.shortDescription && (
					<p className="text-muted-foreground line-clamp-2 hidden text-sm leading-6 sm:block">
						{product.shortDescription}
					</p>
				)}
				<div className="border-border-subtle mt-auto flex items-end justify-between gap-2 border-t pt-3 text-xs sm:gap-4 sm:text-sm">
					<span className="text-muted-foreground">
						{availabilityLabels[product.availability || ''] ||
							'Enquire for availability'}
					</span>
					{product.displayPrice && (
						<strong className="text-primary">{product.displayPrice}</strong>
					)}
				</div>
			</div>
		</article>
	)
}
