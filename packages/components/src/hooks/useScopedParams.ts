type ParamsType = Record<string, string | number | boolean | undefined>;

/**
 * useScopedParams — reads and writes URL search parameters with an optional namespace prefix.
 *
 * When `scope` is provided, every key is namespaced as `scope:key`, so multiple features
 * can share the same URL without collisions (e.g. `filters:status` and `table:page`).
 *
 * @param searchString - Current URL search string (e.g. `location.search`).
 * @param scope - Namespace prefix. Default: `""` (no prefix).
 *
 * @returns
 * - `getParam(key)` — returns the (scoped) param value, or `null` if absent.
 * - `getScopedSearch(params)` — merges `params` into the existing search string and returns the result.
 *   Pass `undefined` as a value to delete that param.
 *
 * @example
 * ```tsx
 * // Without scope — plain key/value params
 * const { getParam, getScopedSearch } = useScopedParams(location.search);
 * getParam('page');                          // "1"
 * getScopedSearch({ page: 2, sort: 'name' }); // "?page=2&sort=name"
 * ```
 *
 * @example
 * ```tsx
 * // With scope — all keys prefixed as "filters:key"
 * const { getParam, getScopedSearch } = useScopedParams(location.search, 'filters');
 * getParam('status');                                       // reads "filters:status"
 * getScopedSearch({ status: 'active', category: undefined }); // removes "filters:category"
 * ```
 */

function useScopedParams(searchString: string, scope: string = "") {
	const searchParams = new URLSearchParams(searchString);
	const prefix = scope ? `${scope}:` : "";

	const updateSearchParams = (params: ParamsType) => {
		Object.entries(params).forEach(([key, value]) => {
			if (value === undefined) {
				searchParams.delete(`${prefix}${key}`);
			} else {
				searchParams.set(`${prefix}${key}`, String(value));
			}
		});
	};

	return {
		getParam: (key: string) => searchParams.get(`${prefix}${key}`),
		getScopedSearch: (params: ParamsType) => {
			updateSearchParams(params);
			let search = searchParams.toString();
			if (search) search = `?${search}`;
			return search;
		},
	};
}

export { useScopedParams };
