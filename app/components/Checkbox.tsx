import * as React from 'react'

type BaseProps = {
	id: string
	label: string
	description?: string
	children?: React.ReactNode
}

type Props = BaseProps &
	Omit<
		React.ComponentPropsWithoutRef<'input'>,
		keyof BaseProps | 'type' | 'className'
	>

export default function Checkbox({
	id,
	label,
	description,
	children,
	...props
}: Props) {
	return (
		<fieldset className="flex items-center justify-between gap-4">
			<div>
				<label htmlFor={id} className="select-none font-medium text-gray-12">
					{label}
				</label>
				{children || description ? (
					<p className="text-sm text-gray-11">
						{description}
						{children}
					</p>
				) : null}
			</div>
			<input
				type="checkbox"
				id={id}
				className="h-6 w-6 rounded border-gray-7 bg-gray-3 text-gray-9 focus:ring-gray-8 focus:ring-offset-gray-1"
				{...props}
			/>
		</fieldset>
	)
}
