'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
	PiArrowUpRight,
	PiEnvelopeSimple,
	PiSpinnerGap,
	PiWhatsappLogo,
} from 'react-icons/pi'
import {
	enquiryFieldLabels as fieldLabels,
	enquiryFieldOrder as fieldOrder,
	QUOTE_PROJECT_TYPES,
	resolveQuoteProjectType,
	type EnquiryKind as FormKind,
} from '@/lib/enquiry'
import { cn } from '@/lib/utils'

type DeliveryChannel = 'whatsapp' | 'email'

const input =
	'border-border-default mt-2 min-h-12 w-full rounded-control border bg-surface px-4 py-3 text-[15px] text-foreground outline-none transition placeholder:text-foreground/35 hover:border-primary/45 focus:border-primary focus:ring-4 focus:ring-primary/12'
const label = 'text-sm font-semibold text-foreground'

const quoteSteps = [
	{ title: 'Your details', description: 'How we can reach you' },
	{ title: 'The piece', description: 'What you would like made' },
	{ title: 'Project details', description: 'Budget, timing, and context' },
] as const

export default function EnquiryForm({ kind }: { kind: FormKind }) {
	const [productReference, setProductReference] = useState('')
	const [projectType, setProjectType] = useState('')
	const [status, setStatus] = useState('')
	const [statusType, setStatusType] = useState<'success' | 'error'>('success')
	const [submitting, setSubmitting] = useState(false)
	const [step, setStep] = useState(0)
	const [preferredReply, setPreferredReply] = useState('')
	const [contactError, setContactError] = useState('')
	const formRef = useRef<HTMLFormElement>(null)
	const stepHeadingRef = useRef<HTMLHeadingElement>(null)
	const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(
		/\D/g,
		'',
	)

	useEffect(() => {
		const params = new URLSearchParams(window.location.search)
		const product = params.get('product')
		if (product) setProductReference(product)
		const type = resolveQuoteProjectType(
			params.get('type') || params.get('projectType'),
		)
		if (type) setProjectType(type)
	}, [])

	function goToStep(nextStep: number) {
		setStep(nextStep)
		window.requestAnimationFrame(() => stepHeadingRef.current?.focus())
	}

	function advanceQuote() {
		const panel = formRef.current?.querySelector<HTMLElement>(
			`[data-quote-step="${step}"]`,
		)
		const controls = panel?.querySelectorAll<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>('input, select, textarea')
		for (const control of controls || []) {
			if (!control.checkValidity()) {
				control.reportValidity()
				control.focus()
				return
			}
		}
		goToStep(Math.min(step + 1, quoteSteps.length - 1))
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (submitting) return
		const submitter = (event.nativeEvent as SubmitEvent)
			.submitter as HTMLButtonElement | null
		const channel = submitter?.value as DeliveryChannel | undefined
		if (!channel) return

		const formData = new FormData(event.currentTarget)
		const reply = String(formData.get('preferredReply') || '')
		const missingReplyDetail =
			reply === 'Email'
				? !String(formData.get('email') || '').trim()
				: ['WhatsApp', 'Phone'].includes(reply)
					? !String(formData.get('phone') || '').trim()
					: false
		if (missingReplyDetail) {
			const field = reply === 'Email' ? 'email' : 'phone'
			setContactError(
				reply === 'Email'
					? 'Add an email address so we can reply by email.'
					: 'Add a phone number, including the country code, so we can reply.',
			)
			if (kind === 'quote') goToStep(0)
			window.requestAnimationFrame(() => {
				const control = formRef.current?.elements.namedItem(field)
				if (control instanceof HTMLElement) control.focus()
			})
			return
		}
		setContactError('')
		const heading =
			kind === 'quote'
				? 'Custom quote request — MV Art Studio'
				: 'General enquiry — MV Art Studio'
		const lines = fieldOrder[kind].flatMap((name) => {
			const values = formData
				.getAll(name)
				.map(String)
				.map((value) => value.trim())
				.filter(Boolean)
			return values.length ? [`${fieldLabels[name]}: ${values.join(', ')}`] : []
		})
		const message = [`*${heading}*`, '', ...lines].join('\n')

		if (channel === 'whatsapp' && whatsappNumber) {
			window.location.assign(
				`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
			)
			return
		}

		if (channel === 'email') {
			const fields = Object.fromEntries(
				fieldOrder[kind].map((name) => {
					const values = formData
						.getAll(name)
						.map(String)
						.map((value) => value.trim())
						.filter(Boolean)
					return [name, values.length > 1 ? values : values[0] || '']
				}),
			)

			setSubmitting(true)
			setStatus('')
			try {
				const response = await fetch('/api/enquiries', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						kind,
						fields,
						website: String(formData.get('website') || ''),
					}),
				})
				const result = (await response.json()) as { error?: string }
				if (!response.ok)
					throw new Error(result.error || 'Unable to send enquiry.')
				setStatusType('success')
				setStatus(
					kind === 'quote'
						? 'Your quotation request has been sent. We will be in touch shortly.'
						: 'Your enquiry has been sent. We will be in touch shortly.',
				)
			} catch (error) {
				setStatusType('error')
				setStatus(
					error instanceof Error
						? error.message
						: 'Unable to send your enquiry. Please try WhatsApp.',
				)
			} finally {
				setSubmitting(false)
			}
			return
		}

		setStatusType('error')
		setStatus('The WhatsApp number has not been configured yet.')
	}

	return (
		<form
			ref={formRef}
			onSubmit={handleSubmit}
			className="border-border-subtle rounded-panel bg-surface/72 border p-5 shadow-[0_24px_70px_rgba(0,0,0,.12)] backdrop-blur-sm sm:p-8"
		>
			<div className="border-border-subtle mb-8 border-b pb-6">
				<div className="flex items-start justify-between gap-5">
					<div>
						<p className="text-accent text-xs font-bold tracking-[.2em] uppercase">
							{kind === 'quote' ? 'Project brief' : 'Your message'}
						</p>
						<p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
							{kind === 'quote'
								? 'Share what you know. Approximate details are completely fine.'
								: 'Tell us what you need and choose how you would like to send it.'}
						</p>
					</div>
					<span className="border-primary/25 bg-primary/10 text-primary grid size-11 shrink-0 place-items-center rounded-full border text-xs font-bold">
						{kind === 'quote' ? `${step + 1}/${quoteSteps.length}` : '01'}
					</span>
				</div>
				{kind === 'quote' && (
					<ol
						className="mt-6 grid grid-cols-3 gap-2"
						aria-label="Quote progress"
					>
						{quoteSteps.map((item, index) => (
							<li key={item.title}>
								<button
									type="button"
									onClick={() => index < step && goToStep(index)}
									disabled={index > step}
									aria-current={index === step ? 'step' : undefined}
									className={cn(
										'min-h-11 w-full border-t-2 pt-2 text-left text-[11px] font-semibold transition sm:text-xs',
										index <= step
											? 'border-primary text-primary'
											: 'border-border-default text-muted-foreground/70 cursor-not-allowed',
									)}
								>
									<span className="block">{item.title}</span>
									<span className="text-muted-foreground mt-0.5 hidden font-normal sm:block">
										{item.description}
									</span>
								</button>
							</li>
						))}
					</ol>
				)}
			</div>

			<section hidden={kind === 'quote' && step !== 0} data-quote-step="0">
				{kind === 'quote' && (
					<h2
						ref={stepHeadingRef}
						tabIndex={-1}
						className="text-foreground mb-5 text-xl outline-none"
					>
						Your details
					</h2>
				)}
				<fieldset className="grid gap-5 sm:grid-cols-2">
					<legend className="sr-only">Contact details</legend>
					<TextField label="Name" name="name" autoComplete="name" required />
					<TextField
						label="Email"
						name="email"
						type="email"
						autoComplete="email"
						error={
							contactError && preferredReply === 'Email'
								? contactError
								: undefined
						}
					/>
					<TextField
						label="Phone / WhatsApp"
						name="phone"
						type="tel"
						autoComplete="tel"
						placeholder="Include country code"
						error={
							contactError && ['WhatsApp', 'Phone'].includes(preferredReply)
								? contactError
								: undefined
						}
					/>
					{kind === 'quote' ? (
						<TextField
							label="Company or organisation"
							name="company"
							autoComplete="organization"
							optional
						/>
					) : (
						<SelectField label="Enquiry about" name="subject" required>
							<option value="">Choose a subject</option>
							<option>Existing artwork</option>
							<option>Custom artwork</option>
							<option>Commercial signage</option>
							<option>Trade or collaboration</option>
							<option>Something else</option>
						</SelectField>
					)}
				</fieldset>
			</section>

			{kind === 'quote' && (
				<>
					<section hidden={step !== 1} data-quote-step="1">
						<h2
							ref={step === 1 ? stepHeadingRef : undefined}
							tabIndex={-1}
							className="text-foreground mb-5 text-xl outline-none"
						>
							The piece
						</h2>
						<div className="grid gap-5 sm:grid-cols-2">
							<SelectField
								label="Project type"
								name="projectType"
								required
								value={projectType}
								onChange={(event) => setProjectType(event.currentTarget.value)}
							>
								<option value="">Choose a project type</option>
								{QUOTE_PROJECT_TYPES.map((type) => (
									<option key={type} value={type}>
										{type}
									</option>
								))}
							</SelectField>
							<label className={label}>
								Artwork or product reference
								<span className="text-muted-foreground ml-2 font-normal">
									Optional
								</span>
								<input
									className={input}
									name="productReference"
									value={productReference}
									onChange={(event) => setProductReference(event.target.value)}
									placeholder="Piece name, SKU, or link"
								/>
							</label>
							<TextField
								label="Project location"
								name="location"
								placeholder="City and country"
								required
							/>
							<TextField
								label="Approximate dimensions"
								name="dimensions"
								placeholder="e.g. 120 × 80 cm"
								required
							/>
						</div>

						<div className="mt-5">
							<p className={label}>Preferred materials</p>
							<div className="mt-3 flex flex-wrap gap-2">
								{[
									'Acrylic',
									'Wood',
									'Steel',
									'Mixed material',
									'Reflective vinyl',
									'Unsure',
								].map((material) => (
									<ChoicePill
										key={material}
										name="materials"
										value={material}
									/>
								))}
							</div>
						</div>

						<div className="mt-5 grid gap-5 sm:grid-cols-2">
							<TextField
								label="Colour or finish"
								name="finish"
								placeholder="e.g. matte black and antique gold"
								optional
							/>
							<TextField
								label="Quantity"
								name="quantity"
								type="number"
								min="1"
								placeholder="1"
								defaultValue="1"
								required
							/>
						</div>
					</section>

					<section hidden={step !== 2} data-quote-step="2">
						<h2
							ref={step === 2 ? stepHeadingRef : undefined}
							tabIndex={-1}
							className="text-foreground mb-5 text-xl outline-none"
						>
							Project details
						</h2>
						<div className="grid gap-5 sm:grid-cols-2">
							<SelectField label="Approximate budget" name="budget" required>
								<option value="">Choose a range</option>
								<option>Under ₹25,000</option>
								<option>₹25,000–₹75,000</option>
								<option>₹75,000–₹2,00,000</option>
								<option>₹2,00,000–₹5,00,000</option>
								<option>₹5,00,000+</option>
								<option>Need guidance</option>
							</SelectField>
							<SelectField label="Preferred timeline" name="timeline" required>
								<option value="">Choose a timeline</option>
								<option>Within 4 weeks</option>
								<option>1–2 months</option>
								<option>3–6 months</option>
								<option>6+ months</option>
								<option>Flexible</option>
							</SelectField>
							<SelectField label="Installation" name="installation" required>
								<option value="">Choose one</option>
								<option>Ready-to-hang hardware</option>
								<option>Professional installation needed</option>
								<option>Installation by our contractor</option>
								<option>Need guidance</option>
							</SelectField>
							<SelectField label="Reference images" name="references">
								<option>I do not have references yet</option>
								<option>I will attach photos in WhatsApp</option>
								<option>I will attach photos by email</option>
							</SelectField>
						</div>
						<div className="mt-5">
							<label className={label}>
								Project details <RequiredMark />
								<textarea
									className={cn(input, 'min-h-36 resize-y')}
									name="message"
									rows={5}
									placeholder="Tell us about the space, the feeling you want, wording or calligraphy, and any practical requirements."
									required
								/>
							</label>
						</div>
					</section>
				</>
			)}

			{kind === 'contact' && (
				<div>
					<label className={label}>
						Message <RequiredMark />
						<textarea
							className={cn(input, 'min-h-36 resize-y')}
							name="message"
							rows={5}
							placeholder="How can we help?"
							required
						/>
					</label>
				</div>
			)}

			<fieldset
				className={cn('mt-6', kind === 'quote' && step !== 2 && 'hidden')}
			>
				<label className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden opacity-0">
					Website
					<input name="website" tabIndex={-1} autoComplete="off" />
				</label>
				<legend className={label}>Preferred reply</legend>
				<div className="mt-3 flex flex-wrap gap-2">
					{['WhatsApp', 'Email', 'Phone'].map((value) => (
						<ChoicePill
							key={value}
							name="preferredReply"
							value={value}
							type="radio"
							required
							checked={preferredReply === value}
							onChange={() => {
								setPreferredReply(value)
								setContactError('')
							}}
						/>
					))}
				</div>
			</fieldset>

			{kind === 'quote' && step < quoteSteps.length - 1 ? (
				<div className="mt-8 flex justify-end">
					<button
						type="button"
						onClick={advanceQuote}
						className="bg-brand hover:bg-brand-hover inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white"
					>
						Continue <PiArrowUpRight aria-hidden="true" className="size-4" />
					</button>
				</div>
			) : (
				<div className="mt-8">
					{kind === 'quote' && (
						<button
							type="button"
							onClick={() => goToStep(step - 1)}
							className="text-primary decoration-accent mb-3 min-h-11 text-sm font-semibold underline underline-offset-4"
						>
							Back to the piece
						</button>
					)}
					<div className="grid gap-3 sm:grid-cols-[1fr_auto]">
						<button
							type="submit"
							name="channel"
							value="whatsapp"
							disabled={!whatsappNumber}
							className="bg-whatsapp hover:bg-whatsapp-hover focus-visible:outline-whatsapp inline-flex min-h-13 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
						>
							<PiWhatsappLogo aria-hidden="true" className="size-5" />
							Review and open WhatsApp
							<PiArrowUpRight aria-hidden="true" className="size-4" />
						</button>
						<button
							type="submit"
							name="channel"
							value="email"
							disabled={submitting}
							className="border-primary/35 bg-primary/10 text-primary hover:border-primary/60 hover:bg-primary/15 focus-visible:outline-primary inline-flex min-h-13 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
						>
							{submitting ? (
								<PiSpinnerGap
									aria-hidden="true"
									className="size-5 animate-spin"
								/>
							) : (
								<PiEnvelopeSimple aria-hidden="true" className="size-5" />
							)}
							{submitting
								? 'Sending…'
								: kind === 'quote'
									? 'Send quotation request'
									: 'Send enquiry'}
						</button>
					</div>
					<p className="text-muted-foreground mt-4 text-xs leading-5">
						Email enquiries are sent securely to the studio. WhatsApp opens with
						your details ready for review. Reference images can be attached
						there.
					</p>
				</div>
			)}

			{!whatsappNumber && (
				<p className="text-muted-foreground mt-4 text-xs leading-5">
					WhatsApp delivery is awaiting configuration.
				</p>
			)}
			<p
				aria-live="polite"
				className={cn(
					'mt-3 text-sm font-semibold',
					statusType === 'success' ? 'text-primary' : 'text-danger',
				)}
			>
				{status}
			</p>
			{contactError && (
				<p role="alert" className="text-danger mt-3 text-sm font-semibold">
					{contactError}
				</p>
			)}
		</form>
	)
}

function TextField({
	label: labelText,
	optional,
	error,
	...props
}: {
	label: string
	optional?: boolean
	error?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<label className={label}>
			{labelText}
			{props.required && <RequiredMark />}
			{optional && (
				<span className="text-muted-foreground ml-2 font-normal">Optional</span>
			)}
			<input className={input} aria-invalid={Boolean(error)} {...props} />
			{error && (
				<span className="text-danger mt-2 block text-xs font-medium">
					{error}
				</span>
			)}
		</label>
	)
}

function SelectField({
	label: labelText,
	children,
	...props
}: {
	label: string
	children: React.ReactNode
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
	return (
		<label className={label}>
			{labelText}
			{props.required && <RequiredMark />}
			<select className={cn(input, 'appearance-none pr-10')} {...props}>
				{children}
			</select>
		</label>
	)
}

function ChoicePill({
	name,
	value,
	type = 'checkbox',
	required,
	checked,
	onChange,
}: {
	name: string
	value: string
	type?: 'checkbox' | 'radio'
	required?: boolean
	checked?: boolean
	onChange?: () => void
}) {
	return (
		<label className="cursor-pointer">
			<input
				className="peer sr-only"
				type={type}
				name={name}
				value={value}
				required={required}
				checked={checked}
				onChange={onChange}
			/>
			<span className="border-border-default bg-surface text-muted-foreground peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:outline-primary hover:border-primary/45 inline-flex min-h-11 items-center rounded-full border px-4 text-xs font-semibold transition peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
				{value}
			</span>
		</label>
	)
}

function RequiredMark() {
	return (
		<span className="text-primary ml-1" aria-hidden="true">
			*
		</span>
	)
}
