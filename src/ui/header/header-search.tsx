'use client'

import Image from 'next/image'
import Link from 'next/link'
import { startTransition, useEffect, useId, useRef, useState } from 'react'
import {
	PiArrowUpRight,
	PiMagnifyingGlass,
	PiSpinnerGap,
	PiX,
} from 'react-icons/pi'
import { cn } from '@/lib/utils'
import useDialogFocus from '@/ui/use-dialog-focus'
import { headerSearchAction, type HeaderSearchResult } from './search-action'

export default function HeaderSearch({
	className,
	mode,
}: {
	className?: string
	mode: 'mobile' | 'desktop'
}) {
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState('')
	const [results, setResults] = useState<HeaderSearchResult[]>([])
	const [loading, setLoading] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const dialogRef = useRef<HTMLDivElement>(null)
	const titleId = useId()
	const inputId = titleId + '-input'

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			const activeMode = window.matchMedia('(min-width: 48rem)').matches
				? 'desktop'
				: 'mobile'
			if (activeMode !== mode) return
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
				event.preventDefault()
				setOpen(true)
			}
		}
		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [mode])

	useDialogFocus(open, () => setOpen(false), dialogRef, inputRef)

	useEffect(() => {
		if (!open || query.trim().length < 2) {
			setResults([])
			setLoading(false)
			return
		}
		setLoading(true)
		const timer = window.setTimeout(() => {
			startTransition(async () => {
				const nextResults = await headerSearchAction(query)
				setResults(nextResults)
				setLoading(false)
			})
		}, 250)
		return () => window.clearTimeout(timer)
	}, [open, query])

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className={cn(
					'text-foreground hover:bg-foreground/5 focus-visible:outline-primary grid size-11 place-items-center rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2',
					className,
				)}
				aria-label="Search products and pages"
			>
				<PiMagnifyingGlass aria-hidden="true" className="size-5" />
			</button>

			{open && (
				<div
					className="fixed inset-0 z-[100] flex items-start justify-center bg-[#0d211c]/42 px-4 pt-[max(1rem,8vh)] backdrop-blur-md"
					role="dialog"
					aria-modal="true"
					aria-labelledby={titleId}
					onMouseDown={(event) => {
						if (event.target === event.currentTarget) setOpen(false)
					}}
				>
					<div
						ref={dialogRef}
						className="border-border-inverse-strong rounded-panel bg-surface-raised/96 w-full max-w-3xl overflow-hidden border shadow-[0_35px_100px_rgba(0,0,0,.34)]"
					>
						<div className="border-border-subtle flex items-center gap-3 border-b px-5 py-4 sm:px-7">
							<PiMagnifyingGlass
								aria-hidden="true"
								className="text-primary size-6 shrink-0"
							/>
							<label className="sr-only" htmlFor={inputId}>
								Search the MV Art Studio catalog
							</label>
							<input
								ref={inputRef}
								id={inputId}
								type="search"
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder="Search calligraphy, steel signs, acrylic…"
								className="text-foreground placeholder:text-foreground/35 min-w-0 flex-1 bg-transparent py-2 text-lg outline-none sm:text-xl"
							/>
							{loading && (
								<PiSpinnerGap
									aria-label="Searching"
									className="text-primary size-5 animate-spin"
								/>
							)}
							<button
								type="button"
								onClick={() => setOpen(false)}
								className="border-border-subtle hover:bg-foreground/5 grid size-11 shrink-0 place-items-center rounded-full border"
								aria-label="Close search"
							>
								<PiX aria-hidden="true" className="size-4" />
							</button>
						</div>

						<div className="max-h-[65vh] overflow-y-auto p-3 sm:p-5">
							<div className="flex items-center justify-between px-2 pb-3">
								<p
									id={titleId}
									className="text-primary text-xs font-bold tracking-[.18em] uppercase"
								>
									{query.length >= 2 ? 'Search results' : 'Find your piece'}
								</p>
								<span className="text-muted-foreground hidden text-[10px] sm:block">
									⌘ K · ESC to close
								</span>
							</div>

							{query.length < 2 ? (
								<div className="grid gap-2 sm:grid-cols-3">
									{[
										['Islamic Art', '/collections/islamic-art'],
										['Commercial Signage', '/collections/commercial-signage'],
										['All Collections', '/collections'],
									].map(([label, href]) => (
										<Link
											key={href}
											href={href}
											onClick={() => setOpen(false)}
											className="border-border-subtle rounded-control bg-surface/55 hover:border-primary/35 hover:bg-surface flex items-center justify-between border px-4 py-4 text-sm font-semibold transition"
										>
											{label}
											<PiArrowUpRight
												aria-hidden="true"
												className="text-primary size-4"
											/>
										</Link>
									))}
								</div>
							) : !loading && results.length === 0 ? (
								<div className="border-border-default rounded-card border border-dashed px-5 py-10 text-center">
									<p className="text-foreground font-semibold">
										No exact matches yet
									</p>
									<p className="text-muted-foreground mt-2 text-sm">
										Try a material, collection, calligraphy style, or product
										name.
									</p>
								</div>
							) : (
								<ul className="grid gap-1">
									{results.map((result) => (
										<li key={result._id}>
											<Link
												href={result.href}
												onClick={() => setOpen(false)}
												className="group rounded-control hover:bg-surface-muted flex items-center gap-4 p-2 transition"
											>
												<span className="rounded-control bg-art-backdrop relative size-16 shrink-0 overflow-hidden">
													{result.imageUrl ? (
														<Image
															src={result.imageUrl}
															alt=""
															fill
															sizes="64px"
															className="object-cover transition-opacity duration-300 group-hover:opacity-85"
														/>
													) : (
														<span className="text-primary grid size-full place-items-center">
															<PiMagnifyingGlass aria-hidden="true" />
														</span>
													)}
												</span>
												<span className="min-w-0 flex-1">
													<span className="text-primary block text-[10px] font-bold tracking-[.16em] uppercase">
														{result.kicker}
													</span>
													<span className="text-foreground mt-1 block truncate text-base font-semibold">
														{result.title}
													</span>
												</span>
												<PiArrowUpRight
													aria-hidden="true"
													className="text-foreground/30 group-hover:text-primary mr-2 size-5 shrink-0 transition"
												/>
											</Link>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	)
}
