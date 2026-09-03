import { stegaClean } from 'next-sanity'
import { cn } from '@/lib/utils'

export default function ({
	value,
	className,
	...props
}: { value?: string } & React.ComponentProps<'p'>) {
	if (!value) return null

	return (
		<p
			className={cn(
				'eyebrow text-sm font-semibold tracking-[.08em] text-current/70',
				className,
			)}
			{...props}
		>
			{stegaClean(value)}
		</p>
	)
}
