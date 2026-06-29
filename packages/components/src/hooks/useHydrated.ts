import { useSyncExternalStore } from "react";

function subscribe() {
	return () => {};
}

/**
 * useHydrated — returns `true` once the component has hydrated on the client, `false` during SSR.
 *
 * Built on `useSyncExternalStore` so it is safe with React 18 concurrent rendering.
 * Use this when you need to defer client-only rendering (e.g. browser APIs, `window`, `navigator`)
 * without causing a hydration mismatch. For most cases, prefer the `ClientOnly` component.
 *
 * @returns `true` on the client after hydration; `false` on the server.
 *
 * @example
 * ```tsx
 * function Map() {
 *   const isHydrated = useHydrated();
 *   if (!isHydrated) return <Skeleton />;
 *   return <MapView accessToken={token} coordinates={coords} />;
 * }
 * ```
 */

function useHydrated() {
	return useSyncExternalStore(
		subscribe,
		() => true,
		() => false,
	);
}

export { useHydrated };
