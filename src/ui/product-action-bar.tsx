'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
	PiBookmarkSimple,
	PiBookmarkSimpleFill,
	PiShareNetwork,
	PiWhatsappLogo,
} from 'react-icons/pi'

export default function ProductActionBar({
	productId,
	title,
	quoteHref,
}: {
	productId: string
	title: string
	quoteHref: string
}) {
	const [saved, setSaved] = useState(false)
	const [shared, setShared] = useState(false)
	const storageKey = 'mvart-saved-products'
	const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(
		/\D/g,
		'',
	)

	useEffect(() => {
		const savedProducts = JSON.parse(
			window.localStorage.getItem(storageKey) || '[]',
		) as string[]
		setSaved(savedProducts.includes(productId))
	}, [productId])

	function toggleSaved() {
		const savedProducts = new Set<string>(
			JSON.parse(window.localStorage.getItem(storageKey) || '[]'),
		)
		if (savedProducts.has(productId)) savedProducts.delete(productId)
		else savedProducts.add(productId)
		window.localStorage.setItem(storageKey, JSON.stringify([...savedProducts]))
		setSaved(savedProducts.has(productId))
	}

	async function shareProduct() {
		const shareData = { title, url: window.location.href }
		if (navigator.share) await navigator.share(shareData)
		else {
			await navigator.clipboard.writeText(window.location.href)
			setShared(true)
			window.setTimeout(() => setShared(false), 1600)
		}
	}

	const whatsappHref = whatsappNumber
		? 'https://wa.me/' +
			whatsappNumber +
			'?text=' +
			encodeURIComponent(
				'Hello MV Art Studio, I am interested in ' + title + '.',
			)
		: quoteHref

	return (
		<div className="fixed inset-x-3 bottom-3 z-40 rounded-[1.2rem] border border-white/55 bg-[#fffaf0]/92 p-2 shadow-[0_20px_65px_rgba(13,33,28,.28)] backdrop-blur-2xl lg:hidden">
			<div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-1">
				<Link
					href={quoteHref}
					className="flex min-h-11 items-center justify-center rounded-xl bg-[#173f35] px-4 text-center text-xs font-bold text-white"
				>
					Request quote
				</Link>
				<a
					href={whatsappHref}
					aria-label={'Ask about ' + title + ' on WhatsApp'}
					className="grid size-11 place-items-center rounded-xl text-[#173f35] transition hover:bg-black/5"
				>
					<PiWhatsappLogo aria-hidden="true" className="size-5" />
				</a>
				<button
					type="button"
					onClick={toggleSaved}
					aria-pressed={saved}
					aria-label={saved ? 'Remove from saved pieces' : 'Save this piece'}
					className="grid size-11 place-items-center rounded-xl text-[#173f35] transition hover:bg-black/5"
				>
					{saved ? (
						<PiBookmarkSimpleFill aria-hidden="true" className="size-5" />
					) : (
						<PiBookmarkSimple aria-hidden="true" className="size-5" />
					)}
				</button>
				<button
					type="button"
					onClick={shareProduct}
					aria-label="Share this piece"
					className="relative grid size-11 place-items-center rounded-xl text-[#173f35] transition hover:bg-black/5"
				>
					<PiShareNetwork aria-hidden="true" className="size-5" />
					{shared && (
						<span className="absolute -top-8 right-0 rounded-full bg-[#173f35] px-2 py-1 text-[9px] font-bold text-white">
							Copied
						</span>
					)}
				</button>
			</div>
		</div>
	)
}
