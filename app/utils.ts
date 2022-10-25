import * as Colors from '@radix-ui/colors'
import { css_beautify, js_beautify } from 'js-beautify'
import z from 'zod'

type GlobalOptions = {
	/**
	 * @defaultValue false
	 */
	classOutput: boolean
	/**
	 * @defaultValue false
	 */
	tailwindConfig: boolean
}

type SharedOptions = {
	/**
	 * @defaultValue ``
	 */
	cssVarPrefix: string
	/**
	 * @defaultValue `-`
	 */
	cssVarPrefixSeparator: string
	/**
	 * @defaultValue `-`
	 */
	stepSeparator: string
	/**
	 * @defaultValue `overlay`
	 */
	overlayId: string
	overlayIdSeparator: string
	/**
	 * @defaultValue `overlay`
	 */
	twOverlayId: string
	/**
	 * read more here: {@link https://tailwindcss.com/docs/text-color#changing-the-opacity}
	 * @defaultValue false
	 */
	twOpacityModifier: boolean
}

type Color = {
	name: string
	overlay: boolean
	options?: ColorOptions
}

type ColorOptions = {
	outputName?: string
	/**
	 * Determine which color to includes.
	 * Radix color steps in a range of 1 to 12,
	 * the steps: {@link https://www.radix-ui.com/docs/colors/palette-composition/understanding-the-scale#use-cases}
	 *
	 * @example
	 * ```
	 * includedColor = [1, 2, 3, 12]
	 * ```
	 */
	includedColor?: number[]
	/**
	 * If overlay is true you can choose which to includes.
	 * Radix color steps in a range of 1 to 12,
	 * the steps: {@link https://www.radix-ui.com/docs/colors/palette-composition/understanding-the-scale#use-cases}
	 *
	 * @example
	 * ```
	 * includedOverlay = [1, 2, 3, 12]
	 * ```
	 */
	includedOverlay?: number[]
	/**
	 * Change the default step identifier.
	 * Radix color steps in a range of 1 to 12,
	 * the steps: {@link https://www.radix-ui.com/docs/colors/palette-composition/understanding-the-scale#use-cases}
	 *
	 * @example
	 * map to tailwind steps:
	 * ```
	 * stepMapping = {
	 *    1: 50,
	 *    2: 100,
	 *    ...,
	 *    12: 900
	 * }
	 * ```
	 */
	stepMapping?: {
		[x: number]: number | string
	}
}

function extractColor(
	name: string,
	overlay: boolean,
	sharedOptions: SharedOptions,
	options?: ColorOptions
) {
	const {
		cssVarPrefix,
		cssVarPrefixSeparator,
		stepSeparator,
		overlayId,
		overlayIdSeparator,
	} = sharedOptions
	const outputName = options?.outputName ?? name

	function convertToCSSVars({
		mode,
		overlay,
	}: {
		mode: 'light' | 'dark'
		overlay: boolean
	}) {
		let css = ''

		const color =
			name === 'blackA' || name === 'whiteA'
				? name
				: `${name}${mode === 'dark' ? 'Dark' : ''}`

		Object.values(
			// @ts-expect-error
			Colors[color]
		).forEach((value, i) => {
			if (
				overlay &&
				options?.includedOverlay &&
				!options.includedOverlay.includes(i + 1)
			)
				return

			if (
				!overlay &&
				options?.includedColor &&
				!options.includedColor.includes(i + 1)
			)
				return

			css += `--${cssVarPrefix}${
				cssVarPrefix !== '' ? cssVarPrefixSeparator : ''
			}${outputName}${overlay ? overlayIdSeparator : ''}${
				overlay ? overlayId : ''
			}${stepSeparator}${
				options?.stepMapping && options.stepMapping[i + 1]
					? options.stepMapping[i + 1]
					: i + 1
			}: ${value};`
		})

		return css
	}

	return {
		light: convertToCSSVars({ mode: 'light', overlay: false }),
		lightOverlay: overlay
			? convertToCSSVars({ mode: 'light', overlay: true })
			: undefined,
		dark: convertToCSSVars({ mode: 'dark', overlay: false }),
		darkOverlay: overlay
			? convertToCSSVars({ mode: 'dark', overlay: true })
			: undefined,
	}
}

