'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
	PiArrowUpRight,
	PiEnvelopeSimple,
	PiWhatsappLogo,
} from 'react-icons/pi'
import { cn } from '@/lib/utils'

type FormKind = 'contact' | 'quote'
type DeliveryChannel = 'whatsapp' | 'email'

const input =
	'mt-2 min-h-12 w-full rounded-xl border border-black/12 bg-[#fffdf8] px-4 py-3 text-[15px] text-[#211d18] outline-none transition placeholder:text-black/32 hover:border-black/25 focus:border-[#765523] focus:ring-4 focus:ring-[#765523]/12'
const label = 'text-sm font-semibold text-[#302a23]'

const fieldLabels: Record<string, string> = {
	name: 'Name',
	email: 'Email',
	phone: 'Phone / WhatsApp',
	company: 'Company or organisation',
	subject: 'Enquiry about',
	projectType: 'Project type',
	productReference: 'Artwork or product reference',
	location: 'Project location',
	dimensions: 'Approximate dimensions',
	materials: 'Preferred materials',
	finish: 'Colour or finish',
	quantity: 'Quantity',
	budget: 'Approximate budget',
	timeline: 'Preferred timeline',
	installation: 'Installation',
	message: 'Project details',
	preferredReply: 'Preferred reply',
	references: 'Reference images',
}

const fieldOrder: Record<FormKind, string[]> = {
	contact: ['name', 'email', 'phone', 'subject', 'message', 'preferredReply'],
	quote: [
		'name',
		'email',
		'phone',
		'company',
		'projectType',
		'productReference',
		'location',
		'dimensions',
		'materials',
		'finish',
		'quantity',
		'budget',
		'timeline',
		'installation',
		'references',
		'message',
		'preferredReply',
	],
}

const quoteSteps = [
	{ title: 'Your details', description: 'How we can reach you' },
	{ title: 'The piece', description: 'What you would like made' },
	{ title: 'Project details', description: 'Budget, timing, and context' },
] as const

