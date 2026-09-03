import { defineArrayMember, defineField, defineType } from 'sanity'
import { BasketIcon } from '@sanity/icons/Basket'

export default defineType({
	name: 'product',
	title: 'Product',
	type: 'document',
	icon: BasketIcon,
	groups: [
		{ name: 'content', default: true },
		{ name: 'options' },
		{ name: 'metadata' },
	],
	fields: [
		defineField({ name: 'title', type: 'string', group: 'content', validation: (Rule) => Rule.required() }),
		defineField({
			name: 'slug',
			type: 'slug',
			options: { source: 'title' },
			group: 'content',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'category',
			type: 'reference',
			to: [{ type: 'product.category' }],
			group: 'content',
			validation: (Rule) => Rule.required(),
		}),
		defineField({ name: 'shortDescription', type: 'text', rows: 3, group: 'content', validation: (Rule) => Rule.max(220) }),
		defineField({ name: 'description', type: 'array', of: [defineArrayMember({ type: 'block' })], group: 'content' }),
		defineField({
			name: 'gallery',
			type: 'array',
			group: 'content',
			of: [defineArrayMember({
				type: 'image',
				options: { hotspot: true, metadata: ['lqip'] },
				fields: [defineField({ name: 'alt', type: 'string', validation: (Rule) => Rule.required() })],
			})],
			validation: (Rule) => Rule.min(1).required(),
		}),
		defineField({ name: 'sku', title: 'SKU', type: 'string', group: 'options' }),
		defineField({
			name: 'materials',
			type: 'array',
			of: [defineArrayMember({ type: 'string' })],
			options: { layout: 'tags' },
			group: 'options',
		}),
		defineField({
			name: 'dimensions',
			type: 'array',
			group: 'options',
			of: [defineArrayMember({
				name: 'dimensionOption',
				title: 'Size option',
				type: 'object',
				fields: [
					defineField({ name: 'label', type: 'string', validation: (Rule) => Rule.required() }),
					defineField({ name: 'value', type: 'string', validation: (Rule) => Rule.required() }),
				],
				preview: { select: { title: 'label', subtitle: 'value' } },
			})],
		}),
		defineField({
			name: 'finishes',
			type: 'array',
			of: [defineArrayMember({ type: 'string' })],
			options: { layout: 'tags' },
			group: 'options',
		}),
		defineField({
			name: 'availability',
			type: 'string',
			options: { list: [
				{ title: 'Made to order', value: 'made-to-order' },
				{ title: 'Ready to ship', value: 'ready-to-ship' },
				{ title: 'Custom enquiry', value: 'custom-enquiry' },
			], layout: 'radio' },
			initialValue: 'made-to-order',
			group: 'options',
		}),
		defineField({ name: 'displayPrice', type: 'string', description: 'Optional display price, including currency.', group: 'options' }),
		defineField({ name: 'featured', type: 'boolean', initialValue: false, group: 'options' }),
		defineField({ name: 'displayOrder', type: 'number', initialValue: 100, group: 'options' }),
		defineField({ name: 'metadata', type: 'metadata', group: 'metadata' }),
	],
	preview: {
		select: { title: 'title', category: 'category.title', sku: 'sku', media: 'gallery.0' },
		prepare: ({ title, category, sku, media }) => ({ title, subtitle: [category, sku].filter(Boolean).join(' · '), media }),
	},
	orderings: [
		{ name: 'displayOrder', title: 'Display order', by: [{ field: 'displayOrder', direction: 'asc' }] },
		{ name: 'title', title: 'Title', by: [{ field: 'title', direction: 'asc' }] },
	],
})
