import { PortableText } from 'next-sanity'
import type { Get } from '@sanity/codegen'
import type { CatalogCategory, CatalogProduct } from '@/lib/catalog'
import { CATALOG_CATEGORIES_QUERY, CATALOG_PRODUCTS_QUERY } from '@/lib/catalog'
import { Module, type ModuleProps } from '@/modules'
import { sanityFetch, type DynamicFetchOptions } from '@/sanity/lib/live'
import type { PAGE_QUERY_RESULT } from '@/sanity/types'
import Eyebrow from '@/ui/eyebrow'
import CatalogGrid from './catalog-grid'

type ProductCatalogModule = Extract<Get<PAGE_QUERY_RESULT, 'modules', 0>, { _type: 'product-catalog' }>

export default async function ProductCatalog({ eyebrow, intro, category, featuredOnly = false, limit = 12, layout, showCategoryFilter, showMaterialFilter, perspective, stega, ...props }: ProductCatalogModule & ModuleProps & DynamicFetchOptions) {
	const { products, categories } = await getCatalog({ categoryId: category?._ref, featuredOnly, perspective, stega })
	return (
		<Module className="section space-y-8" {...props}>
			{(eyebrow || intro) && <header className="prose mx-auto max-w-3xl text-center"><Eyebrow value={eyebrow} /><PortableText value={intro || []} /></header>}
			<CatalogGrid products={products.slice(0, limit || 12)} categories={categories} layout={layout} showCategoryFilter={!category && showCategoryFilter} showMaterialFilter={showMaterialFilter} />
		</Module>
	)
}

async function getCatalog({ categoryId, featuredOnly, perspective, stega }: { categoryId?: string; featuredOnly: boolean } & DynamicFetchOptions) {
	'use cache'
	const params = { categoryId: categoryId || null, featuredOnly }
	const [productResult, categoryResult] = await Promise.all([
		sanityFetch({ query: CATALOG_PRODUCTS_QUERY, params, perspective, stega }),
		sanityFetch({ query: CATALOG_CATEGORIES_QUERY, perspective, stega }),
	])
	return { products: productResult.data as CatalogProduct[], categories: categoryResult.data as CatalogCategory[] }
}
