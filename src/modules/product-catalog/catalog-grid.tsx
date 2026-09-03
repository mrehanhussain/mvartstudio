'use client'

import { stegaClean } from 'next-sanity'
import { useMemo, useRef, useState } from 'react'
import {
	PiArrowsDownUp,
	PiCheck,
	PiSlidersHorizontal,
	PiX,
} from 'react-icons/pi'
import type { CatalogCategory, CatalogProduct } from '@/lib/catalog'
import { cn } from '@/lib/utils'
import ProductCard from '@/ui/product-card'
import useDialogFocus from '@/ui/use-dialog-focus'

const availabilityLabels: Record<string, string> = {
	'made-to-order': 'Made to order',
	'ready-to-ship': 'Ready to ship',
	'custom-enquiry': 'Custom enquiry',
}

type FilterOption = { value: string; label: string; count: number }

function Facet({
	title,
	options,
	selected,
	onChange,
	type = 'checkbox',
}: {
	title: string
	options: FilterOption[]
	selected: string[]
	onChange: (value: string) => void
	type?: 'checkbox' | 'radio'
}) {
	return (
		<fieldset className="py-5 last:pb-0 first-of-type:pt-0">
			<legend className="mb-4 text-sm font-bold tracking-[.14em] text-[#211d18] uppercase">
				{title}
			</legend>
			<div className="space-y-3">
				{options.map((option) => {
					const checked = selected.includes(option.value)
					return (
						<label
							key={option.value}
							className="group flex cursor-pointer items-center gap-3 text-sm text-black/68"
						>
							<input
								className="peer sr-only"
								type={type}
								name={type === 'radio' ? title : undefined}
								checked={checked}
								onChange={() => onChange(option.value)}
							/>
							<span
								aria-hidden="true"
								className={cn(
									'grid size-5 shrink-0 place-items-center border border-black/25 bg-white transition group-hover:border-[#765523] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#765523]',
									type === 'radio' ? 'rounded-full' : 'rounded-[.3rem]',
									checked && 'border-[#173f35] bg-[#173f35] text-white',
								)}
							>
								{checked &&
									(type === 'radio' ? (
										<span className="size-2 rounded-full bg-white" />
									) : (
										<PiCheck className="size-3.5" />
									))}
							</span>
							<span
								className={cn(
									'flex-1',
									checked && 'font-semibold text-[#211d18]',
								)}
							>
								{option.label}
							</span>
							<span className="min-w-7 rounded-full bg-black/[.045] px-2 py-0.5 text-center text-xs text-black/60 tabular-nums">
								{option.count}
							</span>
						</label>
					)
				})}
			</div>
		</fieldset>
	)
}

