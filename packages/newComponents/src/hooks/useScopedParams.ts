type ParamsType = Record<string, string | number | boolean | undefined>;

/**
 * Utility function to manage URL search parameters with optional scoping.
 * Provides functionality to get parameters and generate updated search strings
 * while maintaining existing parameters.
 *
 * @param searchString - The current URL search parameters string (e.g., "page=1&filter=active")
 * @param scope - Optional scope prefix for parameters. When provided, parameters will be prefixed with "scope:". Default: ""
 *
 * @returns Object containing parameter management functions:
 * @returns getParam - Function to get a parameter value by key (considers scope if provided)
 * @returns getScopedSearch - Function to generate search string with updated parameters while preserving existing ones
 *
 * @example
 * ```tsx
 * // Basic usage without scope
 * const searchString = "page=1&filter=active";
 * const { getParam, getScopedSearch } = useScopedParams(searchString);
 *
 * // Get a parameter value
 * const page = getParam('page'); // Returns "1"
 * const filter = getParam('filter'); // Returns "active"
 *
 * // Generate search string with new/updated parameters
 * const newSearch = getScopedSearch({ page: 2, sort: 'name' });
 * // Result: "?page=2&filter=active&sort=name"
 * ```
 *
 * @example
 * ```tsx
 * // Usage with scope
 * const searchString = "filters:status=active&filters:category=tech&page=1";
 * const { getParam, getScopedSearch } = useScopedParams(searchString, 'filters');
 *
 * // Get a scoped parameter value
 * const status = getParam('status'); // Gets 'filters:status' from URL, returns "active"
 * const category = getParam('category'); // Gets 'filters:category' from URL, returns "tech"
 *
 * // Generate search string with scoped parameters
 * const newSearch = getScopedSearch({
 *   status: 'inactive',
 *   category: 'sports',
 *   price: 100,
 *   discount: undefined // This will remove 'filters:discount' from URL if it exists
 * });
 * // Result: "?filters:status=inactive&filters:category=sports&filters:price=100&page=1"
 * ```
 *
 * @example
 * ```tsx
 * // Real-world usage with React Router
 * import { useLocation, useNavigate } from 'react-router-dom';
 *
 * function ProductFilter() {
 *   const location = useLocation();
 *   const navigate = useNavigate();
 *   const { getParam, getScopedSearch } = useScopedParams(location.search, 'product');
 *
 *   const handleFilterChange = (newFilters: Record<string, any>) => {
 *     const searchString = getScopedSearch(newFilters);
 *     navigate({ search: searchString });
 *   };
 *
 *   const currentCategory = getParam('category');
 *   const currentPrice = getParam('price');
 *
 *   return (
 *     <div>
 *       <p>Current category: {currentCategory || 'All'}</p>
 *       <p>Current price filter: {currentPrice || 'None'}</p>
 *
 *       <button onClick={() => handleFilterChange({ category: 'electronics' })}>
 *         Electronics
 *       </button>
 *
 *       <button onClick={() => handleFilterChange({ category: undefined, price: undefined })}>
 *         Clear Filters
 *       </button>
 *     </div>
 *   );
 * }
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
      if (search) search = "?" + search;
      return search;
    },
  };
}

export { useScopedParams };
