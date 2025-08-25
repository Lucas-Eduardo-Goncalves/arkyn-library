# @arkyn/server

A comprehensive server-side utilities package for building robust backend applications. Provides HTTP response helpers, error handlers, request utilities, and pre-configured API instances to streamline your server-side development workflow.

[![npm version](https://img.shields.io/npm/v/@arkyn/server.svg)](https://www.npmjs.com/package/@arkyn/server)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## ✨ Features

- 🌐 **HTTP Response Helpers** - Pre-built success and error response functions
- ⚙️ **API Configurations** - Ready-to-use API and logging instances
- 🔍 **Request Utilities** - Body parsing, parameter extraction, and debugging tools
- 🛡️ **Error Handling** - Comprehensive error handling and validation
- 🧪 **Schema Validation** - Zod integration for data validation
- 🚀 **Remix Integration** - Optimized for React Router and Remix applications

## 📦 Installation

```bash
npm install @arkyn/server
```

## 🚀 Quick Start

```typescript
import { Success, BadRequest, errorHandler } from "@arkyn/server";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const data = await fetchUserData();
    return Success(data);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await decodeRequestBody(request);

  if (!body.email) {
    return BadRequest("Email is required");
  }

  const user = await createUser(body);
  return Created(user);
}
```

## 📋 API Reference

### Configuration

#### ApiInstance

Pre-configured Axios instance for external API calls.

```typescript
import { ApiInstance } from "@arkyn/server";

const api = new ApiInstance({ baseUrl: "https://google.com" });
const response = await api.get("/users");
```

#### ArkynLogInstance

Pre-configured instance for integration with logging services.

```typescript
import { ArkynLogInstance } from "@arkyn/server";

ArkynLogInstance.setArkynConfig();
```

---

### HTTP Error Responses

#### BadRequest(message: string): Error

Returns HTTP 400 for client errors.

```typescript
import { BadRequest } from "@arkyn/server";

if (!email) {
  return BadRequest("Email is required");
}
```

#### Unauthorized(message: string): Error

Returns HTTP 401 for authentication errors.

```typescript
import { Unauthorized } from "@arkyn/server";

if (!isAuthenticated) {
  return Unauthorized("Authentication required");
}
```

#### Forbidden(message: string): Error

Returns HTTP 403 for authorization errors.

```typescript
import { Forbidden } from "@arkyn/server";

if (!hasPermission) {
  return Forbidden("Insufficient permissions");
}
```

#### NotFound(message: string): Error

Returns HTTP 404 for missing resources.

```typescript
import { NotFound } from "@arkyn/server";

const user = await findUser(id);
if (!user) {
  return NotFound("User not found");
}
```

#### Conflict(message: string): Error

Returns HTTP 409 for resource conflicts.

```typescript
import { Conflict } from "@arkyn/server";

const existingUser = await findUserByEmail(email);
if (existingUser) {
  return Conflict("Email already exists");
}
```

#### UnprocessableEntity(message: string): Error

Returns HTTP 422 for validation errors.

```typescript
import { UnprocessableEntity } from "@arkyn/server";

if (!isValidEmail(email)) {
  return UnprocessableEntity("Invalid email format");
}
```

#### ServerError(message: string): Error

Returns HTTP 500 for internal errors.

#### BadGateway(message: string): Error

Returns HTTP 502 for gateway errors.

#### NotImplemented(message: string): Error

Returns HTTP 501 for unimplemented features.

---

### HTTP Success Responses

#### Success(data: any): Response

Returns HTTP 200 with data.

```typescript
import { Success } from "@arkyn/server";

export async function loader() {
  const users = await getUsers();
  return Success(users);
}
```

#### Created(data: any): Response

Returns HTTP 201 for successful creation.

```typescript
import { Created } from "@arkyn/server";

export async function action({ request }) {
  const user = await createUser(await request.json());
  return Created(user);
}
```

#### Updated(data: any): Response

Returns HTTP 200 for successful updates.

```typescript
import { Updated } from "@arkyn/server";

const updatedUser = await updateUser(id, data);
return Updated(updatedUser);
```

#### NoContent(): Response

Returns HTTP 204 for successful operations without content.

```typescript
import { NoContent } from "@arkyn/server";

await deleteUser(id);
return NoContent();
```

#### Found(data: any): Response

Returns HTTP 302 for redirects with data.

```typescript
import { Found } from "@arkyn/server";

return Found({ redirectUrl: "/dashboard" });
```

---

### Utilities & Services

#### errorHandler(error: Error): Response

Centralized error handling that returns appropriate HTTP responses.

```typescript
import { errorHandler } from "@arkyn/server";

export async function action({ request }) {
  try {
    return await processRequest(request);
  } catch (error) {
    return errorHandler(error); // Automatically handles different error types
  }
}
```

#### decodeRequestBody(request: Request): any

Safely decodes JSON request bodies.

```typescript
import { decodeRequestBody } from "@arkyn/server";

export async function action({ request }) {
  const body = await decodeRequestBody(request);
  console.log(body); // Parsed JSON object
}
```

#### formParse(request: Request): FormData

Parses multipart form data from requests.

```typescript
import { formParse } from "@arkyn/server";

export async function action({ request }) {
  const formData = await formParse(request);
  const file = formData.get("avatar") as File;
}
```

#### getScopedParams(request: Request): URLSearchParams

Extracts URL parameters from requests.

```typescript
import { getScopedParams } from "@arkyn/server";

export async function loader({ request }) {
  const params = getScopedParams(request);
  const page = params.get("page") || "1";
}
```

#### SchemaValidator(schema: any, data: any): boolean

Validates data against Zod schemas.

```typescript
import { SchemaValidator } from "@arkyn/server";
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

export async function action({ request }) {
  const body = await decodeRequestBody(request);

  if (!SchemaValidator(userSchema, body)) {
    return BadRequest("Invalid data format");
  }
}
```

#### httpDebug(request: Request): void

Logs detailed information about HTTP requests for debugging.

```typescript
import { httpDebug } from "@arkyn/server";

export async function loader({ request }) {
  httpDebug(request); // Logs method, URL, headers, etc.
}
```

#### getCaller(): string

Returns the name of the calling function for debugging purposes.

```typescript
import { getCaller } from "@arkyn/server";

function myFunction() {
  console.log(`Called from: ${getCaller()}`);
}
```

#### decodeErrorMessageFromRequest(request: Request): string

Extracts error messages from request objects.

```typescript
import { decodeErrorMessageFromRequest } from "@arkyn/server";

const errorMessage = decodeErrorMessageFromRequest(request);
```

## 🔧 Advanced Usage

### Custom Error Handling

```typescript
import { errorHandler, BadRequest, ServerError } from "@arkyn/server";

export async function action({ request }) {
  try {
    const body = await decodeRequestBody(request);

    // Custom validation
    if (!body.email) {
      throw new BadRequest("Email is required");
    }

    const result = await processData(body);
    return Success(result);
  } catch (error) {
    if (error instanceof BadRequest) {
      return error; // Return as-is
    }

    // Log unexpected errors
    console.error("Unexpected error:", error);
    return ServerError("Internal server error");
  }
}
```

### Request Pipeline

```typescript
import {
  decodeRequestBody,
  SchemaValidator,
  getScopedParams,
  Success,
  BadRequest,
} from "@arkyn/server";

export async function action({ request }) {
  // 1. Parse request
  const body = await decodeRequestBody(request);
  const params = getScopedParams(request);

  // 2. Validate
  if (!SchemaValidator(mySchema, body)) {
    return BadRequest("Invalid request data");
  }

  // 3. Process
  const result = await processRequest(body, params);

  // 4. Respond
  return Success(result);
}
```

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to help improve the package.

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](./LICENSE.txt) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/Lucas-Eduardo-Goncalves/arkyn)
- [NPM Package](https://www.npmjs.com/package/@arkyn/server)
- [Full Documentation](https://github.com/Lucas-Eduardo-Goncalves/arkyn#readme)

---

Made with ❤️ by the Arkyn team
