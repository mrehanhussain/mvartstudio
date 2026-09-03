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
				className="relative block aspect-[4/5] overflow-hidden rounded-[1.35rem] bg-[#e9e1d4] shadow-[0_16px_45px_rgba(35,28,18,.08)]"
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
						<span className="rounded-full bg-[#173f35] px-3 py-1.5 text-[10px] font-bold tracking-[.16em] text-white uppercase shadow-sm">
							Featured
						</span>
					) : (
						<span />
					)}
					{imageCount > 1 && (
						<span className="inline-flex items-center gap-1.5 rounded-full bg-[#fffaf0]/90 px-2.5 py-1.5 text-[11px] font-semibold text-[#211d18] shadow-sm backdrop-blur-sm">
							<PiImages aria-hidden="true" className="size-4" />
							{imageCount}
						</span>
					)}
				</div>
				<span className="absolute right-4 bottom-4 grid size-10 translate-y-2 place-items-center rounded-full bg-[#fffaf0] text-[#173f35] opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
					<PiArrowUpRight aria-hidden="true" className="size-5" />
					<span className="sr-only">View {product.title}</span>
				</span>
			</Link>
			<div className="flex flex-1 flex-col gap-2 px-1 pt-3 pb-2 sm:pt-5">
				<div className="flex items-center justify-between gap-3 text-[10px] font-semibold tracking-[.08em] text-[#765523] sm:text-[11px]">
					<span>{product.category?.title}</span>
					{product.materials?.[0] && (
							<span className="hidden text-black/60 sm:inline">{product.materials[0]}</span>
					)}
				</div>
				<h3 className="text-[1.2rem] leading-[1.08] text-[#211d18] sm:text-[1.7rem]">
					<Link
						href={href}
						className="text-inherit no-underline decoration-[#b58a48] decoration-1 underline-offset-4 group-hover:underline"
					>
						{product.title}
					</Link>
				</h3>
				{product.shortDescription && (
					<p className="hidden line-clamp-2 text-sm leading-6 text-black/60 sm:block">
						{product.shortDescription}
					</p>
				)}
				<div className="mt-auto flex items-end justify-between gap-2 border-t border-black/10 pt-3 text-xs sm:gap-4 sm:text-sm">
					<span className="text-black/60">
						{availabilityLabels[product.availability || ''] ||
							'Enquire for availability'}
					</span>
					{product.displayPrice && (
						<strong className="text-[#173f35]">{product.displayPrice}</strong>
					)}
				</div>
			</div>
		</article>
	)
}
