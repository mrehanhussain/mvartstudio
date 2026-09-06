import { cn } from '@/lib/utils'
import type { LinkList } from '@/sanity/types'
import SanityLink, { type SanityLinkType } from '@/ui/sanity-link'

export default function ({
	link,
	links,
	className,
	_type,
	_key,
	...props
}: LinkList & React.ComponentProps<'li'> & Partial<{ _key: string }>) {
	return (
		<li className={cn('footer-nav__col', className)} {...props}>
			{link && (
				<div className="footer-nav__heading">
					<SanityLink link={link as SanityLinkType} />
				</div>
			)}

			<ul className="footer-nav__links">
				{links?.map((item, i) => (
					<li key={`${item._key}-${i}`}>
						<SanityLink link={item as SanityLinkType} />
					</li>
				))}
			</ul>
		</li>
	)
}
