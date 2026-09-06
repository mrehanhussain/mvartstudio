import type { NextConfig } from 'next'
import { groq } from 'next-sanity'
import { sanity } from 'next-sanity/live/cache-life'
import { ROUTES } from './src/lib/env'
import { client } from './src/sanity/lib/client'

const nextConfig: NextConfig = {
	reactCompiler: true,

	cacheComponents: true,
	cacheLife: { default: sanity },

	// Allow Cursor/browser previews that hit the LAN/dev hostname.
	allowedDevOrigins: ['127.144.130.111', '127.0.0.1', 'localhost'],

	images: {
		localPatterns: [{ pathname: '/api/og' }],
		remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
	},

	async rewrites() {
		return [
			{ source: '/:slug.md', destination: '/api/md/:slug' },
			{ source: '/:path*/:slug.md', destination: '/api/md/:path*/:slug' },
		]
	},

	async redirects() {
		const sanityRedirects = await client.fetch(
			groq`*[_type == 'redirect']{
				source,
				'destination': select(
					destination.type == 'internal' =>
						select(
							destination.internal->._type == 'product.category' =>
								'/collections/' + destination.internal->slug.current,
							select(
								destination.internal->._type == 'blog.post' => $blogDir,
								''
							) + select(
								destination.internal->.metadata.slug.current == 'index' => '/',
								'/' + destination.internal->.metadata.slug.current
							)
						),
					destination.external
				),
				'permanent': true
			}`,
			{ blogDir: `/${ROUTES.blog}/` },
		)

		return [
			{ source: '/index', destination: '/', permanent: true },
			...sanityRedirects,
		]
	},
}

export default nextConfig