export default function EnquiryForm({ kind }: { kind: FormKind }) {
	const [productReference, setProductReference] = useState('')
	const [status, setStatus] = useState('')
	const [step, setStep] = useState(0)
	const [preferredReply, setPreferredReply] = useState('')
	const [contactError, setContactError] = useState('')
	const formRef = useRef<HTMLFormElement>(null)
	const stepHeadingRef = useRef<HTMLHeadingElement>(null)
	const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(
		/\D/g,
		'',
	)
	const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim()

	useEffect(() => {
		const product = new URLSearchParams(window.location.search).get('product')
		if (product) setProductReference(product)
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

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
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

		if (channel === 'email' && contactEmail) {
			const subject =
				kind === 'quote' ? 'Custom quote request' : 'Website enquiry'
			window.location.assign(
				`mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message.replaceAll('*', ''))}`,
			)
			return
		}

		setStatus(
			`The ${channel === 'whatsapp' ? 'WhatsApp number' : 'contact email'} has not been configured yet.`,
		)
	}

	return (
		<form
			ref={formRef}
			onSubmit={handleSubmit}
			className="rounded-[1.75rem] border border-black/10 bg-white/72 p-5 shadow-[0_24px_70px_rgba(43,33,20,.08)] backdrop-blur-sm sm:p-8"
		>
			<div className="mb-8 border-b border-black/10 pb-6">
				<div className="flex items-start justify-between gap-5">
					<div>
						<p className="text-xs font-bold tracking-[.2em] text-[#765523] uppercase">
							{kind === 'quote' ? 'Project brief' : 'Your message'}
						</p>
						<p className="mt-2 max-w-md text-sm leading-6 text-black/60">
							{kind === 'quote'
								? 'Share what you know. Approximate details are completely fine.'
								: 'Tell us what you need and choose how you would like to send it.'}
						</p>
					</div>
					<span className="grid size-11 shrink-0 place-items-center rounded-full border border-[#765523]/25 bg-[#f4ebdc] text-xs font-bold text-[#765523]">
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
											? 'border-[#765523] text-[#4f3b20]'
											: 'cursor-not-allowed border-black/12 text-black/45',
									)}
								>
									<span className="block">{item.title}</span>
									<span className="mt-0.5 hidden font-normal text-black/60 sm:block">
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
						className="mb-5 text-xl text-[#211d18] outline-none"
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
							className="mb-5 text-xl text-[#211d18] outline-none"
						>
							The piece
						</h2>
						<div className="grid gap-5 sm:grid-cols-2">
							<SelectField label="Project type" name="projectType" required>
								<option value="">Choose a project type</option>
								<option>Islamic calligraphy art</option>
								<option>Layered acrylic art</option>
								<option>Wood wall art</option>
								<option>Steel wall art</option>
								<option>Architectural signage</option>
								<option>Radium / reflective graphics</option>
								<option>Not sure yet</option>
							</SelectField>
							<label className={label}>
								Artwork or product reference
								<span className="ml-2 font-normal text-black/60">Optional</span>
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
							className="mb-5 text-xl text-[#211d18] outline-none"
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
						className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#173f35] px-6 text-sm font-semibold text-white hover:bg-[#0f3028]"
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
							className="mb-3 min-h-11 text-sm font-semibold text-[#5f4825] underline decoration-[#d4ad69] underline-offset-4"
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
							className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#173f35] px-5 text-sm font-semibold text-white transition hover:bg-[#0f3028] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173f35] disabled:cursor-not-allowed disabled:opacity-40"
						>
							<PiWhatsappLogo aria-hidden="true" className="size-5" />
							Review and open WhatsApp
							<PiArrowUpRight aria-hidden="true" className="size-4" />
						</button>
						<button
							type="submit"
							name="channel"
							value="email"
							disabled={!contactEmail}
							className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-[#765523]/35 bg-[#f8f0e4] px-5 text-sm font-semibold text-[#5f4825] transition hover:border-[#765523]/60 hover:bg-[#f2e4d0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#765523] disabled:cursor-not-allowed disabled:opacity-40"
						>
							<PiEnvelopeSimple aria-hidden="true" className="size-5" />
							Open email draft
						</button>
					</div>
					<p className="mt-4 text-xs leading-5 text-black/60">
						Nothing is sent automatically. We will open your chosen app with the
						details filled in so you can review and send them. Reference images
						can be attached there.
					</p>
				</div>
			)}

			{(!whatsappNumber || !contactEmail) && (
				<p className="mt-4 text-xs leading-5 text-black/60">
					{!whatsappNumber && !contactEmail
						? 'Add the studio WhatsApp number and email to enable delivery.'
						: `${!whatsappNumber ? 'WhatsApp' : 'Email'} delivery is awaiting configuration.`}
				</p>
			)}
			<p
				aria-live="polite"
				className="mt-3 text-sm font-semibold text-[#8a3d2b]"
			>
				{status}
			</p>
			{contactError && (
				<p role="alert" className="mt-3 text-sm font-semibold text-[#8a3d2b]">
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
				<span className="ml-2 font-normal text-black/60">Optional</span>
			)}
			<input className={input} aria-invalid={Boolean(error)} {...props} />
			{error && (
				<span className="mt-2 block text-xs font-medium text-[#8a3d2b]">
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
			<span className="inline-flex min-h-11 items-center rounded-full border border-black/12 bg-[#fffdf8] px-4 text-xs font-semibold text-black/60 transition peer-checked:border-[#173f35] peer-checked:bg-[#173f35] peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#765523] hover:border-[#765523]/45">
				{value}
			</span>
		</label>
	)
}

function RequiredMark() {
	return (
		<span className="ml-1 text-[#765523]" aria-hidden="true">
			*
		</span>
	)
}
