import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import {
	CATALOG_CATEGORIES_QUERY,
	CATALOG_PRODUCTS_QUERY,
	PRODUCT_CATEGORY_QUERY,
	type CatalogCategory,
	type CatalogProduct,
} from '@/lib/catalog'
import CatalogGrid from '@/modules/product-catalog/catalog-grid'
import {
	getDynamicFetchOptions,
	sanityFetch,
	sanityFetchMetadata,
	sanityFetchStaticParams,
	type DynamicFetchOptions,
} from '@/sanity/lib/live'
import Img from '@/ui/img'
import Loading from '@/ui/loading'

type Props = PageProps<'/collections/[category]'>

const BEST_SELLERS_SLUG = 'best-sellers'

export default async function Page({ params }: Props) {
	const { isEnabled } = await draftMode()
	if (isEnabled || process.env.NODE_ENV === 'development')
		return (
			<Suspense fallback={<Loading className="section" />}>
				<DynamicCategory params={params} />
			</Suspense>
		)
	const { category } = await params
	return (
		<CachedCategory
			categorySlug={category}
			perspective="published"
			stega={false}
		/>
	)
}

async function DynamicCategory({ params }: Pick<Props, 'params'>) {
	const [{ category }, options] = await Promise.all([
		params,
		getDynamicFetchOptions(),
	])
	return <CachedCategory categorySlug={category} {...options} />
}

async function CachedCategory({
	categorySlug,
	perspective,
	stega,
}: { categorySlug: string } & DynamicFetchOptions) {
	'use cache'
	const isBestSellers = categorySlug === BEST_SELLERS_SLUG
	const [categoryResult, categoriesResult] = await Promise.all([
		isBestSellers
			? Promise.resolve({ data: null })
			: sanityFetch({
					query: PRODUCT_CATEGORY_QUERY,
					params: { category: categorySlug },
					perspective,
					stega,
				}),
		sanityFetch({ query: CATALOG_CATEGORIES_QUERY, perspective, stega }),
	])
	const category = categoryResult.data as CatalogCategory | null
	if (!isBestSellers && !category) notFound()
	const productsResult = await sanityFetch({
		query: CATALOG_PRODUCTS_QUERY,
		params: {
			categoryId: category?._id || null,
			featuredOnly: isBestSellers,
		},
		perspective,
		stega,
	})
	const products = productsResult.data as CatalogProduct[]
	const title = isBestSellers ? 'Best Sellers' : category?.title
	const description = isBestSellers
		? 'Featured pieces from the studio — the work clients return to most often.'
		: category?.description
	const image = isBestSellers ? undefined : category?.image

	return (
		<main>
			<header className="relative isolate overflow-hidden bg-[#0f172a] text-[#f8fafc]">
				{image && (
					<Img
						image={image}
						alt={image.alt || ''}
						width={1800}
						loading="eager"
						className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35"
					/>
				)}
				<div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/85 to-transparent" />
				<div className="section py-20 md:py-28">
					<p className="text-accent mb-4 text-xs font-semibold tracking-[.24em] uppercase">
						{isBestSellers ? 'Featured work' : 'The collection'}
					</p>
					<h1 className="max-w-3xl text-5xl leading-none md:text-7xl">
						{title}
					</h1>
					{description && (
						<p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
							{description}
						</p>
					)}
				</div>
			</header>
			<section className="section space-y-8">
				<div className="flex flex-wrap items-end justify-between gap-4">
					<div>
						<p className="text-primary text-xs font-semibold tracking-[.18em] uppercase">
							Browse the work
						</p>
						<h2 className="mt-2 text-4xl">
							{products.length} {products.length === 1 ? 'piece' : 'pieces'}
						</h2>
					</div>
					<a href="/collections" className="action-outline rounded-full">
						View all collections
					</a>
				</div>
				<CatalogGrid
					products={products}
					categories={categoriesResult.data as CatalogCategory[]}
					showMaterialFilter
				/>
			</section>
		</main>
	)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const [{ category }, { perspective }] = await Promise.all([
		params,
		getDynamicFetchOptions(),
	])
	if (category === BEST_SELLERS_SLUG) {
		return {
			title: 'Best Sellers | MV Art Studio',
			description:
				'Featured Islamic calligraphy, wall art, and signage from MV Art Studio.',
			alternates: { canonical: '/collections/best-sellers' },
			openGraph: {
				type: 'website',
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/collections/best-sellers`,
			},
		}
	}
	const data = (await sanityFetchMetadata({
		query: PRODUCT_CATEGORY_QUERY,
		params: { category },
		perspective,
	})) as any
	return {
		title: data?.metadata?.title || data?.title,
		description: data?.metadata?.description || data?.description,
		alternates: { canonical: `/collections/${category}` },
		openGraph: {
			type: 'website',
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/collections/${category}`,
		},
	}
}

export async function generateStaticParams() {
	const categories = (await sanityFetchStaticParams({
		query: CATALOG_CATEGORIES_QUERY,
	})) as CatalogCategory[]
	const params = [{ category: BEST_SELLERS_SLUG }]
	if (categories.length) {
		params.push(...categories.map(({ slug }) => ({ category: slug || '' })))
	} else {
		params.push({ category: '__placeholder__' })
	}
	return params
}
