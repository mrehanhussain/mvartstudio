import type { Metadata } from 'next'
import { PortableText } from 'next-sanity'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { PiCube, PiPackage, PiRuler } from 'react-icons/pi'
import {
	PRODUCT_DETAIL_QUERY,
	PRODUCT_STATIC_PARAMS_QUERY,
	type CatalogProduct,
} from '@/lib/catalog'
import {
	getDynamicFetchOptions,
	sanityFetch,
	sanityFetchMetadata,
	sanityFetchStaticParams,
	type DynamicFetchOptions,
} from '@/sanity/lib/live'
import Loading from '@/ui/loading'
import ProductActionBar from '@/ui/product-action-bar'
import ProductCard from '@/ui/product-card'
import ProductGallery from '@/ui/product-gallery'

type Props = PageProps<'/collections/[category]/[product]'>
type ProductDetail = CatalogProduct & { related?: CatalogProduct[] }

export default async function Page({ params }: Props) {
	const { isEnabled } = await draftMode()
	if (isEnabled || process.env.NODE_ENV === 'development')
		return (
			<Suspense fallback={<Loading className="section" />}>
				<DynamicProduct params={params} />
			</Suspense>
		)
	const { category, product } = await params
	return (
		<CachedProduct
			category={category}
			product={product}
			perspective="published"
			stega={false}
		/>
	)
}

async function DynamicProduct({ params }: Pick<Props, 'params'>) {
	const [{ category, product }, options] = await Promise.all([
		params,
		getDynamicFetchOptions(),
	])
	return <CachedProduct category={category} product={product} {...options} />
}

