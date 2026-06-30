import { ClientOnly } from "@arkyn/components/clientOnly";

export default function ClientOnlyRoute() {
	return (
		<>
			<div className="exampleContainer row foreground">
				<ClientOnly fallback={<p>Loading... (SSR fallback)</p>}>
					{() => <p>Rendered after client-side hydration</p>}
				</ClientOnly>
			</div>

			<div className="exampleContainer row foreground">
				<ClientOnly>
					{() => (
						<p>Client window width: {typeof window !== "undefined" ? window.innerWidth : 0}px</p>
					)}
				</ClientOnly>
			</div>
		</>
	);
}
