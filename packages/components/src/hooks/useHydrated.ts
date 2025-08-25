import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/**
 * useHydrated hook - detects if the component is hydrated on the client side
 *
 * This hook is useful for preventing hydration mismatches when rendering different content
 * on server and client sides. It returns false during SSR and true after hydration.
 *
 * @returns Boolean indicating if the component is hydrated
 * - `true`: Component is hydrated on the client side
 * - `false`: Component is being rendered on the server side or before hydration
 *
 * @example
 * ```tsx
 * // Basic usage to prevent hydration mismatches
 * function ClientOnlyComponent() {
 *   const isHydrated = useHydrated();
 *
 *   if (!isHydrated) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <p>This content is only rendered on the client</p>
 *       <p>Current time: {new Date().toLocaleString()}</p>
 *     </div>
 *   );
 * }
 *
 * // Conditional rendering based on hydration state
 * function ResponsiveComponent() {
 *   const isHydrated = useHydrated();
 *
 *   return (
 *     <div>
 *       <h1>My App</h1>
 *       {isHydrated ? (
 *         <InteractiveWidget />
 *       ) : (
 *         <StaticPlaceholder />
 *       )}
 *     </div>
 *   );
 * }
 *
 * // Using with client-only features
 * function LocationComponent() {
 *   const isHydrated = useHydrated();
 *   const [location, setLocation] = useState(null);
 *
 *   useEffect(() => {
 *     if (isHydrated && navigator.geolocation) {
 *       navigator.geolocation.getCurrentPosition((pos) => {
 *         setLocation(pos.coords);
 *       });
 *     }
 *   }, [isHydrated]);
 *
 *   if (!isHydrated) {
 *     return <div>Preparing location services...</div>;
 *   }
 *
 *   return (
 *     <div>
 *       {location ? (
 *         <p>Your location: {location.latitude}, {location.longitude}</p>
 *       ) : (
 *         <p>Getting your location...</p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */

function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

export { useHydrated };
