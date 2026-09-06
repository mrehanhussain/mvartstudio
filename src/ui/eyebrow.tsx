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
				'eyebrow text-accent text-sm font-semibold tracking-[.08em]',
				className,
			)}
			{...props}
		>
			{stegaClean(value)}
		</p>
	)
}
