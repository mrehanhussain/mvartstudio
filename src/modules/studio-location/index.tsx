import { stegaClean } from 'next-sanity'
import {
	PiArrowUpRight,
	PiEnvelopeSimple,
	PiMapPin,
	PiNavigationArrow,
	PiPhone,
} from 'react-icons/pi'
import { Module } from '@/modules'
import type { StudioLocation } from '@/sanity/types'

export default function StudioLocation({
	eyebrow,
	heading,
	description,
	address,
	email,
	phones,
	mapUrl,
	...props
}: StudioLocation) {
	const cleanAddress = stegaClean(address) || ''
	const cleanMapUrl = stegaClean(mapUrl) || '#'
	const cleanEmail = stegaClean(email) || ''
	const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(cleanAddress)}&output=embed`

	return (
		<Module className="section py-12 sm:py-16 lg:py-20" {...props}>
			<header className="mb-8 grid items-end gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,.55fr)] lg:gap-16">
				<div>
					<p className="text-primary text-xs font-bold tracking-[.22em] uppercase">
						{eyebrow || 'Studio location'}
					</p>
					<h2 className="text-foreground mt-4 max-w-3xl text-4xl leading-[.98] tracking-[-.035em] sm:text-5xl lg:text-6xl">
						{heading}
					</h2>
				</div>
				{description && (
					<p className="text-muted-foreground max-w-xl text-sm leading-7 sm:text-base">
						{description}
					</p>
				)}
			</header>

			<div className="border-border-subtle group rounded-feature bg-art-backdrop relative isolate min-h-[39rem] overflow-hidden border shadow-[0_30px_90px_rgba(0,0,0,.2)] sm:min-h-[42rem] lg:min-h-[44rem]">
				<iframe
					title="Map showing the MV Art Studio location"
					src={mapEmbedUrl}
					loading="lazy"
					referrerPolicy="no-referrer-when-downgrade"
					allowFullScreen
					className="absolute inset-0 size-full border-0 contrast-[.92] saturate-[.72] transition duration-700 group-hover:contrast-100 group-hover:saturate-100"
				/>
				<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(12,38,31,.16),transparent_52%),linear-gradient(0deg,rgba(12,38,31,.2),transparent_42%)]" />

				<div className="border-border-inverse-strong bg-surface/88 text-primary pointer-events-none absolute top-5 right-5 flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-bold tracking-[.16em] uppercase shadow-lg backdrop-blur-xl sm:top-7 sm:right-7">
					<span className="size-2 rounded-full bg-[#3e7b5a] shadow-[0_0_0_4px_rgba(62,123,90,.14)]" />
					Open studio · Hyderabad
				</div>

				<div className="border-border-inverse-strong rounded-panel bg-surface/92 text-foreground absolute right-4 bottom-4 left-4 overflow-hidden border shadow-[0_24px_70px_rgba(0,0,0,.3)] backdrop-blur-2xl sm:right-auto sm:bottom-7 sm:left-7 sm:w-[25rem] lg:top-7 lg:bottom-auto lg:w-[27rem]">
					<div className="bg-brand-green relative overflow-hidden p-6 text-white sm:p-7">
						<div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.65)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.65)_1px,transparent_1px)] [background-size:28px_28px] opacity-[.055]" />
						<div className="relative flex items-start gap-4">
							<span className="grid size-11 shrink-0 place-items-center rounded-full border border-[#d4ad69]/35 bg-white/8 text-[#d4ad69]">
								<PiMapPin aria-hidden="true" className="size-5" />
							</span>
							<div>
								<p className="text-[10px] font-bold tracking-[.2em] text-[#d4ad69] uppercase">
									MV Art Studio
								</p>
								<address className="mt-3 text-sm leading-6 text-white/78 not-italic">
									{address}
								</address>
							</div>
						</div>
					</div>

					<div className="grid gap-px bg-black/8 sm:grid-cols-2">
						<a
							href={`mailto:${cleanEmail}`}
							className="bg-surface/96 hover:bg-surface-raised flex min-w-0 items-center gap-3 px-5 py-4 text-xs transition"
						>
							<PiEnvelopeSimple
								aria-hidden="true"
								className="text-primary size-4 shrink-0"
							/>
							<span className="truncate">{email}</span>
						</a>
						<div className="bg-surface/96 flex items-center gap-3 px-5 py-4 text-xs">
							<PiPhone
								aria-hidden="true"
								className="text-primary size-4 shrink-0"
							/>
							<div className="flex flex-col gap-1.5">
								{phones?.map((phone) => (
									<a
										key={phone}
										href={`tel:+${stegaClean(phone)?.replace(/\D/g, '')}`}
										className="hover:text-primary transition"
									>
										{phone}
									</a>
								))}
							</div>
						</div>
					</div>

					<a
						href={cleanMapUrl}
						target="_blank"
						rel="noreferrer"
						className="border-border-subtle group/route bg-surface/96 hover:bg-surface-raised flex items-center justify-between gap-5 border-t px-5 py-4 transition"
					>
						<span className="flex items-center gap-3">
							<span className="bg-brand-green group-hover/route:bg-primary grid size-10 shrink-0 place-items-center rounded-full text-white transition">
								<PiNavigationArrow aria-hidden="true" className="size-4" />
							</span>
							<span>
								<span className="text-primary block text-[9px] font-bold tracking-[.18em] uppercase">
									Plan your visit
								</span>
								<span className="mt-0.5 block text-sm font-semibold">
									Open in Google Maps
								</span>
							</span>
						</span>
						<PiArrowUpRight aria-hidden="true" className="size-5 shrink-0" />
					</a>
				</div>

				<div className="border-border-inverse-strong bg-brand-green/88 pointer-events-none absolute right-7 bottom-7 hidden items-center gap-2 rounded-full border px-4 py-2.5 text-[10px] font-bold tracking-[.15em] text-white uppercase shadow-xl backdrop-blur-xl lg:flex">
					<PiNavigationArrow
						aria-hidden="true"
						className="size-4 text-[#d4ad69]"
					/>
					Kishan Bagh · Hyderabad
				</div>
			</div>
		</Module>
	)
}
