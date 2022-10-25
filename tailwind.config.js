/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./app/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				gray: {
					1: 'var(--slate-1)',
					2: 'var(--slate-2)',
					3: 'var(--slate-3)',
					4: 'var(--slate-4)',
					5: 'var(--slate-5)',
					6: 'var(--slate-6)',
					7: 'var(--slate-7)',
					8: 'var(--slate-8)',
					9: 'var(--slate-9)',
					10: 'var(--slate-10)',
					11: 'var(--slate-11)',
					12: 'var(--slate-12)',
				},
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
}
