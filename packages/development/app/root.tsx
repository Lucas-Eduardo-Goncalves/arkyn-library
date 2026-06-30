import { Switch } from "@arkyn/components/switch";
import { useState } from "react";
import {
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";

import "./_app.css";
import "@arkyn/components/styles";

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	const [darkMode, setDarkMode] = useState(false);

	return (
		<html lang="en" className={darkMode ? "dark" : ""}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<div style={{ display: "flex", alignItems: "center" }}>
					<Switch
						unShowFieldTemplate
						name="darkMode"
						checked={darkMode}
						onCheck={() => setDarkMode(!darkMode)}
						style={{ margin: 20 }}
					/>

					<Link to="/">Back</Link>
				</div>

				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