function generateTailwindPreset(colors: Color[], sharedOptions: SharedOptions) {
	function getColorStepVar({ name, overlay, options }: Color) {
		const {
			cssVarPrefix,
			cssVarPrefixSeparator,
			stepSeparator,
			overlayId,
			overlayIdSeparator,
			twOverlayId,
			twOpacityModifier,
		} = sharedOptions
		const outputName = options?.outputName ?? name

		function generateSteps(alpha: boolean = false) {
			let steps = ''

			function opacityModifierWrapper(str: string) {
				if (twOpacityModifier) {
					return `hsl(${str}) / <alpha-value>`
				}

				return str
			}

			;[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach((step) => {
				if (
					alpha &&
					options?.includedOverlay &&
					!options.includedOverlay.includes(step)
				)
					return

				if (
					!alpha &&
					options?.includedColor &&
					!options.includedColor.includes(step)
				)
					return

				steps += `${[
					options?.stepMapping && options.stepMapping[step]
						? options.stepMapping[step]
						: step,
				]}: '${opacityModifierWrapper(
					`var(--${cssVarPrefix}${
						cssVarPrefix !== '' ? cssVarPrefixSeparator : ''
					}${outputName}${alpha ? overlayIdSeparator : ''}${
						alpha && overlay ? overlayId : ''
					}${stepSeparator}${
						options?.stepMapping && options.stepMapping[step]
							? options.stepMapping[step]
							: step
					}`
				)})',`
			})

			return steps
		}

		const overlayColorObj = overlay
			? `${[twOverlayId]}: {${generateSteps(true)}},`
			: ''
		const colorObj = `${[outputName]}: {${generateSteps()}${overlayColorObj}},`

		return colorObj
	}

	let colorsObj = ''

	colors.forEach((color) => {
		colorsObj += getColorStepVar(color)
	})

	const tailwindPreset = `
    module.exports = {
      theme: {
        extend: {
          colors: {${colorsObj}},
        },
      },
    }
    `

	return js_beautify(tailwindPreset)
}

export function generateCSS(
	colors: Color[],
	options: { globalOptions: GlobalOptions; sharedOptions: SharedOptions }
) {
	let lightCSS = ''
	let darkCSS = ''
	const { classOutput, tailwindConfig } = options.globalOptions

	colors.forEach((color) => {
		const { light, dark, lightOverlay, darkOverlay } = extractColor(
			color.name,
			color.overlay,
			options.sharedOptions,
			color.options
		)

		lightCSS += light
		if (lightOverlay) lightCSS += lightOverlay
		darkCSS += dark
		if (darkOverlay) darkCSS += darkOverlay
	})

	function generateWrapper(
		str: string,
		mode: 'light' | 'dark',
		isClass: boolean = false
	) {
		const cssObj = options.sharedOptions.twOpacityModifier
			? str.replaceAll('hsl(', '').replaceAll(')', '').replaceAll(',', '')
			: str

		if (!isClass && mode === 'light') return `:root{${cssObj}}`

		if (!isClass && mode === 'dark')
			return `@media (prefers-color-scheme: dark){:root {${cssObj}}}`

		if (mode === 'light') return `.light{${cssObj}}`

		if (mode === 'dark') return `.dark{${cssObj}}`
	}

	return {
		css: css_beautify(`
            ${generateWrapper(lightCSS, 'light')}
            ${generateWrapper(darkCSS, 'dark')}
            ${classOutput ? generateWrapper(lightCSS, 'light', true) : ''}
            ${classOutput ? generateWrapper(darkCSS, 'dark', true) : ''}
    `),
		tailwindPreset: tailwindConfig
			? generateTailwindPreset(colors, options.sharedOptions)
			: undefined,
	}
}

export function parseColorQuery(request: Request) {
	let i = 0
	let run = true
	const searchParams = new URLSearchParams(request.url)
	const colors: Color[] = []
	do {
		const inputName = searchParams.get(`color[${i}]`)
		if (!inputName) {
			run = false
			break
		}

		let stepMapping: { [x: number]: number | string } = {}
		z.string()
			.parse(searchParams.get(`includedOverlay[${i}]`))
			.split(',')
			.forEach((val) => {
				if (val === '') return null

				const kv = val.split(':')
				stepMapping[Number.parseInt(kv[0])] = Number.isSafeInteger(kv[1])
					? Number.parseInt(kv[1])
					: kv[1]
			})

		let includedColorQuery = z
			.string()
			.parse(searchParams.get(`includedColor[${i}]`))
		if (includedColorQuery.startsWith(',')) {
			includedColorQuery = includedColorQuery.slice(1)
		}
		if (includedColorQuery.endsWith(',')) {
			includedColorQuery = includedColorQuery.slice(0, -1)
		}
		const includedColor = includedColorQuery.split(',').map(Number.parseInt)

		let includedOverlayQuery = z
			.string()
			.parse(searchParams.get(`includedOverlay[${i}]`))
		if (includedOverlayQuery.startsWith(',')) {
			includedOverlayQuery = includedOverlayQuery.slice(1)
		}
		if (includedOverlayQuery.endsWith(',')) {
			includedOverlayQuery = includedOverlayQuery.slice(0, -1)
		}
		const includedOverlay = includedOverlayQuery
			.split(',')
			.map((val) => Number.parseInt(val))

		const color: Color = {
			name: z.string().parse(inputName),
			overlay: searchParams.get(`overlay[${i}]`) === 'on' ? true : false,
			options: {
				outputName: z
					.string()
					.transform((val) => (val === '' ? undefined : val))
					.parse(searchParams.get(`outputName[${i}]`)),
				includedColor: Number.isNaN(includedColor[0])
					? undefined
					: includedColor,
				includedOverlay: Number.isNaN(includedOverlay[0])
					? undefined
					: includedOverlay,
				stepMapping:
					Object.keys(stepMapping).length === 0 ? undefined : stepMapping,
			},
		}

		colors.push(color)
		i += 1
	} while (run)

	return colors
}
