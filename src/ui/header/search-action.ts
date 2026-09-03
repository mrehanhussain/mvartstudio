'use server'

import { groq } from 'next-sanity'
import {
	getDynamicFetchOptions,
	sanityFetch,
	type DynamicFetchOptions,
} from '@/sanity/lib/live'

export type HeaderSearchResult = {
	_id: string
	type: 'product' | 'page' | 'blog.post'
	title: string
	href: string
	kicker?: string
	imageUrl?: string
}

export async function headerSearchAction(
	input: string,
): Promise<HeaderSearchResult[]> {
	const query = input.trim().slice(0, 80)
	if (query.length < 2) return []

	const options = await getDynamicFetchOptions()
	return cachedHeaderSearch(query, options)
}

async function cachedHeaderSearch(
	query: string,
	{ perspective, stega }: DynamicFetchOptions,
) {
	'use cache'
	const { data } = await sanityFetch({
		query: HEADER_SEARCH_QUERY,
		params: { term: query },
		perspective,
		stega,
	})

	return data as HeaderSearchResult[]
}

const HEADER_SEARCH_QUERY = groq`
	*[
		_type in ['product', 'page', 'blog.post']
		&& (
			(_type == 'product' && defined(slug.current)) ||
			(_type != 'product' && defined(metadata.slug.current) && metadata.noIndex != true)
		)
		&& @ match text::query($term)
	] | score(
		title match text::query($term),
		shortDescription match text::query($term),
		description match text::query($term)
	) | order(_score desc)[0...8] {
		_id,
		'type': _type,
		title,
		'href': select(
			_type == 'product' => '/collections/' + category->slug.current + '/' + slug.current,
			_type == 'blog.post' => '/blog/' + metadata.slug.current,
			metadata.slug.current == 'index' => '/',
			'/' + metadata.slug.current
		),
		'kicker': select(
			_type == 'product' => category->title,
			_type == 'blog.post' => 'Journal',
			'Page'
		),
		'imageUrl': select(
			_type == 'product' => gallery[0].asset->url,
			metadata.image.asset->url
		)
	}
`
