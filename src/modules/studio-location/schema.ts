import { defineArrayMember, defineField } from 'sanity'
import { PiMapPin } from 'react-icons/pi'
import defineModule from '@/sanity/schemaTypes/fragments/define-module'

export default defineModule({
	name: 'studio-location',
	title: 'Studio location',
	type: 'object',
	icon: PiMapPin,
	groups: [{ name: 'content', default: true }, { name: 'location' }],
	fields: [
		defineField({ name: 'eyebrow', type: 'string', group: 'content' }),
		defineField({
			name: 'heading',
			type: 'string',
			group: 'content',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'description',
			type: 'text',
			rows: 3,
			group: 'content',
		}),
		defineField({
			name: 'address',
			type: 'text',
			rows: 3,
			group: 'location',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'mapUrl',
			title: 'Google Maps URL',
			type: 'url',
			group: 'location',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'email',
			type: 'email',
			group: 'location',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'phones',
			type: 'array',
			of: [defineArrayMember({ type: 'string' })],
			group: 'location',
			validation: (Rule) => Rule.required().min(1),
		}),
	],
	preview: {
		select: { title: 'heading', subtitle: 'address' },
		prepare: ({ title, subtitle }) => ({ title, subtitle }),
	},
})
