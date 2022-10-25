import type { LoaderArgs } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { Link, useLoaderData, useSearchParams } from '@remix-run/react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import css from 'react-syntax-highlighter/dist/cjs/languages/hljs/css'
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript'
import z from 'zod'
import { CheckboxAsString, parseQuery } from 'zodix'
import syntaxColor from '~/styles/syntax'
import { generateCSS, parseColorQuery } from '~/utils'
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('javascript', js)

export function loader({ request }: LoaderArgs) {
	const globalOptions = parseQuery(request, {
		classOutput: CheckboxAsString,
		tailwindConfig: CheckboxAsString,
	})
	const sharedOptions = parseQuery(request, {
		cssVarPrefix: z.string(),
		cssVarPrefixSeparator: z.string(),
		stepSeparator: z.string(),
		overlayId: z.string(),
		overlayIdSeparator: z.string(),
		twOverlayId: z.string(),
		twOpacityModifier: CheckboxAsString,
	})

	const colors = parseColorQuery(request)

	const result = generateCSS(colors, {
		globalOptions,
		sharedOptions,
	})

	return json({ result })
}

export default function ResultPage() {
	const { result } = useLoaderData<typeof loader>()
	const [searchParams] = useSearchParams()

	return (
		<div className="space-y-6">
			<div>
				<div className="items-center justify-between sm:flex">
					<h2 className="text-lg font-medium leading-6 text-gray-12">CSS</h2>
					<Link
						reloadDocument
						download
						to={`/radix.css?${searchParams.toString()}`}
						className="mt-2 rounded-md border border-gray-7 bg-gray-3 py-2 px-4 font-medium uppercase text-gray-12 transition-colors hover:bg-gray-4 focus:ring-gray-8 focus:ring-offset-gray-1 active:bg-gray-5 sm:mt-0"
					>
						Download CSS File
					</Link>
				</div>

				<div className="mt-4">
					<SyntaxHighlighter
						language="css"
						showLineNumbers
						// @ts-ignore
						style={syntaxColor}
						customStyle={{
							background: 'var(--slate-1)',
							color: 'var(--slate-11)',
							borderRadius: '0.375rem',
						}}
					>
						{result.css}
					</SyntaxHighlighter>
				</div>
			</div>

			{result.tailwindPreset ? (
				<div>
					<div className="items-center justify-between sm:flex">
						<h2 className="text-lg font-medium leading-6 text-gray-12">
							Tailwind Config
						</h2>
						<Link
							reloadDocument
							download
							to={`/radix-preset.config.js?${searchParams.toString()}`}
							className="mt-2 rounded-md border border-gray-7 bg-gray-3 py-2 px-4 font-medium uppercase text-gray-12 transition-colors hover:bg-gray-4 focus:ring-gray-8 focus:ring-offset-gray-1 active:bg-gray-5 sm:mt-0"
						>
							Download Tailwind Preset
						</Link>
					</div>

					<div className="mt-4">
						<SyntaxHighlighter
							language="javascript"
							showLineNumbers
							// @ts-ignore
							style={syntaxColor}
							customStyle={{
								background: 'var(--slate-1)',
								color: 'var(--slate-11)',
								borderRadius: '0.375rem',
							}}
						>
							{result.tailwindPreset}
						</SyntaxHighlighter>
					</div>
				</div>
			) : null}
		</div>
	)
}
