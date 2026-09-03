import { stegaClean } from 'next-sanity'
import NextLink, { type LinkProps } from 'next/link'
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
