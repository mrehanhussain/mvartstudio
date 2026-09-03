'use client'

import { stegaClean } from 'next-sanity'
import NextLink, { type LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import type { Link, Page } from '@/sanity/types'

export type SanityLinkType = Omit<Link, 'internal'> & {
	_type?: 'link'
	_key?: string
	internal?: Omit<Page, 'metadata'> & { slug: string }
}

export default function ({
	link,
	children,
	...props
}: { link?: SanityLinkType } & Omit<
	React.ComponentProps<typeof NextLink>,
	'href'
>) {
	const pathname = usePathname()
	const { label, type, internal, external, params } = link ?? {}
	const cleanLabel = stegaClean(label)
	const cleanInternalSlug = stegaClean(internal?.slug)
	// Keep quote-labelled CTAs aligned with the dedicated project brief instead
	// of dropping visitors into the shorter general-enquiry form.
	const internalSlug =
		cleanLabel === 'Request a Custom Quote' && cleanInternalSlug === '/contact'
			? '/custom-projects'
			: cleanInternalSlug

	const linkProps: Omit<LinkProps, 'href'> | React.ComponentProps<'a'> = {
		...props,
		'aria-current':
			type === 'internal' &&
			internalSlug &&
			normalizedPath(internalSlug) === normalizedPath(pathname)
				? 'page'
				: undefined,
		children:
			children ||
			cleanLabel ||
			stegaClean(internal?.title) ||
			stegaClean(external),
	}

	if (type === 'internal' && internalSlug)
		return (
			<NextLink
				href={[internalSlug, stegaClean(params)].filter(Boolean).join('')}
				{...linkProps}
			/>
		)

	if (type === 'external' && external)
		return <NextLink href={stegaClean(external)} {...linkProps} />

	return <span {...linkProps} />
}

function normalizedPath(value: string) {
	const path = value.split(/[?#]/)[0]?.replace(/\/$/, '')
	return path || '/'
}
