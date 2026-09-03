import { PortableText } from 'next-sanity'
import { Module } from '@/modules'
import type { Form, FormModule } from '@/sanity/types'
import Eyebrow from '@/ui/eyebrow'
import Resolver from './resolver'

export default function ({ eyebrow, intro, form, ...props }: FormModule) {
	return (
		<Module {...props}>
			<div className="section grid items-start gap-10 py-10 md:grid-cols-[minmax(0,.72fr)_minmax(28rem,1.28fr)] md:py-16 lg:gap-16">
				{intro && (
					<header className="prose md:sticky-below-header [--offset:1rem]">
						<Eyebrow value={eyebrow} />
						<PortableText value={intro} />
					</header>
				)}

				<Resolver form={form as unknown as Form} />
			</div>
		</Module>
	)
}
