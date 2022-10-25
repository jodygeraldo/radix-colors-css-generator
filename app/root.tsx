import {
	Link,
	Links,
	LiveReload,
	Meta,
	NavLink,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react'
import * as React from 'react'
import tailwindcssStylesUrl from '~/tailwind.css'

export function meta() {
	return {
		charset: 'utf-8',
		title: 'Radix Colors CSS Generator',
		description: 'Easily generate CSS and Tailwind CSS Preset for Radix Colors',
		viewport: 'width=device-width,initial-scale=1',
	}
}

export function links() {
	return [{ rel: 'stylesheet', href: tailwindcssStylesUrl }]
}

export default function App() {
	return (
		<Document>
			<Outlet />
		</Document>
	)
}

export function ErrorBoundary() {
	return (
		<Document>
			<div className="relative h-48 border border-dashed border-red-500/50">
				<Link
					to="/"
					className="absolute inset-0 flex items-center justify-center"
					title="Go back to home"
				>
					<div className="text-center">
						<p className="text-red-500">Something went wrong</p>
						<p className="text-sm text-gray-11">
							You will see this error likely because wrong syntax on inputs.
						</p>
					</div>
				</Link>
			</div>
		</Document>
	)
}

function Document({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body className="bg-gray-2">
				<div className="mx-auto max-w-7xl py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-3xl">
						<NavLink to="/">
							<h1 className="text-slate-12 text-4xl font-bold sm:text-5xl">
								Radix Colors CSS Generator
							</h1>
						</NavLink>

						<main className="mt-8">{children}</main>
					</div>
				</div>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}
