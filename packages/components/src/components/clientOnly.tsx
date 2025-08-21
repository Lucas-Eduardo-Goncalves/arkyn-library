import { useHydrated } from "../hooks/useHydrated";

type ClientOnlyProps = {
  children(): React.ReactNode;
  fallback?: React.ReactNode;
};

function ClientOnly(props: ClientOnlyProps) {
  const { children, fallback = null } = props;
  return useHydrated() ? <>{children()}</> : <>{fallback}</>;
}

export { ClientOnly };
