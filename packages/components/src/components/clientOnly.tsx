import { useHydrated } from "../hooks/useHydrated";

type ClientOnlyProps = {
  children(): React.ReactNode;
  fallback?: React.ReactNode;
};

/**
 * ClientOnly component - renders children only after hydration on the client side
 *
 * This component prevents hydration mismatches by rendering different content during SSR
 * and after client-side hydration. It's useful for components that rely on browser APIs
 * or need to render differently on server and client.
 *
 * @param props - ClientOnly component properties
 * @param props.children - Function that returns React nodes to render after hydration
 * @param props.fallback - Optional React node to render during SSR or before hydration
 *
 * @returns React fragment containing either fallback content or children based on hydration state
 *
 * @example
 * ```tsx
 * // Basic usage with loading fallback
 * <ClientOnly fallback={<div>Loading...</div>}>
 *   {() => <InteractiveWidget />}
 * </ClientOnly>
 *
 * // Client-only component without fallback
 * <ClientOnly>
 *   {() => (
 *     <div>
 *       <p>This content only appears on the client</p>
 *       <p>Current time: {new Date().toLocaleString()}</p>
 *     </div>
 *   )}
 * </ClientOnly>
 *
 * // Using with browser APIs
 * <ClientOnly fallback={<div>Preparing location services...</div>}>
 *   {() => <GeolocationComponent />}
 * </ClientOnly>
 *
 * // Complex interactive component
 * <ClientOnly fallback={<StaticPlaceholder />}>
 *   {() => (
 *     <div>
 *       <Chart data={chartData} />
 *       <InteractiveControls />
 *       <RealtimeUpdates />
 *     </div>
 *   )}
 * </ClientOnly>
 *
 * // Conditional rendering based on client capabilities
 * <ClientOnly fallback={<BasicTable data={data} />}>
 *   {() => (
 *     <AdvancedDataGrid
 *       data={data}
 *       features={['sorting', 'filtering', 'virtualization']}
 *     />
 *   )}
 * </ClientOnly>
 *
 * // Using with dynamic imports
 * <ClientOnly fallback={<div>Loading editor...</div>}>
 *   {() => <LazyCodeEditor />}
 * </ClientOnly>
 *
 * // Preventing layout shift
 * <ClientOnly fallback={<div className="skeleton-loader" />}>
 *   {() => <UserDashboard />}
 * </ClientOnly>
 *
 * // Multiple client-only sections
 * <div>
 *   <Header />
 *   <ClientOnly fallback={<div>Loading navigation...</div>}>
 *     {() => <InteractiveNavigation />}
 *   </ClientOnly>
 *   <MainContent />
 *   <ClientOnly>
 *     {() => <ChatWidget />}
 *   </ClientOnly>
 * </div>
 * ```
 */

function ClientOnly(props: ClientOnlyProps) {
  const { children, fallback = null } = props;
  return useHydrated() ? <>{children()}</> : <>{fallback}</>;
}

export { ClientOnly };
