import { useHydrated } from "../hooks/useHydrated";

type ClientOnlyProps = {
  /** Render function — called after hydration on the client. Required. */
  children(): React.ReactNode;
  /** Content rendered during SSR or before hydration. @default null */
  fallback?: React.ReactNode;
};

/**
 * ClientOnly — renders its children only after client-side hydration.
 *
 * Prevents React hydration mismatches for components that rely on browser-only APIs
 * (e.g. `window`, `navigator`, `document`). Uses `useHydrated` internally.
 *
 * @param props.children - Render function executed after hydration. Required.
 * @param props.fallback - Content shown during SSR / before hydration. Default: null
 *
 * @returns `children()` after hydration, otherwise `fallback`.
 *
 * @example
 * ```tsx
 * // With a skeleton fallback
 * <ClientOnly fallback={<Skeleton />}>
 *   {() => <InteractiveWidget />}
 * </ClientOnly>
 *
 * // Using browser APIs safely
 * <ClientOnly fallback={<p>Loading...</p>}>
 *   {() => <p>Current time: {new Date().toLocaleString()}</p>}
 * </ClientOnly>
 * ```
 */

function ClientOnly(props: ClientOnlyProps) {
  const { children, fallback = null } = props;
  return useHydrated() ? <>{children()}</> : <>{fallback}</>;
}

export { ClientOnly };
