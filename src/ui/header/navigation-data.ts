import {
	CATALOG_CATEGORIES_QUERY,
	CUSTOM_MENU_IMAGES_QUERY,
	type CatalogCategory,
} from '@/lib/catalog'
import { sanityFetch, type DynamicFetchOptions } from '@/sanity/lib/live'
import { getSite } from '@/sanity/lib/queries'
import type { SITE_QUERY_RESULT } from '@/sanity/types'
import type { CustomMenuImages } from './custom-menu'

export async function getNavigationData({
	perspective,
	stega,
}: DynamicFetchOptions): Promise<{
	site: SITE_QUERY_RESULT
	categories: CatalogCategory[]
	customImages: CustomMenuImages
}> {
	'use cache'
	const [site, categoriesResult, customImagesResult] = await Promise.all([
		getSite({ perspective, stega }),
		sanityFetch({
			query: CATALOG_CATEGORIES_QUERY,
			params: {},
			perspective,
			stega,
		}),
		sanityFetch({
			query: CUSTOM_MENU_IMAGES_QUERY,
			params: {},
			perspective,
			stega,
		}),
	])

	return {
		site,
		categories: categoriesResult.data as CatalogCategory[],
		customImages: customImagesResult.data as CustomMenuImages,
	}
}
