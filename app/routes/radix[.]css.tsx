import type { LoaderArgs } from '@remix-run/cloudflare'
import z from 'zod'
import { CheckboxAsString, parseQuery } from 'zodix'
import { generateCSS, parseColorQuery } from '~/utils'

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

	return new Response(result.css, {
		headers: {
			'content-type': 'text/css',
		},
	})
}
