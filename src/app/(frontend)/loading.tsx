export default function Loading() {
	return (
		<div
			className="section flex min-h-[70svh] items-center justify-center py-16"
			role="status"
			aria-live="polite"
		>
			<div className="w-full max-w-4xl">
				<div className="mb-8 flex items-end justify-between gap-6">
					<div>
						<p className="text-accent text-[10px] font-bold tracking-[.22em] uppercase">
							MV Art Studio
						</p>
						<p className="mt-2 text-3xl font-[var(--font-serif)] tracking-[-.03em] sm:text-4xl">
							Preparing the next space
						</p>
					</div>
					<span className="text-muted-foreground hidden text-xs sm:block">
						Please wait
					</span>
				</div>

				<div className="grid h-64 grid-cols-[.72fr_1.3fr_.72fr] items-center gap-3 sm:h-80 sm:gap-5">
					<div className="border-border-subtle bg-art-backdrop/70 h-3/5 rounded-sm border shadow-[0_18px_45px_rgba(0,0,0,.1)]" />
					<div className="border-border-subtle bg-surface-muted/85 h-full rounded-sm border p-3 shadow-[0_22px_55px_rgba(0,0,0,.12)] sm:p-5">
						<div className="border-primary/25 bg-surface/25 size-full border" />
					</div>
					<div className="border-border-subtle bg-art-backdrop/70 h-3/5 rounded-sm border shadow-[0_18px_45px_rgba(0,0,0,.1)]" />
				</div>

				<div className="bg-foreground/10 mt-8 h-px overflow-hidden">
					<div className="route-loader-progress bg-primary h-full w-full" />
				</div>
				<span className="sr-only">Loading page content</span>
			</div>
		</div>
	)
}
