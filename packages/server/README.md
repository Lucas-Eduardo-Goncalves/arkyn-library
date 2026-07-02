# @arkyn/server

Comprehensive server-side utilities for building robust backend applications, featuring HTTP response helpers, error handlers, request utilities, and API configurations.

[![npm version](https://img.shields.io/npm/v/@arkyn/server.svg)](https://www.npmjs.com/package/@arkyn/server)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 🎯 What it solves

Backend code — Remix/React Router loaders and actions, or any fetch-based server — tends to reinvent the same plumbing on every project: consistent success/error response shapes, centralized error handling, request body/form parsing, schema validation, and validation of Brazilian documents (CPF/CNPJ/CEP/RG) plus generic fields (email/password/phone/date). `@arkyn/server` packages all of that into small, well-typed primitives so route handlers stay focused on business logic instead of response boilerplate.

## ✨ Features

- 🌐 **HTTP success responses** - `Success`, `Created`, `Updated`, `Found`, `NoContent` with `.toResponse()` / `.toJson()`
- 🚨 **HTTP error responses** - `BadRequest`, `Unauthorized`, `Forbidden`, `NotFound`, `Conflict`, `UnprocessableEntity`, `ServerError`, `BadGateway`, `NotImplemented`
- 🧵 **Request utilities** - body decoding, scoped query params, form parsing (sync/async), error-message extraction
- 🧪 **Schema validation via Zod** - `SchemaValidator` and the underlying `formParse` / `formAsyncParse` helpers
- 🇧🇷 **Brazilian document validators** - `validateCpf`, `validateCnpj`, `validateCep`, `validateRg`
- 🔤 **Generic validators** - `validateEmail`, `validatePassword`, `validatePhone`, `validateDate`
- 🛠️ **Debug & logging services** - `DebugService`, `LogService`, `flushDebugLogs`, plus `ApiService` for outbound HTTP calls

## 📋 Prerequisites

- **Node.js** `>=24.16.0` or **Bun** `>=1.3.14`
- Peer dependencies (install alongside `@arkyn/server`):
  - `zod >=4.4.3` — required by `SchemaValidator`, `formParse`, and `formAsyncParse`.
  - `libphonenumber-js >=1.13.7` — required by `validatePhone`.

## 📦 Installation

```bash
npm install @arkyn/server zod libphonenumber-js
```

## 🚀 Quick Start

```typescript
import { Success, BadRequest, errorHandler, decodeRequestBody } from "@arkyn/server";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await decodeRequestBody(request);

    if (!body.email) throw new BadRequest("Email is required");

    const user = await createUser(body);
    return new Success("User created", { user }).toJson();
  } catch (error) {
    return errorHandler(error);
  }
}
```

## 📖 API Reference

### HTTP Responses

Every response class extends a base with `.toResponse()` (returns a `Response` with a `Content-Type: application/json` header) and `.toJson()` (built on `Response.json()`). Both produce an equivalent JSON body — pick whichever reads better at the call site. `NoContent` only exposes `.toResponse()`, since it always returns a `null` body.

#### BadGateway

HTTP 502 — the upstream server returned an invalid or unexpected response.

```typescript
throw new BadGateway("Payment gateway unavailable");
```

#### BadRequest

HTTP 400 — the request is malformed or contains invalid data.

```typescript
throw new BadRequest("Invalid request body");
```

#### Conflict

HTTP 409 — the request conflicts with the current state of the server (e.g. duplicate record).

```typescript
throw new Conflict("Email already in use");
```

#### Forbidden

HTTP 403 — authenticated but not authorized to access this resource.

```typescript
throw new Forbidden("You don't have permission to delete this resource");
```

#### NotFound

HTTP 404 — the requested resource does not exist.

```typescript
throw new NotFound("Product not found");
```

#### NotImplemented

HTTP 501 — the server does not support the functionality required to fulfill the request.

```typescript
throw new NotImplemented("Webhook delivery is not yet implemented");
```

#### ServerError

HTTP 500 — an unexpected condition prevented the server from fulfilling the request.

```typescript
throw new ServerError("Failed to connect to the database");
```

#### Unauthorized

HTTP 401 — the request lacks valid authentication credentials.

```typescript
throw new Unauthorized("Invalid or expired token");
```

#### UnprocessableEntity

HTTP 422 — the request is well-formed but contains semantic validation errors. Typically used for form field validation failures.

```typescript
throw new UnprocessableEntity({
  message: "Validation failed",
  fieldErrors: { email: "Invalid email format", age: "Must be 18 or older" },
  fields: { email: "not-an-email", age: "15" },
});
```

#### Created

HTTP 201 — the request succeeded and a new resource was created.

```typescript
return new Created("User created successfully", { id: user.id }).toJson();
```

#### Found

HTTP 302 — the resource was located and the response includes it in the body.

```typescript
return new Found("Products retrieved", { products }).toJson();
```

#### NoContent

HTTP 204 — the request succeeded but there is no content to return. Typically used for delete or update operations where a body is not needed.

```typescript
return new NoContent("Record deleted").toResponse();
```

#### Success

HTTP 200 — the request succeeded and the response body contains the result.

```typescript
return new Success("Order fetched", { order }).toJson();
```

#### Updated

HTTP 200 — the request succeeded and the resource was updated. Semantically equivalent to `Success` but signals an update operation to consumers.

```typescript
return new Updated("Profile updated", { user }).toJson();
```

### Services

#### ApiService

HTTP client for external API calls. Wraps `fetch` with a base URL, default headers, an optional auth token, and per-request overrides for `get`, `post`, `put`, `patch`, and `delete`.

```typescript
const api = new ApiService({
  baseUrl: "https://api.example.com",
  baseToken: session.token,
  enableDebug: true,
});

const { data } = await api.get("/users/me");
const { data: created } = await api.post("/orders", { body: { productId: 1 } });
```

#### DebugService

Static service that manages stack-trace configuration for debug output, allowing specific adapter/wrapper files to be skipped so logs show the actual business-logic caller. Used internally by the HTTP response classes; `setIgnoreFile` / `clearIgnoreFiles` let you tune it, and `getCaller()` returns `{ functionName, callerInfo }`.

```typescript
// Skip httpAdapter.ts so debug output shows the calling route instead
DebugService.setIgnoreFile("httpAdapter.ts");
```

#### LogService

Static service for log endpoint configuration. Stores a singleton configuration containing the traffic source identifier, user token, and log ingestion URL; `setConfig` only applies on the first call, `getConfig` reads it back, and `resetConfig` clears it.

```typescript
LogService.setConfig({
  trafficSourceId: "my-app",
  userToken: session.token,
});

LogService.getConfig(); // { trafficSourceId, userToken, apiUrl }
```

### Utilities

#### decodeRequestBody

Decodes a request body into a plain object, trying JSON first then URL-encoded form data. Throws `BadRequest` if neither format can be parsed.

```typescript
export async function action({ request }: ActionFunctionArgs) {
  const body = await decodeRequestBody(request);
  // body is now a plain JS object
}
```

#### decodeRequestErrorMessage

Extracts a human-readable error message from an API response body or a `Response` object. Checks `data.message`, `data.operator_erro_message`, `data.error`, `data.error.message`, and `response.statusText` in that order, falling back to `"Missing error message"`.

```typescript
const res = await fetch("/api/orders");
const data = await res.json().catch(() => null);
const message = decodeRequestErrorMessage(data, res);
```

#### errorHandler

Converts any thrown value into a `Response`. Recognizes all `@arkyn/server` success and error response classes, native `Response` objects, and falls back to a 500 `ServerError` for anything else. Intended to be used as the catch handler of a route action or loader.

```typescript
export async function action({ request }: ActionFunctionArgs) {
  try {
    const user = await findUser(id);
    if (!user) throw new NotFound("User not found");
    return new Success("User retrieved", { user }).toJson();
  } catch (error) {
    return errorHandler(error);
  }
}
```

#### flushDebugLogs

Writes colored `[name] message` lines to the console, but only when `NODE_ENV === "development"` or `DEBUG_MODE === "true"`. No-op in production.

```typescript
flushDebugLogs({
  name: "API",
  scheme: "cyan",
  debugs: ["POST /api/users", "Status: 201"],
});
```

#### formAsyncParse

Async variant of `formParse` — uses `safeParseAsync` to support Zod schemas with async refinements. Returns `{ success: true, data }` on success or `{ success: false, fieldErrors, fields }` on failure.

```typescript
const schema = z.object({ email: z.string().email() });
const result = await formAsyncParse([{ email: "bad" }, schema]);

if (!result.success) {
  console.log(result.fieldErrors); // { email: "Invalid email" }
}
```

#### formParse

Validates form data against a Zod schema synchronously. Returns `{ success: true, data }` on success or `{ success: false, fieldErrors, fields }` on failure.

```typescript
const schema = z.object({ name: z.string().min(1, "Required"), age: z.number().min(18) });
const result = formParse([{ name: "", age: 15 }, schema]);

if (!result.success) {
  console.log(result.fieldErrors); // { name: "Required", age: "..." }
}
```

#### getScopedParams

Extracts URL search parameters from a request, optionally filtered by a namespace prefix (e.g. `scope:key` → `key`). Without a scope, returns all search params as-is.

```typescript
// URL: /products?table:page=2&table:sort=asc&other=1
const params = getScopedParams(request, "table");
params.get("page"); // "2"
params.get("sort"); // "asc"
```

#### SchemaValidator

Wraps a Zod schema with convenience validation methods suited for server-side use: `isValid` (boolean check, never throws), `safeValidate` (raw Zod result, never throws), `validate` (throws `ServerError`, for trusted/internal data), and `formValidate` / `formAsyncValidate` (throw `UnprocessableEntity` with structured field errors, for user-submitted forms).

```typescript
const validator = new SchemaValidator(z.object({ email: z.string().email() }));

// Inside a Remix action:
const body = validator.formValidate(await decodeRequestBody(request));
```

### Validators

#### validateCep

Validates a Brazilian CEP (postal code). A valid CEP must contain exactly 8 numeric digits, optionally formatted as `"12345-678"`.

```typescript
validateCep("12345-678"); // true
validateCep("12345678"); // true
validateCep("ABCDE-123"); // false
```

#### validateCnpj

Validates a Brazilian CNPJ (Cadastro Nacional da Pessoa Jurídica) number: sanitizes non-digit characters, checks length (14 digits), rejects repeating-digit sequences, and verifies both check digits.

```typescript
validateCnpj("12.345.678/0001-95"); // false
validateCnpj("11.444.777/0001-61"); // true
```

#### validateCpf

Validates a Brazilian CPF number. Strips formatting, checks length, rejects repeated-digit sequences, and verifies both check digits with the CPF algorithm.

```typescript
validateCpf("123.456.789-09"); // false
validateCpf("111.444.777-35"); // true
```

#### validateDate

Validates a date string against a format and optional year bounds. `inputFormat` accepts `"brazilianDate"` (`DD/MM/YYYY`, default), `"isoDate"` (`MM-DD-YYYY`), or `"timestamp"` (`YYYY-MM-DD`); `minYear` defaults to `1900` and `maxYear` to `3000`.

```typescript
validateDate("31/12/2023"); // true
validateDate("2023-12-31", { inputFormat: "timestamp", minYear: 2000, maxYear: 2100 }); // true
validateDate("29/02/2023"); // false (not a leap year)
```

#### validateEmail

Validates an email address comprehensively: basic format, advanced RFC 5322 syntax rules, and DNS resolution (MX/A/AAAA records) of the domain. Async because of the DNS lookup.

```typescript
await validateEmail("user@gmail.com"); // true
await validateEmail("user@gmil.com"); // false (invalid domain)
await validateEmail("invalid-email"); // false (invalid format)
```

#### validatePassword

Validates a password: at least 8 characters, at least 1 uppercase letter, at least 1 letter, at least 1 number, and at least 1 special character.

```typescript
validatePassword("Senha@123"); // true
validatePassword("senha123"); // false (no uppercase, no special char)
```

#### validatePhone

Validates an international phone number using `libphonenumber-js`, then confirms the parsed country code is present in the supported countries list.

```typescript
validatePhone("+5532912345678"); // true (Brazil)
validatePhone("+55329123456178"); // false (invalid)
```

#### validateRg

Validates a Brazilian RG (Registro Geral) with a generic structural check: removes non-alphanumeric characters, requires a length of 7–9 characters, and optionally allows a trailing letter verifier.

```typescript
validateRg("12.345.678-9"); // true
validateRg("MG-12.345.678"); // false (not supported)
validateRg("12345678X"); // true
```

## 🔧 Advanced Usage

### Parse → validate → respond pipeline

```typescript
import {
  decodeRequestBody,
  SchemaValidator,
  Success,
  errorHandler,
} from "@arkyn/server";
import { z } from "zod";

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

const userValidator = new SchemaValidator(createUserSchema);

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await decodeRequestBody(request);

    // Throws UnprocessableEntity with fieldErrors/fields on failure
    const data = userValidator.formValidate(body);

    const user = await createUser(data);
    return new Success("User created", { user }).toJson();
  } catch (error) {
    return errorHandler(error);
  }
}
```

### Brazilian document validation before persisting

```typescript
import {
  decodeRequestBody,
  validateCpf,
  validateEmail,
  UnprocessableEntity,
  Created,
  errorHandler,
} from "@arkyn/server";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await decodeRequestBody(request);
    const fieldErrors: Record<string, string> = {};

    if (!validateCpf(body.cpf)) fieldErrors.cpf = "Invalid CPF";
    if (!(await validateEmail(body.email))) fieldErrors.email = "Invalid email";

    if (Object.keys(fieldErrors).length > 0) {
      throw new UnprocessableEntity({
        message: "Validation failed",
        fieldErrors,
        fields: body,
      });
    }

    const customer = await createCustomer(body);
    return new Created("Customer created", { customer }).toJson();
  } catch (error) {
    return errorHandler(error);
  }
}
```

## 📚 Documentation

Full documentation: [https://docs.arkyn.dev/docs/server/introduction](https://docs.arkyn.dev/docs/server/introduction)

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](./LICENSE.txt) file for details.
