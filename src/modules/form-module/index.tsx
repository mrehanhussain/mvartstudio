import { PortableText } from 'next-sanity'
import { Module } from '@/modules'
import type { Form, FormModule } from '@/sanity/types'
import Eyebrow from '@/ui/eyebrow'
import Resolver from './resolver'

export default function ({ eyebrow, intro, form, ...props }: FormModule) {
	return (
		<Module {...props}>
			<div className="section grid items-start gap-10 py-10 lg:grid-cols-[minmax(0,.78fr)_minmax(0,1.22fr)] lg:gap-14 lg:py-16 xl:gap-16">
				{intro && (
					<header className="prose lg:sticky-below-header min-w-0 [--offset:1rem]">
						<Eyebrow value={eyebrow} />
						<PortableText value={intro} />
					</header>
				)}

				<Resolver form={form as unknown as Form} />
			</div>
		</Module>
	)
}
