/**
 * Extracts URL search parameters from a request, optionally filtered by a namespace prefix
 * (e.g. `scope:key` → `key`). Without a scope, returns all search params as-is.
 *
 * @param request - The incoming request whose URL will be parsed.
 * @param scope - Namespace prefix to filter by (e.g. `"table"` matches `table:page`, `table:sort`).
 * @returns A `URLSearchParams` object with the matching params, stripped of the scope prefix.
 *
 * @example
 * ```typescript
 * // URL: /products?table:page=2&table:sort=asc&other=1
 * const params = getScopedParams(request, "table");
 * params.get("page");  // "2"
 * params.get("sort");  // "asc"
 * ```
 */

function getScopedParams(request: Request, scope: string = "") {
  const url = new URL(request.url);
  if (scope === "") return url.searchParams;

  const scopedSearchParams: [string, string][] = Array.from(
    url.searchParams.entries(),
  )
    .filter(([key]) => key.startsWith(`${scope}:`))
    .map(([key, value]) => [key.replace(`${scope}:`, ""), value]);

  return new URLSearchParams(scopedSearchParams);
}

export { getScopedParams };
