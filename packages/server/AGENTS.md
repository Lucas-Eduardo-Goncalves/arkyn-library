# @arkyn/server — agent guide

Server-side building blocks for Remix/React Router loaders and actions, or any fetch-based backend: typed HTTP responses, request parsing, Zod-based schema validation, and validators for Brazilian documents and common fields. Use it instead of hand-rolling `Response.json(...)` calls, ad-hoc try/catch shapes, or one-off regex validators. Everything below is exact — signatures, throw behavior, and defaults — read directly from source, no need to open README.md or any other file for correct usage.

## Required setup

- ESM only: `import`, never `require()`.
- Peer deps: `zod` (required by `SchemaValidator`, `formParse`, `formAsyncParse`), `libphonenumber-js` (required only by `validatePhone`).

## Import convention — always prefer subpath imports

Prefer importing each class/function from its own subpath instead of the root barrel (`@arkyn/server`):

```typescript
import { decodeRequestBody } from "@arkyn/server/decodeRequestBody";
import { SchemaValidator } from "@arkyn/server/schemaValidator";
import { Created } from "@arkyn/server/created";
import { errorHandler } from "@arkyn/server/errorHandler";
```

**Naming rule**: the subpath is the export name with only its first letter lowercased — nothing else changes. `SchemaValidator` → `schemaValidator`, `ApiService` → `apiService`, `BadGateway` → `badGateway`; function exports that already start lowercase (`decodeRequestBody`, `validateCpf`, etc.) are unchanged. This is exact for every export in this package; each entry below states its own import line. There are no per-export CSS files in this package (no UI).

## Core pattern

Every route action/loader should follow this shape: decode the body, validate it, do the work, return a typed response, and let `errorHandler` translate anything thrown (including validation and business errors) into the right HTTP response.

```typescript
import { decodeRequestBody } from "@arkyn/server/decodeRequestBody";
import { SchemaValidator } from "@arkyn/server/schemaValidator";
import { Created } from "@arkyn/server/created";
import { errorHandler } from "@arkyn/server/errorHandler";
import { z } from "zod";

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});
const userValidator = new SchemaValidator(createUserSchema);

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await decodeRequestBody(request);
    const data = userValidator.formValidate(body); // throws UnprocessableEntity with fieldErrors on failure

    const user = await createUser(data);
    return new Created("User created", { user }).toJson();
  } catch (error) {
    return errorHandler(error);
  }
}
```

Throw the matching error class instead of returning ad-hoc error objects — `errorHandler` only recognizes `@arkyn/server`'s own classes (plus native `Response`), everything else falls back to a generic 500 `ServerError`.

## Success responses

All extend a common base exposing `.toResponse()` (returns a `Response` with `Content-Type: application/json`) and `.toJson()` (built on `Response.json()`, equivalent body). Constructor shape is the same for all except `NoContent`: `new X(message: string, body?: any)`. Response body is always `{ name, message, body }`.

| Class | Import | Status | Constructor | Notes |
|---|---|---|---|---|
| `Success` | `@arkyn/server/success` | 200 | `(message: string, body?: any)` | General success. |
| `Created` | `@arkyn/server/created` | 201 | `(message: string, body?: any)` | New resource created. |
| `Updated` | `@arkyn/server/updated` | 200 | `(message: string, body?: any)` | Semantically "updated", same shape as `Success`. |
| `Found` | `@arkyn/server/found` | 302 | `(message: string, body?: any)` | Resource located, included in body. |
| `NoContent` | `@arkyn/server/noContent` | 204 | `(message: string)` | Only `.toResponse()` exists (no `.toJson()`); body is always `null`. |

## Error responses

