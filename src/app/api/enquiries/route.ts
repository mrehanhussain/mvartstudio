import { Resend } from 'resend'
import { enquiryFieldOrder, type EnquiryKind } from '@/lib/enquiry'

const MAX_REQUEST_BYTES = 50_000
const MAX_FIELD_LENGTH = 5_000
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Submission = {
	kind?: unknown
	fields?: unknown
	website?: unknown
}

function cleanValue(value: unknown) {
	const values = Array.isArray(value) ? value : [value]
	return values
		.filter((item): item is string => typeof item === 'string')
		.map((item) => item.trim().slice(0, MAX_FIELD_LENGTH))
		.filter(Boolean)
}

export async function POST(request: Request) {
	const requestSize = Number(request.headers.get('content-length') || 0)
	if (requestSize > MAX_REQUEST_BYTES) {
		return Response.json(
			{ error: 'This message is too large.' },
			{ status: 413 },
		)
	}

	let submission: Submission
	try {
		submission = (await request.json()) as Submission
	} catch {
		return Response.json({ error: 'Invalid request.' }, { status: 400 })
	}

	// Quietly accept bot-filled submissions without sending an email.
	if (typeof submission.website === 'string' && submission.website.trim()) {
		return Response.json({ ok: true })
	}

	if (submission.kind !== 'contact' && submission.kind !== 'quote') {
		return Response.json({ error: 'Unknown enquiry type.' }, { status: 400 })
	}
	const kind = submission.kind as EnquiryKind
	if (!submission.fields || typeof submission.fields !== 'object') {
		return Response.json(
			{ error: 'No enquiry details were supplied.' },
			{ status: 400 },
		)
	}

	const rawFields = submission.fields as Record<string, unknown>
	const fields = Object.fromEntries(
		enquiryFieldOrder[kind].map((name) => [name, cleanValue(rawFields[name])]),
	)
	const name = fields.name?.[0]
	const email = fields.email?.[0]
	const message = fields.message?.[0]

	if (!name || !message) {
		return Response.json(
			{ error: 'Please add your name and message.' },
			{ status: 400 },
		)
	}
	if (email && !emailPattern.test(email)) {
		return Response.json(
			{ error: 'Please enter a valid email address.' },
			{ status: 400 },
		)
	}

	const apiKey = process.env.RESEND_API_KEY
	const recipient = process.env.RESEND_TO_EMAIL
	const sender =
		process.env.RESEND_FROM_EMAIL || 'MV Art Studio <onboarding@resend.dev>'
	if (!apiKey || !recipient) {
		console.error('Resend enquiry delivery is not configured')
		return Response.json(
			{ error: 'Email delivery is temporarily unavailable.' },
			{ status: 503 },
		)
	}

	const value = (fieldName: string, fallback = 'Not provided') =>
		fields[fieldName]?.join(', ') || fallback
	const commonVariables = {
		CUSTOMER_NAME: name,
		EMAIL_ADDRESS: value('email'),
		PHONE: value('phone'),
		MESSAGE: message,
		PREFERRED_REPLY: value('preferredReply'),
	}
	const notificationVariables =
		kind === 'quote'
			? {
					...commonVariables,
					COMPANY: value('company'),
					PROJECT_TYPE: value('projectType'),
					PRODUCT_REFERENCE: value('productReference'),
					LOCATION: value('location'),
					DIMENSIONS: value('dimensions'),
					MATERIALS: value('materials'),
					FINISH: value('finish'),
					QUANTITY: value('quantity'),
					BUDGET: value('budget'),
					TIMELINE: value('timeline'),
					INSTALLATION: value('installation'),
					REFERENCES: value('references'),
				}
			: {
					...commonVariables,
					ENQUIRY_SUBJECT: value('subject'),
				}
	const notificationTemplate =
		kind === 'quote'
			? process.env.RESEND_QUOTE_NOTIFICATION_TEMPLATE ||
				'mvart-quote-request-notification'
			: process.env.RESEND_CONTACT_NOTIFICATION_TEMPLATE ||
				'mvart-general-enquiry-notification'
	const confirmationTemplate =
		kind === 'quote'
			? process.env.RESEND_QUOTE_CONFIRMATION_TEMPLATE ||
				'mvart-quote-request-confirmation'
			: process.env.RESEND_CONTACT_CONFIRMATION_TEMPLATE ||
				'mvart-general-enquiry-confirmation'

	const resend = new Resend(apiKey)
	try {
		const { error } = await resend.emails.send({
			from: sender,
			to: recipient,
			replyTo: email,
			template: {
				id: notificationTemplate,
				variables: notificationVariables,
			},
			tags: [{ name: 'enquiry_type', value: kind }],
		})

		if (error) {
			console.error('Resend rejected an enquiry email:', error.message)
			return Response.json(
				{ error: 'We could not send your message. Please try WhatsApp.' },
				{ status: 502 },
			)
		}
	} catch (error) {
		console.error(
			'Resend enquiry delivery failed:',
			error instanceof Error ? error.message : 'Unknown error',
		)
		return Response.json(
			{ error: 'We could not send your message. Please try WhatsApp.' },
			{ status: 502 },
		)
	}

	if (email) {
		const confirmationVariables: Record<string, string> =
			kind === 'quote'
				? {
						CUSTOMER_NAME: name,
						PROJECT_TYPE: value('projectType'),
						PRODUCT_REFERENCE: value('productReference', 'Your custom project'),
					}
				: {
						CUSTOMER_NAME: name,
						ENQUIRY_SUBJECT: value('subject', 'your enquiry'),
					}
		try {
			const { error: confirmationError } = await resend.emails.send({
				from: sender,
				to: email,
				replyTo: recipient,
				template: {
					id: confirmationTemplate,
					variables: confirmationVariables,
				},
				tags: [{ name: 'enquiry_type', value: `${kind}_confirmation` }],
			})
			if (confirmationError) {
				console.error(
					'Resend rejected an enquiry confirmation:',
					confirmationError.message,
				)
			}
		} catch (confirmationError) {
			console.error(
				'Resend enquiry confirmation failed:',
				confirmationError instanceof Error
					? confirmationError.message
					: 'Unknown error',
			)
		}
	}

	return Response.json({ ok: true })
}
