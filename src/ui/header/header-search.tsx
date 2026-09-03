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
					'grid size-11 place-items-center rounded-full text-[#211d18] transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#765523]',
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
						className="w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-white/55 bg-[#fffaf0]/96 shadow-[0_35px_100px_rgba(9,30,24,.28)]"
					>
						<div className="flex items-center gap-3 border-b border-black/10 px-5 py-4 sm:px-7">
							<PiMagnifyingGlass
								aria-hidden="true"
								className="size-6 shrink-0 text-[#765523]"
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
								className="min-w-0 flex-1 bg-transparent py-2 text-lg text-[#211d18] outline-none placeholder:text-black/32 sm:text-xl"
							/>
							{loading && (
								<PiSpinnerGap
									aria-label="Searching"
									className="size-5 animate-spin text-[#765523]"
								/>
							)}
							<button
								type="button"
								onClick={() => setOpen(false)}
								className="grid size-11 shrink-0 place-items-center rounded-full border border-black/10 hover:bg-black/5"
								aria-label="Close search"
							>
								<PiX aria-hidden="true" className="size-4" />
							</button>
						</div>

						<div className="max-h-[65vh] overflow-y-auto p-3 sm:p-5">
							<div className="flex items-center justify-between px-2 pb-3">
								<h2
									id={titleId}
									className="text-xs font-bold tracking-[.18em] text-[#765523] uppercase"
								>
									{query.length >= 2 ? 'Search results' : 'Find your piece'}
								</h2>
								<span className="hidden text-[10px] text-black/60 sm:block">
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
											className="flex items-center justify-between rounded-xl border border-black/8 bg-white/55 px-4 py-4 text-sm font-semibold transition hover:border-[#765523]/35 hover:bg-white"
										>
											{label}
											<PiArrowUpRight
												aria-hidden="true"
												className="size-4 text-[#765523]"
											/>
										</Link>
									))}
								</div>
							) : !loading && results.length === 0 ? (
								<div className="rounded-2xl border border-dashed border-black/15 px-5 py-10 text-center">
									<p className="font-semibold text-[#211d18]">
										No exact matches yet
									</p>
									<p className="mt-2 text-sm text-black/60">
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
												className="group flex items-center gap-4 rounded-2xl p-2 transition hover:bg-[#efe5d6]"
											>
												<span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-[#e8dfd2]">
													{result.imageUrl ? (
														<Image
															src={result.imageUrl}
															alt=""
															fill
															sizes="64px"
															className="object-cover transition-opacity duration-300 group-hover:opacity-85"
														/>
													) : (
														<span className="grid size-full place-items-center text-[#765523]">
															<PiMagnifyingGlass aria-hidden="true" />
														</span>
													)}
												</span>
												<span className="min-w-0 flex-1">
													<span className="block text-[10px] font-bold tracking-[.16em] text-[#765523] uppercase">
														{result.kicker}
													</span>
													<span className="mt-1 block truncate text-base font-semibold text-[#211d18]">
														{result.title}
													</span>
												</span>
												<PiArrowUpRight
													aria-hidden="true"
													className="mr-2 size-5 shrink-0 text-black/30 transition group-hover:text-[#173f35]"
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