export default function CatalogGrid({
	products,
	categories,
	layout = 'grid',
	showCategoryFilter,
	showMaterialFilter,
}: {
	products: CatalogProduct[]
	categories: CatalogCategory[]
	layout?: string
	showCategoryFilter?: boolean
	showMaterialFilter?: boolean
}) {
	const [category, setCategory] = useState('all')
	const [materials, setMaterials] = useState<string[]>([])
	const [availability, setAvailability] = useState<string[]>([])
	const [sort, setSort] = useState('featured')
	const [drawerOpen, setDrawerOpen] = useState(false)
	const drawerRef = useRef<HTMLDivElement>(null)
	const drawerCloseRef = useRef<HTMLButtonElement>(null)
	useDialogFocus(
		drawerOpen,
		() => setDrawerOpen(false),
		drawerRef,
		drawerCloseRef,
	)

	const categoryOptions = useMemo<FilterOption[]>(
		() => [
			{ value: 'all', label: 'All product types', count: products.length },
			...categories
				.map((item) => ({
					value: stegaClean(item.slug) || item._id,
					label: item.title || 'Untitled',
					count: products.filter(
						(product) =>
							stegaClean(product.category?.slug) === stegaClean(item.slug),
					).length,
				}))
				.filter((item) => item.count > 0),
		],
		[categories, products],
	)
	const materialOptions = useMemo<FilterOption[]>(
		() =>
			[
				...new Set(
					products.flatMap(
						(item) => item.materials?.map((value) => stegaClean(value)) || [],
					),
				),
			]
				.sort()
				.map((value) => ({
					value,
					label: value,
					count: products.filter((product) =>
						product.materials?.some((item) => stegaClean(item) === value),
					).length,
				})),
		[products],
	)
	const availabilityOptions = useMemo<FilterOption[]>(
		() =>
			Object.entries(availabilityLabels)
				.map(([value, label]) => ({
					value,
					label,
					count: products.filter(
						(product) => stegaClean(product.availability) === value,
					).length,
				}))
				.filter((item) => item.count > 0),
		[products],
	)

	const visible = useMemo(
		() =>
			products
				.filter((item) => {
					const cleanMaterials =
						item.materials?.map((value) => stegaClean(value)) || []
					return (
						(category === 'all' ||
							stegaClean(item.category?.slug) === category) &&
						(!materials.length ||
							materials.some((value) => cleanMaterials.includes(value))) &&
						(!availability.length ||
							availability.includes(stegaClean(item.availability || '')))
					)
				})
				.sort((a, b) => {
					if (sort === 'name-asc')
						return stegaClean(a.title || '').localeCompare(
							stegaClean(b.title || ''),
						)
					if (sort === 'name-desc')
						return stegaClean(b.title || '').localeCompare(
							stegaClean(a.title || ''),
						)
					return Number(Boolean(b.featured)) - Number(Boolean(a.featured))
				}),
		[availability, category, materials, products, sort],
	)

	const toggle = (
		setter: React.Dispatch<React.SetStateAction<string[]>>,
		value: string,
	) =>
		setter((current) =>
			current.includes(value)
				? current.filter((item) => item !== value)
				: [...current, value],
		)
	const activeCount =
		(category === 'all' ? 0 : 1) + materials.length + availability.length
	const clearAll = () => {
		setCategory('all')
		setMaterials([])
		setAvailability([])
	}
	const hasFilters = showCategoryFilter || showMaterialFilter
	const filters = (
		<>
			{showCategoryFilter && (
				<Facet
					title="Product type"
					options={categoryOptions}
					selected={[category]}
					type="radio"
					onChange={setCategory}
				/>
			)}
			{showMaterialFilter && (
				<Facet
					title="Material"
					options={materialOptions}
					selected={materials}
					onChange={(value) => toggle(setMaterials, value)}
				/>
			)}
			<Facet
				title="Availability"
				options={availabilityOptions}
				selected={availability}
				onChange={(value) => toggle(setAvailability, value)}
			/>
		</>
	)

	return (
		<div>
			<div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-y border-black/10 py-4">
				<div className="flex items-center gap-3">
					{hasFilters && (
						<button
							type="button"
							aria-expanded={drawerOpen}
							onClick={() => setDrawerOpen(true)}
							className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/15 bg-white px-4 text-sm font-semibold text-[#211d18] shadow-sm lg:hidden"
						>
							<PiSlidersHorizontal className="size-5" />
							Filters
							{activeCount > 0 && (
								<span className="grid size-5 place-items-center rounded-full bg-[#173f35] text-[11px] text-white">
									{activeCount}
								</span>
							)}
						</button>
					)}
					<p aria-live="polite" className="text-sm text-black/60">
						<strong className="font-semibold text-[#211d18]">
							{visible.length}
						</strong>{' '}
						{visible.length === 1 ? 'piece' : 'pieces'}
					</p>
				</div>
				<label className="flex items-center gap-2 text-sm text-black/60">
					<PiArrowsDownUp className="size-4" />
					<span className="sr-only sm:not-sr-only">Sort by</span>
					<select
						value={sort}
						onChange={(event) => setSort(event.target.value)}
						className="rounded-full border border-black/15 bg-white py-2.5 pr-9 pl-4 font-semibold text-[#211d18] shadow-sm outline-none focus:border-[#765523] focus:ring-2 focus:ring-[#765523]/20"
					>
						<option value="featured">Featured</option>
						<option value="name-asc">Name: A–Z</option>
						<option value="name-desc">Name: Z–A</option>
					</select>
				</label>
			</div>
			{activeCount > 0 && (
				<div
					className="mb-7 flex flex-wrap items-center gap-2"
					aria-label="Active filters"
				>
					{category !== 'all' && (
						<FilterChip
							label={
								categoryOptions.find((item) => item.value === category)
									?.label || category
							}
							onRemove={() => setCategory('all')}
						/>
					)}
					{materials.map((value) => (
						<FilterChip
							key={value}
							label={value}
							onRemove={() => toggle(setMaterials, value)}
						/>
					))}
					{availability.map((value) => (
						<FilterChip
							key={value}
							label={availabilityLabels[value] || value}
							onRemove={() => toggle(setAvailability, value)}
						/>
					))}
					<button
						type="button"
						onClick={clearAll}
						className="ml-1 text-sm font-semibold text-[#785a2a] underline decoration-[#d4ad69] underline-offset-4 hover:text-[#173f35]"
					>
						Clear all
					</button>
				</div>
			)}
			<div
				className={cn(
					hasFilters &&
						'lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start lg:gap-10',
				)}
			>
				{hasFilters && (
					<aside
						aria-label="Catalog filters"
						className="sticky-below-header hidden rounded-[1.25rem] border border-black/10 bg-white/65 p-5 shadow-[0_14px_45px_rgba(35,28,18,.06)] lg:block"
						style={{ '--offset': '1.5rem' } as React.CSSProperties}
					>
						<div className="mb-5 flex items-center justify-between">
							<h3 className="flex items-center gap-2 text-base font-bold text-[#211d18]">
								<PiSlidersHorizontal />
								Filter
							</h3>
							{activeCount > 0 && (
								<button
									type="button"
									onClick={clearAll}
									className="text-xs font-semibold text-[#785a2a] underline underline-offset-4"
								>
									Clear
								</button>
							)}
						</div>
						{filters}
					</aside>
				)}
				<div>
					<div
						className={cn(
							'grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 lg:gap-8',
							stegaClean(layout) === 'carousel'
								? 'carousel carousel-scroll-buttons auto-rows-fr overflow-x-auto pb-4'
								: hasFilters
									? 'xl:grid-cols-3'
									: 'lg:grid-cols-3',
						)}
					>
						{visible.map((product) => (
							<ProductCard key={product._id} product={product} />
						))}
					</div>
					{!visible.length && (
						<div className="rounded-2xl border border-dashed border-black/20 bg-white/45 p-10 text-center">
							<p className="font-semibold text-[#211d18]">
								No pieces match your filters.
							</p>
							<button
								type="button"
								onClick={clearAll}
								className="mt-3 text-sm font-semibold text-[#785a2a] underline underline-offset-4"
							>
								Reset filters
							</button>
						</div>
					)}
				</div>
			</div>
			{drawerOpen && (
				<div
					className="fixed inset-0 z-[100] lg:hidden"
					role="dialog"
					aria-modal="true"
					aria-labelledby="filter-drawer-title"
				>
					<button
						type="button"
						aria-label="Close filters"
						className="absolute inset-0 bg-[#102e27]/55 backdrop-blur-sm"
						onClick={() => setDrawerOpen(false)}
					/>
					<div
						ref={drawerRef}
						className="absolute inset-y-0 right-0 flex w-[min(90vw,24rem)] flex-col bg-[#f8f3ea] shadow-2xl"
					>
						<div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
							<div>
								<h2
									id="filter-drawer-title"
									className="text-xl font-bold text-[#211d18]"
								>
									Filter
								</h2>
								<p className="text-xs text-black/60">
									{visible.length} results
								</p>
							</div>
							<button
								ref={drawerCloseRef}
								type="button"
								aria-label="Close filters"
								onClick={() => setDrawerOpen(false)}
								className="grid size-11 place-items-center rounded-full border border-black/10 bg-white"
							>
								<PiX className="size-5" />
							</button>
						</div>
						<div className="flex-1 overflow-y-auto px-5 py-6">{filters}</div>
						<div className="grid grid-cols-2 gap-3 border-t border-black/10 bg-white/70 p-4">
							<button
								type="button"
								onClick={clearAll}
								disabled={!activeCount}
								className="min-h-12 rounded-full border border-black/15 px-4 text-sm font-semibold disabled:opacity-40"
							>
								Clear all
							</button>
							<button
								type="button"
								onClick={() => setDrawerOpen(false)}
								className="min-h-12 rounded-full bg-[#173f35] px-4 text-sm font-semibold text-white"
							>
								Show {visible.length} results
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

function FilterChip({
	label,
	onRemove,
}: {
	label: string
	onRemove: () => void
}) {
	return (
		<button
			type="button"
			onClick={onRemove}
			aria-label={`Remove ${label} filter`}
			className="inline-flex items-center gap-2 rounded-full border border-[#b98c49]/35 bg-[#f1e5d0] px-3 py-1.5 text-xs font-semibold text-[#5f4825] transition hover:border-[#765523]"
		>
			<span>{label}</span>
			<PiX className="size-3.5" />
		</button>
	)
}
