import { PortableText } from 'next-sanity'
import { cn } from '@/lib/utils'
import { Module } from '@/modules'
import AccordionList from '@/modules/accordion-list'
import CustomHTML from '@/modules/custom-html'
import AnchoredHeading from '@/modules/prose/anchored-heading'
import Code from '@/modules/prose/code'
import Image from '@/modules/prose/image'
import Table from '@/modules/prose/table'
import type {
	BLOG_POST_QUERY_RESULT,
	BlogCategory,
	BlogPostContent,
	Cta,
	Person,
} from '@/sanity/types'
import Byline from '@/ui/blog/byline'
import Categories from '@/ui/blog/categories'
import Date from '@/ui/blog/date'
import Schema from '@/ui/blog/schema'
import CTAList from '@/ui/cta-list'
import Img from '@/ui/img'
import Sidebar from '@/ui/sidebar'
import css from './blog-post-content.module.css'

export default function ({
	post,
	sidebar,
	...props
}: { post: BLOG_POST_QUERY_RESULT } & BlogPostContent) {
	if (!post) return null

	return (
		<>
			<Module as="article" {...props}>
				<header className="section relative py-6 sm:py-8">
					<div className="border-border-subtle rounded-feature bg-art-backdrop relative isolate overflow-hidden border shadow-[0_24px_80px_rgba(0,0,0,.14)]">
						<Img
							image={post.metadata?.image}
							width={1600}
							className="absolute inset-0 size-full object-cover opacity-30"
							alt=""
							draggable={false}
							loading="eager"
						/>
						<span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,242,233,.98)_0%,rgba(247,242,233,.88)_48%,rgba(247,242,233,.55)_100%)]" />

						<div className="relative flex min-h-[clamp(28rem,52vw,38rem)] max-w-5xl flex-col justify-end p-6 sm:p-10 lg:p-14">
							<p className="text-primary mb-5 text-xs font-bold tracking-[.2em] uppercase">
								Journal
							</p>
							<h1
								className="max-w-4xl font-[var(--font-serif)] font-semibold tracking-[-.045em] text-balance"
								style={{
									fontSize: 'clamp(3.25rem, 6vw, 5.75rem)',
									lineHeight: 0.94,
								}}
							>
								{post.title || post.metadata?.title}
							</h1>

							<div className="border-border-default text-foreground/70 mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t pt-5 text-sm">
								<Byline author={post.author as unknown as Person} />
								<Categories
									categories={post.categories as BlogCategory[]}
									linked
									className="[&_a]:decoration-accent [&_a]:font-semibold"
								/>
								<Date date={post.publishDate} />
								<span>{Math.ceil(post.readTime)} min read</span>
							</div>
						</div>
					</div>
				</header>

				<section className="post-content section flex gap-10 py-12 max-md:flex-col md:items-start lg:gap-16 lg:py-16">
					<Sidebar
						{...sidebar}
						headings={post.headings}
						className="max-md:p-ch max-md:bg-current/5"
					/>

					<div className={cn(css.body, 'prose mx-auto grid w-full max-w-4xl')}>
						<PortableText
							value={post.content ?? []}
							components={{
								block: {
									h1: (node) => <AnchoredHeading as="h1" {...node} />,
									h2: (node) => <AnchoredHeading as="h2" {...node} />,
									h3: (node) => <AnchoredHeading as="h3" {...node} />,
									h4: (node) => <AnchoredHeading as="h4" {...node} />,
									h5: (node) => <AnchoredHeading as="h5" {...node} />,
									h6: (node) => <AnchoredHeading as="h6" {...node} />,
								},
								types: {
									image: Image,
									'accordion-list': ({ value }) => (
										<AccordionList
											{...value}
											className="p-0 [&_header]:text-left"
										/>
									),
									ctas: ({ value }) => (
										<CTAList ctas={value.ctas as Cta[] | undefined} />
									),
									code: Code,
									table: Table,
									'custom-html': ({ value }) => (
										<CustomHTML {...value} className="my-6" />
									),
								},
							}}
						/>
					</div>
				</section>
			</Module>

			<Schema post={post} />
		</>
	)
}
