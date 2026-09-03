import { defineField } from 'sanity'
import { BasketIcon } from '@sanity/icons/Basket'
import { getBlockText } from '@/lib/utils'
import defineModule from '@/sanity/schemaTypes/fragments/define-module'

export default defineModule({
	name: 'product-catalog',
	title: 'Product catalog',
	type: 'object',
	icon: BasketIcon,
	groups: [{ name: 'content', default: true }, { name: 'options' }],
	fields: [
		defineField({ name: 'eyebrow', type: 'string', group: 'content' }),
		defineField({ name: 'intro', type: 'array', of: [{ type: 'block' }], group: 'content' }),
		defineField({ name: 'category', type: 'reference', to: [{ type: 'product.category' }], group: 'content' }),
		defineField({ name: 'featuredOnly', type: 'boolean', initialValue: false, group: 'options' }),
		defineField({ name: 'limit', type: 'number', initialValue: 12, validation: (Rule) => Rule.min(1).max(48), group: 'options' }),
		defineField({ name: 'layout', type: 'string', options: { list: ['grid', 'carousel'], layout: 'radio' }, initialValue: 'grid', group: 'options' }),
		defineField({ name: 'showCategoryFilter', type: 'boolean', initialValue: true, group: 'options', hidden: ({ parent }) => Boolean(parent?.category) }),
		defineField({ name: 'showMaterialFilter', type: 'boolean', initialValue: true, group: 'options' }),
	],
	preview: {
		select: { intro: 'intro', category: 'category.title' },
		prepare: ({ intro, category }) => ({ title: getBlockText(intro) || category || 'Product catalog', subtitle: 'Product catalog' }),
	},
})
