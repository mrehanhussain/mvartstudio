import { groq } from 'next-sanity'

export type CatalogCategory = {
	_id: string
	title?: string
	slug?: string
	description?: string
	image?: any
	materials?: string[]
}

export type CatalogProduct = {
	_id: string
	title?: string
	slug?: string
	shortDescription?: string
	sku?: string
	displayPrice?: string
	availability?: string
	featured?: boolean
	materials?: string[]
	finishes?: string[]
	dimensions?: Array<{ _key: string; label?: string; value?: string }>
	gallery?: any[]
	description?: any[]
	metadata?: any
	category?: CatalogCategory
}

export const CATALOG_PRODUCTS_QUERY = groq`
	*[
		_type == 'product'
		&& (!defined($categoryId) || category._ref == $categoryId)
		&& (!$featuredOnly || featured == true)
	]|order(coalesce(displayOrder, 100) asc, title asc){
		_id, title, 'slug': slug.current, shortDescription, sku, displayPrice,
		availability, featured, materials, finishes, dimensions,
		gallery[]{ ..., asset->{ ..., metadata } },
		category->{ _id, title, 'slug': slug.current }
	}
`

export const CATALOG_CATEGORIES_QUERY = groq`
	*[_type == 'product.category']|order(coalesce(displayOrder, 100) asc, title asc){
		_id, title, 'slug': slug.current, description, materials,
		'image': coalesce(
			image,
			*[_type == 'product' && category._ref == ^._id && defined(gallery[0].asset)]|order(coalesce(displayOrder, 100) asc)[0].gallery[0]
		){ ..., asset->{ ..., metadata } }
	}
`

export const PRODUCT_CATEGORY_QUERY = groq`
	*[_type == 'product.category' && slug.current == $category][0]{
		_id, title, 'slug': slug.current, eyebrow, description, materials, metadata,
		image{ ..., asset->{ ..., metadata } }
	}
`

export const PRODUCT_DETAIL_QUERY = groq`
	*[
		_type == 'product'
		&& slug.current == $product
		&& category._ref in *[_type == 'product.category' && slug.current == $category]._id
	][0]{
		_id, title, 'slug': slug.current, shortDescription, description, sku,
		displayPrice, availability, featured, materials, finishes, dimensions, metadata,
		gallery[]{ ..., asset->{ ..., metadata } },
		category->{ _id, title, 'slug': slug.current, description },
		'related': *[_type == 'product' && category._ref == ^.category._ref && _id != ^._id]
			|order(featured desc, coalesce(displayOrder, 100) asc)[0...4]{
				_id, title, 'slug': slug.current, shortDescription, displayPrice,
				availability, materials, gallery[0]{ ..., asset->{ ..., metadata } },
				category->{ _id, title, 'slug': slug.current }
			}
	}
`

export const PRODUCT_STATIC_PARAMS_QUERY = groq`
	*[_type == 'product' && defined(slug.current) && defined(category->slug.current)]{
		'category': category->slug.current,
		'product': slug.current
	}
`

export const CUSTOM_MENU_IMAGES_QUERY = groq`{
	'namePlates': *[_type == 'page' && metadata.slug.current == 'custom-projects/name-plates'][0]
		.modules[_type == 'hero.split' && defined(image.asset)][0].image{ ..., asset->{ ..., metadata } },
	'memorials': *[_type == 'page' && metadata.slug.current == 'custom-projects/memorials'][0]
		.modules[_type == 'hero.split' && defined(image.asset)][0].image{ ..., asset->{ ..., metadata } },
	'signage': *[_type == 'page' && metadata.slug.current == 'commercial-signage'][0]
		.modules[_type == 'hero.cover' && defined(image.asset)][0].image{ ..., asset->{ ..., metadata } },
	'calligraphy': *[_type == 'product' && slug.current == 'ayatul-kursi-halo'][0]
		.gallery[0]{ ..., asset->{ ..., metadata } }
}`
