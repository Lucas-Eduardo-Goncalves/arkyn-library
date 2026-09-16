// `xss` ships no bundled types and has no `@types/xss` package on npm.
// Narrow ambient declaration covering only the API this package actually uses.
declare module "xss" {
	type XssOptions = {
		whiteList?: Record<string, string[]>;
		stripIgnoreTag?: boolean;
		stripIgnoreTagBody?: boolean | string[];
	};

	function filterXSS(html: string, options?: XssOptions): string;

	export { filterXSS };
}
