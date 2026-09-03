import { defineArrayMember, defineField } from 'sanity'
import { SparklesIcon } from '@sanity/icons/Sparkles'
import { getBlockText } from '@/lib/utils'
import defineModule from '@/sanity/schemaTypes/fragments/define-module'

export default defineModule({
	name: 'hero-golden-spiral',
	title: 'Hero (golden spiral)',
	type: 'object',
	icon: SparklesIcon,
	groups: [
		{ name: 'content', default: true },
		{ name: 'image' },
		{ name: 'options' },
	],
	fields: [
		defineField({ name: 'eyebrow', type: 'string', group: 'content' }),
		defineField({
			name: 'content',
			type: 'array',
			of: [defineArrayMember({ type: 'block' })],
			group: 'content',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			type: 'array',
			of: [defineArrayMember({ type: 'cta' })],
			group: 'content',
			validation: (Rule) => Rule.max(2),
		}),
		defineField({
			name: 'highlights',
			title: 'Craft highlights',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					fields: [
						defineField({
							name: 'title',
							type: 'string',
							validation: (Rule) => Rule.required(),
						}),
					],
					preview: { select: { title: 'title' } },
				}),
			],
			group: 'content',
			validation: (Rule) => Rule.max(5),
		}),
		defineField({
			name: 'image',
			type: 'image',
			options: { hotspot: true, metadata: ['lqip'] },
			fields: [defineField({ name: 'alt', type: 'string' })],
			group: 'image',
		}),
	],
	preview: {
		select: { content: 'content', media: 'image' },
		prepare: ({ content, media }) => ({
			title: getBlockText(content) || 'Golden spiral hero',
			subtitle: 'Hero (golden spiral)',
			media,
		}),
	},
})
