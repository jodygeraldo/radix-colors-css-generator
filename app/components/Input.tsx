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

export default function Input({
	id,
	label,
	description,
	children,
	...props
}: Props) {
	return (
		<fieldset className="items-center justify-between gap-4 sm:flex">
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

			<div className="relative mt-2 sm:mt-0">
				<input
					type="text"
					id={id}
					className="peer w-full rounded-md border-gray-7 bg-gray-3 shadow-sm focus:border-gray-8 focus:ring-gray-8 sm:text-sm"
					{...props}
				/>
				<div className="absolute inset-y-0 right-0 border-y border-transparent py-2 pr-3 text-sm text-gray-11 peer-optional:hidden">
					Required
				</div>
			</div>
		</fieldset>
	)
}
