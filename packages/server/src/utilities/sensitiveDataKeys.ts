/**
 * Keys treated as sensitive wherever request/response data is written to a debug
 * log or sent to a telemetry sink (see `ApiService`'s debug output and the
 * `LogService` remote logging pipeline).
 *
 * Passed as the `sensitiveKeys` argument to `parseSensitiveData` (from `@arkyn/shared`)
 * so values are masked with `"****"` before they reach any console output or network
 * request.
 *
 * Both `lowerCase` and `Capitalized`/`Header-Case` variants are listed explicitly for
 * header-shaped keys (`Authorization`, `Cookie`, `Set-Cookie`, ...). This is
 * intentionally redundant with `parseSensitiveData`'s own case-insensitive matching:
 * it keeps this list correct regardless of which build of `parseSensitiveData` is
 * resolved at runtime, since a `Headers` instance lowercases names on iteration while
 * plain header objects commonly use `Authorization`/`Header-Case`.
 *
 * Extends the default `parseSensitiveData` key list (`password`, `confirmPassword`,
 * `creditCard`) with header/token-shaped keys that commonly carry credentials.
 */
const SENSITIVE_DATA_KEYS = [
	"password",
	"Password",
	"confirmPassword",
	"ConfirmPassword",
	"creditCard",
	"CreditCard",
	"authorization",
	"Authorization",
	"cookie",
	"Cookie",
	"set-cookie",
	"Set-Cookie",
	"setCookie",
	"SetCookie",
	"token",
	"Token",
	"refreshToken",
	"RefreshToken",
	"accessToken",
	"AccessToken",
	"apiKey",
	"ApiKey",
	"secret",
	"Secret",
] as const;

export { SENSITIVE_DATA_KEYS };
