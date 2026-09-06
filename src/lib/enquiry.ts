export type EnquiryKind = 'contact' | 'quote'

export const QUOTE_PROJECT_TYPES = [
	'Name plates',
	'Memorials / gravestones',
	'Islamic calligraphy art',
	'Layered acrylic art',
	'Wood wall art',
	'Steel wall art',
	'Architectural signage',
	'Radium / reflective graphics',
	'Not sure yet',
] as const

const QUOTE_PROJECT_TYPE_ALIASES: Record<string, (typeof QUOTE_PROJECT_TYPES)[number]> =
	{
		'name-plates': 'Name plates',
		nameplates: 'Name plates',
		'name plates': 'Name plates',
		memorials: 'Memorials / gravestones',
		memorial: 'Memorials / gravestones',
		gravestones: 'Memorials / gravestones',
		gravestone: 'Memorials / gravestones',
		islamic: 'Islamic calligraphy art',
		'islamic-art': 'Islamic calligraphy art',
		'islamic-calligraphy': 'Islamic calligraphy art',
		acrylic: 'Layered acrylic art',
		'layered-acrylic': 'Layered acrylic art',
		wood: 'Wood wall art',
		steel: 'Steel wall art',
		signage: 'Architectural signage',
		'commercial-signage': 'Architectural signage',
		'architectural-signage': 'Architectural signage',
		radium: 'Radium / reflective graphics',
	}

export function resolveQuoteProjectType(raw?: string | null) {
	if (!raw) return ''
	const trimmed = raw.trim()
	const exact = QUOTE_PROJECT_TYPES.find((type) => type === trimmed)
	if (exact) return exact
	const key = trimmed.toLowerCase().replace(/_/g, '-')
	return (
		QUOTE_PROJECT_TYPE_ALIASES[key] ||
		QUOTE_PROJECT_TYPES.find((type) => type.toLowerCase() === key.replace(/-/g, ' ')) ||
		''
	)
}

export const enquiryFieldLabels: Record<string, string> = {
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

export const enquiryFieldOrder: Record<EnquiryKind, string[]> = {
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
