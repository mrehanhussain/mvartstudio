/**
 * Golden-ratio spiral + nested rectangles from 21st.dev
 * "Hero Golden Spiral" by ncdai (hero-01).
 * Paths and viewBoxes are the published geometry — do not freehand redraw.
 */

export function GoldenSpiralMobile() {
	return (
		<svg
			aria-hidden="true"
			className="text-accent/40 pointer-events-none absolute inset-0 overflow-visible"
			viewBox="0 0 210 340"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g>
				<path
					d="M380.853 105.099L-201.625 464.632"
					stroke="currentColor"
					strokeDasharray="4 2"
					vectorEffect="non-scaling-stroke"
					opacity=".55"
				/>
				<path
					d="M-165.247 -267.831L369.777 600.141"
					stroke="currentColor"
					strokeDasharray="4 2"
					vectorEffect="non-scaling-stroke"
					opacity=".55"
				/>
			</g>

			<g opacity=".7">
				<path
					d="M209.5 260L130 260"
					stroke="currentColor"
					vectorEffect="non-scaling-stroke"
				/>
				<path
					d="M129.5 339.5L129.5 210"
					stroke="currentColor"
					vectorEffect="non-scaling-stroke"
				/>
				<path
					d="M159.5 260L159.5 210"
					stroke="currentColor"
					vectorEffect="non-scaling-stroke"
				/>
				<path
					d="M3.09944e-06 210L209.5 210"
					stroke="currentColor"
					vectorEffect="non-scaling-stroke"
				/>
				<path
					d="M160 240L130.133 240"
					stroke="currentColor"
					vectorEffect="non-scaling-stroke"
				/>
				<path
					d="M149.5 240L149.5 260"
					stroke="currentColor"
					vectorEffect="non-scaling-stroke"
				/>
			</g>

			<g opacity=".7">
				<rect
					x="159.5"
					y="210"
					width="30"
					height="30"
					transform="rotate(90 159.5 210)"
					stroke="currentColor"
					vectorEffect="non-scaling-stroke"
				/>
				<rect
					x="149.5"
					y="240"
					width="20"
					height="20"
					transform="rotate(90 149.5 240)"
					stroke="currentColor"
					vectorEffect="non-scaling-stroke"
				/>
				<rect
					x="159.5"
					y="240"
					width="20"
					height="10"
					transform="rotate(90 159.5 240)"
					stroke="currentColor"
					vectorEffect="non-scaling-stroke"
				/>
			</g>

			<path
				d="M149.643 239.897C155.106 239.897 159.619 244.414 159.619 249.882C159.619 255.35 155.106 259.868 149.643 259.868C138.717 259.868 129.69 250.833 129.69 239.897C129.69 223.493 143.23 209.941 159.619 209.941C186.935 209.941 209.5 232.527 209.5 259.868C209.5 303.613 173.396 339.75 129.69 339.75C58.6695 339.75 -1.22732e-05 281.027 -9.16589e-06 209.941C-4.14648e-06 95.1103 94.7738 0.24998 209.5 0.249985C395.69 0.250001 549.5 154.06 549.5 340.25"
				stroke="currentColor"
				strokeWidth="2"
				vectorEffect="non-scaling-stroke"
				opacity=".95"
			/>
		</svg>
	)
}

export function GoldenSpiralDesktop() {
	return (
		<svg
			aria-hidden="true"
			className="text-accent/40 pointer-events-none absolute inset-0 overflow-visible"
			viewBox="0 0 340 210"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g>
				<path
					d="M105.1 -170.853L464.633 411.625"
					stroke="currentColor"
					strokeDasharray="4 2"
					vectorEffect="non-scaling-stroke"
					opacity=".55"
				/>
				<path
					d="M-267.831 375.247L600.141 -159.777"
					stroke="currentColor"
					strokeDasharray="4 2"
					vectorEffect="non-scaling-stroke"
					opacity=".55"
				/>
			</g>

			<g opacity=".7">
				<path
					d="M260 0.5V80"
					stroke="currentColor"
					vectorEffect="non-scaling-stroke"
				/>
				<path
					d="M339.5 80.5H210"
					stroke="currentColor"
					vectorEffect="non-scaling-stroke"
				/>
				<path
					d="M210 210V0.5"
					stroke="currentColor"
					vectorEffect="non-scaling-stroke"
				/>
			</g>

			<g opacity=".7">
				<rect
					x="210"
					y="50.5"
					width="30"
					height="30"
					stroke="currentColor"
					vectorEffect="non-scaling-stroke"
				/>
				<rect
					x="240"
					y="60.5"
					width="20"
					height="20"
					stroke="currentColor"
					vectorEffect="non-scaling-stroke"
				/>
				<rect
					x="240"
					y="50.5"
					width="20"
					height="10"
					stroke="currentColor"
					vectorEffect="non-scaling-stroke"
				/>
			</g>

			<path
				d="M239.897 60.3571C239.897 54.894 244.414 50.381 249.882 50.381C255.35 50.381 259.868 54.894 259.868 60.3571C259.868 71.2835 250.833 80.3095 239.897 80.3095C223.493 80.3095 209.941 66.7704 209.941 50.381C209.941 23.0652 232.527 0.499999 259.868 0.5C303.613 0.499995 339.75 36.6043 339.75 80.3095C339.75 151.33 281.027 210 209.941 210C95.1103 210 0.25 115.226 0.25 0.5C0.250008 -185.69 154.06 -339.5 340.25 -339.5"
				stroke="currentColor"
				strokeWidth="2"
				vectorEffect="non-scaling-stroke"
				opacity=".95"
			/>
		</svg>
	)
}
