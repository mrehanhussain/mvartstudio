import Link from 'next/link'
import { PiArrowRight } from 'react-icons/pi'
import Img from '@/ui/img'

export function MegaMenuPanel({ children }: { children: React.ReactNode }) {
	return (
		<div className="md:rounded-panel md:border-border-subtle text-foreground md:bg-surface-raised/98 z-20 mt-2 overflow-hidden text-left max-md:mx-0 max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none max-md:backdrop-blur-none md:absolute md:inset-x-4 md:top-full md:mx-auto md:w-auto md:max-w-5xl md:border md:p-3 md:shadow-[0_28px_80px_rgba(0,0,0,.24)] md:backdrop-blur-2xl">
			{children}
		</div>
	)
}

export function MegaMenuCard({
	href,
	image,
	eyebrow,
	title,
}: {
	href: string
	image?: any
	eyebrow: string
	title: string
}) {
	return (
		<Link
			href={href}
			className="group rounded-card bg-art-backdrop relative min-h-36 overflow-hidden"
		>
			{image?.asset && (
				<Img
					image={image}
					alt=""
					width={520}
					className="absolute inset-0 !size-full !max-h-none object-cover transition-opacity duration-300 group-hover:opacity-90"
				/>
			)}
			<span className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/25 to-transparent" />
			<span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white">
				<span>
					<span className="text-accent block text-[9px] font-bold tracking-[.17em] uppercase">
						{eyebrow}
					</span>
					<span className="mt-1 block text-lg leading-tight font-semibold">
						{title}
					</span>
				</span>
				<PiArrowRight
					aria-hidden="true"
					className="size-5 shrink-0 transition group-hover:translate-x-1"
				/>
			</span>
		</Link>
	)
}

export function MegaMenuFooterLink({
	href,
	icon,
	children,
}: {
	href: string
	icon: React.ReactNode
	children: React.ReactNode
}) {
	return (
		<Link
			href={href}
			className="border-border-subtle rounded-control bg-surface/65 hover:bg-surface flex items-center justify-between border px-4 py-3 text-sm font-semibold transition"
		>
			<span className="flex items-center gap-2">
				{icon}
				{children}
			</span>
			<PiArrowRight aria-hidden="true" className="size-4" />
		</Link>
	)
}
