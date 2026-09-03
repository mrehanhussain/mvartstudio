import { defineArrayMember, defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons/Tag'

export default defineType({
	name: 'product.category',
	title: 'Product type',
	type: 'document',
	icon: TagIcon,
	fields: [
		defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
		defineField({
			name: 'slug',
			type: 'slug',
			options: { source: 'title' },
			validation: (Rule) => Rule.required(),
		}),
		defineField({ name: 'eyebrow', type: 'string' }),
		defineField({ name: 'description', type: 'text', rows: 4 }),
		defineField({
			name: 'image',
			type: 'image',
			options: { hotspot: true, metadata: ['lqip'] },
			fields: [defineField({ name: 'alt', type: 'string' })],
		}),
		defineField({
			name: 'materials',
			type: 'array',
			of: [defineArrayMember({ type: 'string' })],
			options: { layout: 'tags' },
		}),
		defineField({ name: 'displayOrder', type: 'number', initialValue: 100 }),
		defineField({ name: 'metadata', type: 'metadata' }),
	],
	preview: { select: { title: 'title', subtitle: 'description', media: 'image' } },
	orderings: [{ name: 'displayOrder', title: 'Display order', by: [{ field: 'displayOrder', direction: 'asc' }] }],
})