All extend a common base exposing the same `.toResponse()`/`.toJson()` pair. Constructor shape for all of these: `new X(message: string, cause?: any)` — `cause` is serialized to JSON and included in the response body as `{ name, message, cause }`. Throw them (don't return them directly) and let `errorHandler` convert to a `Response`.

| Class | Import | Status | Meaning |
|---|---|---|---|
| `BadRequest` | `@arkyn/server/badRequest` | 400 | Malformed or invalid request. |
| `Unauthorized` | `@arkyn/server/unauthorized` | 401 | Missing/invalid credentials. |
| `Forbidden` | `@arkyn/server/forbidden` | 403 | Authenticated but not authorized. |
| `NotFound` | `@arkyn/server/notFound` | 404 | Resource doesn't exist. |
| `Conflict` | `@arkyn/server/conflict` | 409 | Conflicts with current server state (e.g. duplicate). |
| `ServerError` | `@arkyn/server/serverError` | 500 | Unexpected server-side failure. |
| `BadGateway` | `@arkyn/server/badGateway` | 502 | Upstream server returned an invalid response. |
| `NotImplemented` | `@arkyn/server/notImplemented` | 501 | Functionality not yet supported. |

### `UnprocessableEntity` (422) — special shape

- Import: `import { UnprocessableEntity } from "@arkyn/server/unprocessableEntity";`

Constructor takes a single object, not `(message, cause)`:
```typescript
new UnprocessableEntity({
  message?: string;                       // default: "Unprocessable entity"
  fieldErrors?: Record<string, string>;    // per-field validation messages
  fields?: Record<string, string>;         // original submitted values, for repopulating forms
  data?: any;                              // extra data merged into the response cause
})
```
Response body: `{ name: "UnprocessableEntity", message, cause: { data, fieldErrors, fields } }`. This is what `SchemaValidator.formValidate`/`formAsyncValidate` throw automatically — you rarely construct it by hand.

## Validation

### SchemaValidator
- Import: `import { SchemaValidator } from "@arkyn/server/schemaValidator";`
```typescript
const validator = new SchemaValidator(schema); // constructor(schema: T extends ZodType)

validator.isValid(data: any): boolean                                    // never throws
validator.safeValidate(data: any): z.ZodSafeParseResult<z.infer<T>>       // never throws, full Zod result
validator.validate(data: any): z.infer<T>                                 // throws ServerError (trusted/internal data)
validator.formValidate(data: any, message?: string): z.infer<T>           // throws UnprocessableEntity (user input)
validator.formAsyncValidate(data: any, message?: string): Promise<z.infer<T>> // async refinements
```
`formValidate`/`formAsyncValidate` throw `UnprocessableEntity` with `fields`/`fieldErrors` populated from the Zod result, plus `data: { scrollTo: firstErrorFieldName }`.

### formParse
- Import: `import { formParse } from "@arkyn/server/formParse";`
- Signature: `formParse<T>([formData, schema]: [Record<string, any>, ZodType]): { success: true; data } | { success: false; fieldErrors; fields }`
- Functional, synchronous, never throws — the return-shape equivalent of `formValidate` without the class wrapper.

### formAsyncParse
- Import: `import { formAsyncParse } from "@arkyn/server/formAsyncParse";`
- Signature: `formAsyncParse<T>([formData, schema]: [Record<string, any>, ZodType]): Promise<{ success: true; data } | { success: false; fieldErrors; fields }>`
- Async variant using `schema.safeParseAsync`, for schemas with async refinements (e.g. uniqueness checks against a database).

## Brazilian document validators

All `(value: string) => boolean`, never throw:

- `validateCpf` — `import { validateCpf } from "@arkyn/server/validateCpf";` — strips formatting, checks 11 digits, rejects repeated-digit sequences, verifies both check digits.
- `validateCnpj` — `import { validateCnpj } from "@arkyn/server/validateCnpj";` — strips formatting, checks 14 digits, rejects repeated-digit sequences, verifies both check digits.
- `validateCep` — `import { validateCep } from "@arkyn/server/validateCep";` — exactly 8 numeric digits, formatted or not.
- `validateRg` — `import { validateRg } from "@arkyn/server/validateRg";` — `(rawRg: string): boolean`, generic structural check: removes non-alphanumeric characters, requires length 7–9, optionally allows a trailing letter verifier (no state-specific format support).

## Generic validators

- `validateEmail` — `import { validateEmail } from "@arkyn/server/validateEmail";` — `(email: string): Promise<boolean>`, async. Checks basic format, RFC 5322 syntax, **and** DNS MX/A/AAAA resolution of the domain — a syntactically valid but non-existent domain returns `false`.
- `validatePassword` — `import { validatePassword } from "@arkyn/server/validatePassword";` — `(rawPassword: string): boolean`, at least 8 chars, 1 uppercase, 1 letter, 1 number, 1 special character.
- `validatePhone` — `import { validatePhone } from "@arkyn/server/validatePhone";` — `(rawPhone: string): boolean`, parses with `libphonenumber-js`, then confirms the resolved country is in `@arkyn/templates`'s country list.
- `validateDate` — `import { validateDate } from "@arkyn/server/validateDate";` — `(date: string, config?: { inputFormat?: "brazilianDate" | "isoDate" | "timestamp"; minYear?: number; maxYear?: number }): boolean`. `inputFormat` default `"brazilianDate"` (`DD/MM/YYYY`; `"isoDate"` is `MM-DD-YYYY`, `"timestamp"` is `YYYY-MM-DD`), `minYear` default `1900`, `maxYear` default `3000`. Rejects invalid calendar dates (e.g. Feb 29 on a non-leap year).

## Request utilities

#### decodeRequestBody
- Import: `import { decodeRequestBody } from "@arkyn/server/decodeRequestBody";`
- Signature: `decodeRequestBody(request: Request): Promise<any>`
- Reads the raw body, tries `JSON.parse` first, then falls back to `URLSearchParams` (only if the text contains `=`). Throws `BadRequest` if neither parse succeeds.

#### getScopedParams
- Import: `import { getScopedParams } from "@arkyn/server/getScopedParams";`
- Signature: `getScopedParams(request: Request, scope: string = ""): URLSearchParams`
- Without `scope`, returns `request`'s search params unmodified. With `scope`, returns only params prefixed `"${scope}:"`, with that prefix stripped from each key — e.g. scope `"table"` turns `?table:page=2` into a params object where `.get("page")` is `"2"`.

#### decodeRequestErrorMessage
- Import: `import { decodeRequestErrorMessage } from "@arkyn/server/decodeRequestErrorMessage";`
- Signature: `decodeRequestErrorMessage(data: any, response: Response): string`
- Extracts a human message from an API error payload, checking in order: `data.message`, `data.operator_erro_message`, `data.error`, `data.error.message`, `response.statusText`, falling back to `"Missing error message"`.

#### errorHandler
- Import: `import { errorHandler } from "@arkyn/server/errorHandler";`
- Signature: `errorHandler(error: any): Response`
- Catch-all for route actions/loaders. Recognizes all `@arkyn/server` success/error classes (calls `.toJson()`/`.toResponse()` on them) and native `Response` objects (returned as-is); anything else is wrapped in a `ServerError` 500.

#### flushDebugLogs
- Import: `import { flushDebugLogs } from "@arkyn/server/flushDebugLogs";`
- Signature: `flushDebugLogs(props: { name: string; scheme: "yellow" | "cyan" | "red" | "green"; debugs: string[] }): void`
- Prints colored `[name] line` output to `console.log`, one line per `debugs` entry. No-op unless `process.env.NODE_ENV === "development"` or `process.env.DEBUG_MODE === "true"`.

## Services

#### ApiService
- Import: `import { ApiService } from "@arkyn/server/apiService";`
```typescript
new ApiService({
  baseUrl: string;
  baseHeaders?: HeadersInit;   // merged into every request
  baseToken?: string | null;   // default Bearer token; overridable per-call via data.token
  enableDebug?: boolean;       // logs request/response via flushDebugLogs when true
})

api.get(endpoint: string, data?: { headers?; token?; urlParams?: Record<string,string> })
api.post(endpoint: string, data?: { body?; headers?; token?; urlParams? })
api.put(endpoint: string, data?: { body?; headers?; token?; urlParams? })
api.patch(endpoint: string, data?: { body?; headers?; token?; urlParams? })
api.delete(endpoint: string, data?: { body?; headers?; token?; urlParams? })
```
Every method returns whatever the underlying request helper resolves (an object including at least `status` and `message`). `token`/`urlParams` per-call override/extend the instance defaults; `Authorization: Bearer <token>` header is set automatically when a token is available.

#### DebugService (static)
- Import: `import { DebugService } from "@arkyn/server/debugService";`
- `DebugService.setIgnoreFile(file: string): void` — skip stack frames from files matching `file` (e.g. an internal adapter) so debug logs show the real caller.
- `DebugService.clearIgnoreFiles(): void`
- `DebugService.getCaller(): { functionName: string; callerInfo: string }` — used internally by the response classes' debug output; rarely called directly.

#### LogService (static)
- Import: `import { LogService } from "@arkyn/server/logService";`
- `LogService.setConfig(config: { trafficSourceId: string; userToken: string; logBaseApiUrl?: string }): void` — only applies on the **first** call; later calls are silently ignored until `resetConfig()`.
- `LogService.getConfig(): { trafficSourceId; userToken; apiUrl } | undefined`
- `LogService.resetConfig(): void`

## Related packages

- `@arkyn/shared` — reused internally for formatting/validation primitives (e.g. `ValidateDateService` backs `validateDate`); safe to import directly for the same formatting on the client.
- `@arkyn/templates` — country/locale data backing `validatePhone`.
