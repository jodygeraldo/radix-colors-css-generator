import * as Colors from '@radix-ui/colors'
import { json } from '@remix-run/cloudflare'
import { Form, useLoaderData } from '@remix-run/react'
import * as React from 'react'
import Checkbox from '~/components/Checkbox'
import Input from '~/components/Input'

export function loader() {
	const colorsKey = Object.keys(Colors).filter(
		(key) =>
			key === 'blackA' ||
			key === 'whiteA' ||
			!(key.includes('Dark') || key.at(-1) === 'A')
	)

	return json({ colorsKey })
}

export default function Index() {
	const [colorCount, setColorCount] = React.useState(1)

	return (
		<Form action="/result" className="space-y-6">
			<GlobalSection />

			<SharedSection />

			{Array.from({ length: colorCount }).map((_, idx) => (
				<ColorSection key={idx} index={idx} />
			))}

			<div className="flex justify-between">
				<button
					onClick={() => setColorCount((prev) => prev + 1)}
					type="button"
					className="rounded-md border border-gray-7 bg-gray-3 py-2 px-4 font-medium uppercase text-gray-12 transition-colors hover:bg-gray-4 focus:ring-gray-8 focus:ring-offset-gray-1 active:bg-gray-5"
				>
					Add Color
				</button>

				<button
					type="submit"
					className="rounded-md border border-gray-7 bg-gray-3 py-2 px-4 font-medium uppercase text-gray-12 transition-colors hover:bg-gray-4 focus:ring-gray-8 focus:ring-offset-gray-1 active:bg-gray-5"
				>
					Proceed
				</button>
			</div>
		</Form>
	)
}

function GlobalSection() {
	return (
		<section aria-labelledby="global-section">
			<div className="rounded-md shadow sm:overflow-hidden">
				<div className="bg-gray-1 py-6 px-4 sm:p-6">
					<h2
						id="global-section"
						className="text-lg font-medium leading-6 text-gray-12"
					>
						Global Options
					</h2>

					<div className="mt-6 space-y-4">
						<Checkbox
							id="class-output"
							name="classOutput"
							label="Class Output"
							description="This option will includes .light and .dark class."
						/>

						<Checkbox
							id="tailwind-config"
							name="tailwindConfig"
							label="Tailwind Config"
							description="Generate tailwind config for the Radix CSS custom properties."
						/>
					</div>
				</div>
			</div>
		</section>
	)
}

function SharedSection() {
	return (
		<section aria-labelledby="shared-section">
			<div className="rounded-md shadow sm:overflow-hidden">
				<div className="bg-gray-1 py-6 px-4 sm:p-6">
					<div>
						<h2
							id="shared-section"
							className="text-lg font-medium leading-6 text-gray-12"
						>
							Shared Options
						</h2>
						<p className="mt-1 text-sm text-gray-11">
							All this options will be share with all colors.
						</p>
					</div>

					<div className="mt-6 space-y-4">
						<Input
							id="css-variable-prefix"
							name="cssVarPrefix"
							label="CSS Variable Prefix"
							description="Prefix for generated CSS custom properties."
						/>

						<Input
							id="css-variable-prefix-separator"
							name="cssVarPrefixSeparator"
							label="CSS Variable Prefix Separator"
							description="The separator between prefix and color name."
							defaultValue="-"
						/>

						<Input
							id="step-separator"
							name="stepSeparator"
							label="Step Separator"
							description="The separator before the step number."
							defaultValue="-"
						/>

						<Input
							id="overlay-identifier"
							name="overlayId"
							label="Overlay Identifier"
							description="The identifier for overlay on CSS custom property."
							defaultValue="overlay"
						/>

						<Input
							id="overlay-identifier-separator"
							name="overlayIdSeparator"
							label="Overlay Identifier Separator"
							description="The separator between color name and overlay identifier."
							defaultValue="-"
						/>

						<Input
							id="tailwind-overlay-identifier"
							name="twOverlayId"
							label="Tailwind Overlay Identifier"
							description="The overlay identifier for tailwind classes."
							defaultValue="overlay"
						/>

						<Checkbox
							id="tailwind-opacity-modifier"
							name="twOpacityModifier"
							label="Tailwind Opacity Modifier"
						>
							<span>
								read on{' '}
								<a
									href="https://tailwindcss.com/docs/text-color#changing-the-opacity"
									target="_blank"
									rel="noopener noreferrer"
									className="decoration-slate-7 hover:decoration-slate-8 underline underline-offset-2 transition-colors"
									title="Link opens in a new tab"
								>
									Tailwind CSS Docs
								</a>
								.
							</span>
						</Checkbox>
					</div>
				</div>
			</div>
		</section>
	)
}

function ColorSection({ index }: { index: number }) {
	const { colorsKey } = useLoaderData<typeof loader>()
	const id1 = React.useId()
	const id2 = React.useId()
	const id3 = React.useId()
	const id4 = React.useId()
	const id5 = React.useId()
	const id6 = React.useId()

	return (
		<section aria-labelledby="color-section">
			<div className="rounded-md shadow sm:overflow-hidden">
				<div className="bg-gray-1 py-6 px-4 sm:p-6">
					<h2
						id="color-section"
						className="text-lg font-medium leading-6 text-gray-12"
					>
						Color Options
					</h2>

					<div className="mt-6 space-y-4">
						<div>
							<label
								htmlFor={`radix-color-picker-${id1}`}
								className="block text-sm font-medium text-gray-12"
							>
								Radix Color
							</label>
							<select
								id={`radix-color-picker-${id1}`}
								name={`color[${index}]`}
								className="mt-1 block w-full rounded-md border-gray-7 bg-gray-3 py-2 pl-3 pr-10 text-base focus:border-gray-8 focus:outline-none focus:ring-gray-8 sm:text-sm"
								placeholder="Pick a color"
							>
								{colorsKey.map((key) => (
									<option key={key}>{key}</option>
								))}
							</select>
						</div>

						<Input
							id={`output-name-${id2}`}
							name={`outputName[${index}]`}
							label="Output Name"
							description="Name that will be use for CSS custom properties and Tailwind classes."
						/>

						<Checkbox
							id={`overlay-${id3}`}
							name={`overlay[${index}]`}
							label="Overlay"
							description="Generate alpha colors."
						/>

						<Input
							id={`icluded-color-${id4}`}
							name={`includedColor[${index}]`}
							label="Color Step to Includes"
							description="List of color step to includes separate with comma(,)."
							placeholder="1,2,3"
						/>

						<Input
							id={`included-overlay-${id5}`}
							name={`includedOverlay[${index}]`}
							label="Overlay Step to Includes"
							description="List of overlay step to includes separate with comma(,)."
							placeholder="1,2,3"
						/>

						<Input
							id={`step-mapping-${id6}`}
							name={`stepMapping[${index}]`}
							label="Step Mapping"
							description="Map default step number to custom number separate with comma(,)."
							placeholder="1:50,2:100"
						/>
					</div>
				</div>
			</div>
		</section>
	)
}