async function CachedProduct({
	category,
	product,
	perspective,
	stega,
}: { category: string; product: string } & DynamicFetchOptions) {
	'use cache'
	const { data } = await sanityFetch({
		query: PRODUCT_DETAIL_QUERY,
		params: { category, product },
		perspective,
		stega,
	})
	const item = data as ProductDetail | null
	if (!item) notFound()
	const availability = item.availability?.replaceAll('-', ' ')
	const productJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: item.title,
		description: item.shortDescription,
		sku: item.sku,
		category: item.category?.title,
	}

	return (
		<main className="pb-28 lg:pb-10">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
			/>
			<nav
				aria-label="Breadcrumb"
				className="section flex flex-wrap items-center gap-2 py-5 text-xs text-black/60 sm:text-sm"
			>
				<Link href="/collections" className="transition hover:text-[#80602b]">
					Collections
				</Link>
				<span aria-hidden="true">/</span>
				<Link
					href={`/collections/${item.category?.slug}`}
					className="transition hover:text-[#80602b]"
				>
					{item.category?.title}
				</Link>
				<span aria-hidden="true">/</span>
				<span className="text-black/75">{item.title}</span>
			</nav>
			<section className="section grid items-start gap-10 pt-2 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,.75fr)] lg:gap-14 xl:gap-20">
				<ProductGallery images={item.gallery} title={item.title || 'Product'} />
				<div className="self-start lg:sticky lg:top-24">
					<div className="flex flex-wrap items-center gap-3">
						<p className="text-xs font-bold tracking-[.2em] text-[#765523] uppercase">
							{item.category?.title}
						</p>
						{availability && (
							<span className="rounded-full bg-[#173f35]/8 px-3 py-1 text-[11px] font-semibold text-[#173f35] capitalize">
								{availability}
							</span>
						)}
					</div>
					<h1 className="mt-4 text-5xl leading-[.94] tracking-[-.035em] text-[#211d18] md:text-6xl">
						{item.title}
					</h1>
					{item.displayPrice && (
						<p className="mt-5 text-xl font-bold text-[#173f35]">
							{item.displayPrice}
						</p>
					)}
					{item.shortDescription && (
						<p className="mt-6 text-base leading-7 text-black/62 sm:text-lg sm:leading-8">
							{item.shortDescription}
						</p>
					)}

					<div className="mt-8 rounded-[1.35rem] border border-black/10 bg-white/60 p-5 shadow-[0_16px_45px_rgba(35,28,18,.055)]">
						<p className="text-xs font-bold tracking-[.16em] text-[#211d18] uppercase">
							Made for your space
						</p>
						{!!item.dimensions?.length && (
							<div className="mt-5">
								<p className="mb-2 text-xs font-semibold text-black/60">
									Available sizes
								</p>
								<div className="flex flex-wrap gap-2">
									{item.dimensions.map((size) => (
										<span
											key={size._key}
											className="rounded-full border border-[#765523]/25 bg-[#f5ecdd] px-3 py-2 text-xs font-semibold text-[#5f4825]"
										>
											{size.label}: {size.value}
										</span>
									))}
								</div>
							</div>
						)}
						{!!item.materials?.length && (
							<div className="mt-5">
								<p className="mb-2 text-xs font-semibold text-black/60">
									Materials
								</p>
								<div className="flex flex-wrap gap-2">
									{item.materials.map((material) => (
										<span
											key={material}
											className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-[#211d18]"
										>
											{material}
										</span>
									))}
								</div>
							</div>
						)}
						{!!item.finishes?.length && (
							<div className="mt-5">
								<p className="mb-2 text-xs font-semibold text-black/60">
									Finish options
								</p>
								<div className="flex flex-wrap gap-2">
									{item.finishes.map((finish) => (
										<span
											key={finish}
											className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-[#211d18]"
										>
											{finish}
										</span>
									))}
								</div>
							</div>
						)}
					</div>

					<div className="mt-6 grid gap-3">
						<Link
							href={`/custom-projects?product=${encodeURIComponent(item.title || '')}`}
							className="action min-h-13 rounded-full px-6 py-3.5 text-sm font-semibold"
						>
							Request a quote for this piece
						</Link>
						<Link
							href="/contact"
							className="action-outline min-h-13 rounded-full px-6 py-3.5 text-sm font-semibold"
						>
							Ask a general question
						</Link>
					</div>
					<div className="mt-7 grid grid-cols-3 divide-x divide-black/10 border-y border-black/10 py-5 text-center text-[11px] leading-4 font-semibold text-black/60">
						<div className="px-2">
							<PiRuler
								aria-hidden="true"
								className="mx-auto mb-2 size-5 text-[#765523]"
							/>
							Made to measure
						</div>
						<div className="px-2">
							<PiCube
								aria-hidden="true"
								className="mx-auto mb-2 size-5 text-[#765523]"
							/>
							Material guidance
						</div>
						<div className="px-2">
							<PiPackage
								aria-hidden="true"
								className="mx-auto mb-2 size-5 text-[#765523]"
							/>
							Ready to install
						</div>
					</div>
				</div>
			</section>

			<section className="section mt-8 grid gap-10 border-t border-black/10 pt-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-20">
				<div>
					{item.description && (
						<>
							<p className="text-xs font-bold tracking-[.2em] text-[#765523] uppercase">
								The piece
							</p>
							<div className="prose mt-4 max-w-3xl text-black/65">
								<PortableText value={item.description} />
							</div>
						</>
					)}
				</div>
				<div className="divide-y divide-black/10 border-y border-black/10">
					<details open className="group">
						<summary className="flex list-none items-center justify-between py-4 text-sm font-bold text-[#211d18]">
							Specifications
							<span
								aria-hidden="true"
								className="text-xl font-light transition group-open:rotate-45"
							>
								+
							</span>
						</summary>
						<dl className="space-y-3 pb-5 text-sm">
							{item.sku && (
								<div className="flex justify-between gap-4">
									<dt className="text-black/60">SKU</dt>
									<dd>{item.sku}</dd>
								</div>
							)}
							{availability && (
								<div className="flex justify-between gap-4">
									<dt className="text-black/60">Availability</dt>
									<dd className="capitalize">{availability}</dd>
								</div>
							)}
							{!!item.materials?.length && (
								<div className="flex justify-between gap-4">
									<dt className="text-black/60">Materials</dt>
									<dd className="text-right">{item.materials.join(', ')}</dd>
								</div>
							)}
						</dl>
					</details>
					<details className="group">
						<summary className="flex list-none items-center justify-between py-4 text-sm font-bold text-[#211d18]">
							Customisation
							<span
								aria-hidden="true"
								className="text-xl font-light transition group-open:rotate-45"
							>
								+
							</span>
						</summary>
						<p className="pb-5 text-sm leading-6 text-black/58">
							Most pieces can be adapted in scale, material, colour, and
							mounting approach. Share a wall photo and approximate dimensions
							when requesting a quote.
						</p>
					</details>
					<details className="group">
						<summary className="flex list-none items-center justify-between py-4 text-sm font-bold text-[#211d18]">
							Installation
							<span
								aria-hidden="true"
								className="text-xl font-light transition group-open:rotate-45"
							>
								+
							</span>
						</summary>
						<p className="pb-5 text-sm leading-6 text-black/58">
							Your mounting approach is confirmed before fabrication, with
							hardware and installation guidance prepared for the finished
							piece.
						</p>
					</details>
				</div>
			</section>
			{!!item.related?.length && (
				<section className="section space-y-8 pt-14">
					<div className="flex flex-wrap items-end justify-between gap-4">
						<div>
							<p className="text-xs font-bold tracking-[.2em] text-[#765523] uppercase">
								Continue exploring
							</p>
							<h2 className="mt-2 text-4xl tracking-[-.025em]">
								Related pieces
							</h2>
						</div>
						<Link
							href={`/collections/${item.category?.slug}`}
							className="text-sm font-semibold text-[#80602b] underline decoration-[#d4ad69] underline-offset-4"
						>
							View the collection
						</Link>
					</div>
					<div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
						{item.related.map((related) => (
							<ProductCard key={related._id} product={related} />
						))}
					</div>
				</section>
			)}
			<ProductActionBar
				productId={item._id}
				title={item.title || 'this piece'}
				quoteHref={
					'/custom-projects?product=' + encodeURIComponent(item.title || '')
				}
			/>
		</main>
	)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const [{ category, product }, { perspective }] = await Promise.all([
		params,
		getDynamicFetchOptions(),
	])
	const data = (await sanityFetchMetadata({
		query: PRODUCT_DETAIL_QUERY,
		params: { category, product },
		perspective,
	})) as ProductDetail | null
	return {
		title: data?.metadata?.title || data?.title,
		description: data?.metadata?.description || data?.shortDescription,
		alternates: {
			canonical: `/collections/${category}/${product}`,
		},
		openGraph: {
			type: 'website',
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/collections/${category}/${product}`,
		},
	}
}

export async function generateStaticParams() {
	const products = (await sanityFetchStaticParams({
		query: PRODUCT_STATIC_PARAMS_QUERY,
	})) as Array<{ category: string; product: string }>
	return products.length
		? products
		: [{ category: '__placeholder__', product: '__placeholder__' }]
}
