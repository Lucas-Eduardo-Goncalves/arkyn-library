import { useLocation } from "react-router";

type ParamsType = Record<string, string | number | boolean | undefined>;

/**
 * useScopedParams hook - used to manage URL search parameters with optional scoping
 *
 * @param scope - Optional scope prefix for parameters. Default: ""
 *
 * @returns Object containing parameter management functions
 * @returns getParam - Function to get a parameter value by key
 * @returns getScopedSearch - Function to generate search string with updated parameters
 *
 * @example
 * ```tsx
 * // Basic usage without scope
 * const { getParam, getScopedSearch } = useScopedParams();
 *
 * // Get a parameter value
 * const userId = getParam('userId'); // Gets 'userId' from URL
 *
 * // Generate search string with new parameters
 * const searchString = getScopedSearch({ page: 1, filter: 'active' });
 * // Result: "?page=1&filter=active"
 * ```
 *
 * @example
 * ```tsx
 * // Usage with scope
 * const { getParam, getScopedSearch } = useScopedParams('filters');
 *
 * // Get a scoped parameter value
 * const status = getParam('status'); // Gets 'filters:status' from URL
 *
 * // Generate search string with scoped parameters
 * const searchString = getScopedSearch({
 *   status: 'active',
 *   category: 'tech',
 *   page: undefined // This will remove 'filters:page' from URL
 * });
 * // Result: "?filters:status=active&filters:category=tech"
 * ```
 *
 * @example
 * ```tsx
 * // Real-world usage in a filter component
 * function ProductFilter() {
 *   const { getParam, getScopedSearch } = useScopedParams('product');
 *   const navigate = useNavigate();
 *
 *   const handleFilterChange = (newFilters: Record<string, any>) => {
 *     const searchString = getScopedSearch(newFilters);
 *     navigate({ search: searchString });
 *   };
 *
 *   const currentCategory = getParam('category');
 *
 *   return (
 *     <div>
 *       <p>Current category: {currentCategory}</p>
 *       <button onClick={() => handleFilterChange({ category: 'electronics' })}>
 *         Electronics
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */

function useScopedParams(scope: string = "") {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
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
