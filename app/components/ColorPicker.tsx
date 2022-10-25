type Props = {
	keys: string[]
}

export default function ColorPicker({ keys }: Props) {
	return (
		<div>
			<label
				htmlFor="radix-color-picker"
				className="block text-sm font-medium text-gray-12"
			>
				Radix Color
			</label>
			<select
				id="radix-color-picker"
				name="outputName[]"
				className="mt-1 block w-full rounded-md border-gray-7 bg-gray-3 py-2 pl-3 pr-10 text-base focus:border-gray-8 focus:outline-none focus:ring-gray-8 sm:text-sm"
				placeholder="Pick a color"
			>
				{keys.map((key) => (
					<option key={key}>{key}</option>
				))}
			</select>
		</div>
	)
}

export function Desktop() {
	return null
}
