'use client'

import { useEffect, useRef, useState } from 'react'
import {
	PiArrowsOutSimple,
	PiCaretLeft,
	PiCaretRight,
	PiMagnifyingGlassMinus,
	PiMagnifyingGlassPlus,
	PiX,
} from 'react-icons/pi'
import { cn } from '@/lib/utils'
import Img from '@/ui/img'

type GalleryImage = {
	_key?: string
	alt?: string
	asset?: unknown
	[key: string]: unknown
}

export default function ProductGallery({
	images,
	title,
}: {
	images?: GalleryImage[]
	title: string
}) {
	const gallery = images?.filter((image) => image?.asset) || []
	const [activeIndex, setActiveIndex] = useState(0)
	const [zoomed, setZoomed] = useState(false)
	const dialogRef = useRef<HTMLDialogElement>(null)
	const pointerStart = useRef<number | null>(null)
	const activeImage = gallery[activeIndex]

	const selectPrevious = () => {
		setZoomed(false)
		setActiveIndex((index) => (index - 1 + gallery.length) % gallery.length)
	}

	const selectNext = () => {
		setZoomed(false)
		setActiveIndex((index) => (index + 1) % gallery.length)
	}

	const openLightbox = () => dialogRef.current?.showModal()
	const closeLightbox = () => {
		setZoomed(false)
		dialogRef.current?.close()
	}

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (!dialogRef.current?.open) return
			if (event.key === 'ArrowLeft') selectPrevious()
			if (event.key === 'ArrowRight') selectNext()
		}
		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	})

	if (!activeImage) {
		return <div className="aspect-[4/5] rounded-[1.75rem] bg-[#e9e1d4]" />
	}

	return (
		<>
			<div
				className={cn(
					'grid gap-3 sm:gap-4',
					gallery.length > 1 && 'sm:grid-cols-[5.25rem_minmax(0,1fr)]',
				)}
			>
				{gallery.length > 1 && (
					<div className="order-2 flex gap-2 overflow-x-auto pb-1 sm:order-1 sm:max-h-[min(72svh,49rem)] sm:flex-col sm:overflow-y-auto sm:pr-1">
						{gallery.map((image, index) => (
							<button
								type="button"
								key={image._key || index}
								aria-label={`View image ${index + 1} of ${gallery.length}`}
								aria-pressed={index === activeIndex}
								onClick={() => {
									setZoomed(false)
									setActiveIndex(index)
								}}
								className={cn(
									'relative aspect-square w-[4.75rem] shrink-0 overflow-hidden rounded-xl border bg-[#e9e1d4] p-0.5 transition sm:w-full',
									index === activeIndex
										? 'border-[#765523] ring-2 ring-[#765523]/20'
										: 'border-black/10 opacity-65 hover:opacity-100',
								)}
							>
								<Img
									image={image}
									alt=""
									width={180}
									className="size-full rounded-[.55rem] object-cover"
									sizes="84px"
								/>
							</button>
						))}
					</div>
				)}

				<div className="group relative order-1 overflow-hidden rounded-[1.75rem] bg-[#e9e1d4] sm:order-2">
					<button
						type="button"
						onClick={openLightbox}
						className="block w-full cursor-zoom-in"
						aria-label={`Open fullscreen gallery for ${title}`}
					>
						<Img
							image={activeImage}
							alt={activeImage.alt || title}
							width={1500}
							loading="eager"
							className="aspect-[4/5] w-full object-cover sm:aspect-[5/6] lg:max-h-[49rem]"
							sizes="(min-width: 1024px) 55vw, 100vw"
						/>
							<span className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-[#fffaf0]/92 text-[#211d18] shadow-lg backdrop-blur-sm transition-colors group-hover:bg-white">
							<PiArrowsOutSimple aria-hidden="true" className="size-4" />
						</span>
					</button>
					{gallery.length > 1 && (
						<>
							<GalleryArrow
								label="Previous image"
								direction="left"
								onClick={selectPrevious}
							/>
							<GalleryArrow
								label="Next image"
								direction="right"
								onClick={selectNext}
							/>
							<span className="absolute right-4 bottom-4 rounded-full bg-[#102e27]/82 px-3 py-1.5 text-xs font-semibold text-white tabular-nums backdrop-blur-sm">
								{activeIndex + 1} / {gallery.length}
							</span>
						</>
					)}
				</div>
			</div>

			<dialog
				ref={dialogRef}
				aria-label={`${title} image gallery`}
				onCancel={() => setZoomed(false)}
				onClick={(event) =>
					event.target === event.currentTarget && closeLightbox()
				}
				className="m-auto h-dvh max-h-none w-screen max-w-none border-0 bg-transparent p-0 text-white backdrop:bg-[#0b1714]/28 backdrop:backdrop-blur-md open:flex open:flex-col"
			>
				<div className="flex min-h-16 shrink-0 items-center justify-between border-b border-white/15 bg-[#0b1714]/58 px-4 shadow-lg backdrop-blur-2xl sm:px-6">
					<div>
						<p className="text-sm font-semibold">{title}</p>
						<p aria-live="polite" className="text-xs text-white/55">
							Image {activeIndex + 1} of {gallery.length}
						</p>
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setZoomed((value) => !value)}
								className="grid size-11 place-items-center rounded-full border border-white/20 bg-black/15 backdrop-blur-xl hover:bg-black/30"
							aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
						>
							{zoomed ? (
								<PiMagnifyingGlassMinus className="size-5" />
							) : (
								<PiMagnifyingGlassPlus className="size-5" />
							)}
						</button>
						<button
							type="button"
							onClick={closeLightbox}
								className="grid size-11 place-items-center rounded-full border border-white/20 bg-black/15 backdrop-blur-xl hover:bg-black/30"
							aria-label="Close image gallery"
						>
							<PiX className="size-5" />
						</button>
					</div>
				</div>

				<div
					className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center overflow-auto bg-gradient-to-b from-[#0b1714]/12 via-transparent to-[#0b1714]/12 p-3 sm:p-8"
					onPointerDown={(event) => {
						pointerStart.current = event.clientX
					}}
					onPointerUp={(event) => {
						if (pointerStart.current === null || zoomed) return
						const distance = event.clientX - pointerStart.current
						if (distance > 50) selectPrevious()
						if (distance < -50) selectNext()
						pointerStart.current = null
					}}
				>
					<Img
						image={activeImage}
						alt={activeImage.alt || title}
						width={2400}
						className={cn(
							'max-h-full w-auto max-w-full rounded-xl object-contain shadow-2xl transition-transform duration-300 select-none',
							zoomed && 'scale-150 cursor-zoom-out',
						)}
						sizes="100vw"
						draggable={false}
					/>
					{gallery.length > 1 && (
						<>
							<GalleryArrow
								label="Previous image"
								direction="left"
								onClick={selectPrevious}
								lightbox
							/>
							<GalleryArrow
								label="Next image"
								direction="right"
								onClick={selectNext}
								lightbox
							/>
						</>
					)}
				</div>

				{gallery.length > 1 && (
					<div className="flex shrink-0 justify-center gap-2 overflow-x-auto border-t border-white/15 bg-[#0b1714]/58 px-4 py-3 shadow-[0_-12px_36px_rgba(0,0,0,.12)] backdrop-blur-2xl">
						{gallery.map((image, index) => (
							<button
								type="button"
								key={image._key || index}
								onClick={() => {
									setZoomed(false)
									setActiveIndex(index)
								}}
								aria-label={`Show image ${index + 1}`}
								aria-pressed={index === activeIndex}
								className={cn(
									'aspect-square w-14 shrink-0 overflow-hidden rounded-lg border p-0.5',
									index === activeIndex
										? 'border-[#d4ad69]'
										: 'border-white/15 opacity-50 hover:opacity-100',
								)}
							>
								<Img
									image={image}
									alt=""
									width={112}
									className="size-full rounded-[.35rem] object-cover"
									sizes="56px"
								/>
							</button>
						))}
					</div>
				)}
			</dialog>
		</>
	)
}

function GalleryArrow({
	label,
	direction,
	onClick,
	lightbox = false,
}: {
	label: string
	direction: 'left' | 'right'
	onClick: () => void
	lightbox?: boolean
}) {
	const Icon = direction === 'left' ? PiCaretLeft : PiCaretRight
	return (
		<button
			type="button"
			aria-label={label}
			onClick={(event) => {
				event.stopPropagation()
				onClick()
			}}
			className={cn(
				'absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full shadow-lg backdrop-blur-sm transition',
				direction === 'left' ? 'left-3 sm:left-5' : 'right-3 sm:right-5',
				lightbox
					? 'border border-white/15 bg-black/45 text-white hover:bg-black/70'
					: 'bg-[#fffaf0]/92 text-[#211d18] opacity-0 group-hover:opacity-100 focus:opacity-100',
			)}
		>
			<Icon aria-hidden="true" className="size-5" />
		</button>
	)
}
