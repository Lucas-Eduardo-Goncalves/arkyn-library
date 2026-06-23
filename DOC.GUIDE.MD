# Documentation Guide

This file defines the documentation standard for this project. When a function, class, component, or hook is provided alongside its JSDoc, generate a complete documentation file following the templates below.

---

## General Rules

- **Output language:** English
- **Output location:** Project root (e.g., `/button.mdx` or `/format-date.md`) — the author will move it to the correct folder
- **File format:**
  - React components → `.mdx`
  - Everything else (functions, classes, hooks) → `.md`
- **File naming:** kebab-case matching the exported name
  - `Button` → `button.mdx`
  - `formatDate` → `format-date.md`
  - `BadRequest` → `bad-request.md`
  - `ApiService` → `api-service.md`
  - `useDebounce` → `use-debounce.md`

---

## Doc Types & When to Use Each

| Type                  | Examples                                        | Template                                                   |
| --------------------- | ----------------------------------------------- | ---------------------------------------------------------- |
| React Component       | `Button`, `Input`, `Modal`                      | [Component (.mdx)](#1-react-component-mdx)                 |
| Utility Function      | `formatDate`, `generateId`, `ensureQuotes`      | [Utility Function (.md)](#2-utility-function-md)           |
| Server Response Class | `BadRequest`, `Created`, `NotFound`             | [Server Response Class (.md)](#3-server-response-class-md) |
| Service Class         | `ApiService`, `DebugService`, `SchemaValidator` | [Service Class (.md)](#4-service-class-md)                 |
| Validation Function   | `validateEmail`, `validateCpf`                  | [Validation Function (.md)](#5-validation-function-md)     |
| Hook                  | `useDebounce`, `usePagination`                  | [Hook (.md)](#6-hook-md)                                   |

---

## 1. React Component (`.mdx`)

### Sections (in order)

1. `# ComponentName` — H1 title
2. Raw MDX `import` block (no code fence) — import all used components from `@arkyn/components` and icons from `lucide-react`; import external example files if needed (e.g., complex interactive demos)
3. One-sentence description paragraph
4. Import code block (`tsx`)
5. `## Basic Usage` — Simplest possible usage, always with preview + code
6. Feature sections (`## Sizes`, `## Variants`, `## Color Schemes`, etc.) — one H2 per visual/behavioral feature, each with preview JSX and a code block
7. State sections (`## Disabled`, `## Loading`, `## Error state`) — if applicable
8. `## Properties` — all props listed inline (no table, no subsections)

### Preview JSX Pattern

Wrap live preview JSX in a `<div>` with the appropriate `className`:

```
<div className="noContent">          ← centered, single item
<div className="noContent row">      ← items in a horizontal row
<div className="noContent column">   ← items in a vertical column
```

Use `AlertContainer` / `AlertContent` / `AlertTitle` / `AlertDescription` / `AlertIcon` for notes and warnings inside the doc.
When using `AlertContainer`, the `schema` prop is required and must be one of `"info"`, `"danger"`, `"success"`, or `"warning"`.

```tsx
<AlertContainer schema="info">
  <AlertIcon />
  <AlertContent>
    <AlertTitle>Hidden input value</AlertTitle>
    <AlertDescription>
      The checkbox stores its submitted value in a hidden input. When checked,
      it submits `value` or `"checked"`; when unchecked, it submits an empty
      string.
    </AlertDescription>
  </AlertContent>
</AlertContainer>
```

### Properties Section Format

```md
## Properties

**`propName`** - `type` (default: `value`)
Description of what this prop controls.

**`propName`** - `type`
Description (no default when it's required or has no default).
```

### Full Template

````mdx
# ComponentName

import {
  ComponentName,
  AlertContainer,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@arkyn/components";

import { IconName } from "lucide-react";

Brief description of what the component does and when to use it.

```tsx
import { ComponentName } from "@arkyn/components";
```
````

## Basic Usage

<div className="noContent">
  <ComponentName />
</div>

```tsx
<ComponentName />
```

## Sizes

Description of available sizes.

<div className="noContent row">
  <ComponentName size="lg">Large</ComponentName>
  <ComponentName size="md">Medium</ComponentName>
  <ComponentName size="sm">Small</ComponentName>
</div>

```tsx
<ComponentName size="lg">Large</ComponentName>
<ComponentName size="md">Medium</ComponentName>
<ComponentName size="sm">Small</ComponentName>
```

## Properties

**`size`** - `"lg" | "md" | "sm"` (default: `"md"`)
Controls the size of the component.

**`variant`** - `"solid" | "outline" | "ghost"`
Visual style variant.

**`isLoading`** - `boolean` (default: `false`)
Renders a spinner and disables interaction.

````

---

## 2. Utility Function (`.md`)

### Sections (in order)

1. `# functionName` — H1 title (camelCase, exact export name)
2. One-sentence description
3. `## Import` — import code block (`ts`)
4. `## Parameters` — one H3 subsection per parameter
5. `## Usage example` — return type description + `typescript` code block
6. `## Errors` — only if the function throws; one bullet/paragraph per scenario + code block
7. `## Notes` — edge cases, caveats, related functions, performance considerations

### Parameter Section Format

```md
### `paramName` (required)

Description of the parameter and its role.

**Type:** `TypeName`

### `paramName` (optional)

Description.

**Type:** `TypeName`
**Default:** `defaultValue`
````

### Full Template

````md
# functionName

One-sentence description of what the function does.

## Import

```ts
import { functionName } from "@arkyn/package";
```
````

## Parameters

### `param1` (required)

Description of this parameter.

**Type:** `string`

### `param2` (optional)

Description of this parameter.

**Type:** `number`
**Default:** `0`

## Usage example

The function returns a formatted string.

**Type:** `string`

```typescript
import { functionName } from "@arkyn/package";

const result = functionName("input", 42);
console.log(result); // "output"
```

## Errors

**Error scenario name:** Description of when this error is thrown.

```typescript
import { functionName } from "@arkyn/package";

try {
  functionName("invalid");
} catch (error) {
  console.error(error); // Error: message
}
```

## Notes

- Note about edge case or behavior.
- Note about related functions.

````

---

## 3. Server Response Class (`.md`)

Covers both error responses (`BadRequest`, `Unauthorized`, etc.) and success responses (`Created`, `Success`, `Found`, etc.).

### Sections (in order)

1. `# ClassName` — H1 title
2. One-sentence description mentioning HTTP status code and purpose
3. `## Import`
4. `## Constructor` — bullet list of constructor parameters (no H3 subsections)
5. `## Methods` — bold `**method()**` format, one line per method
6. `## Usage example` — `typescript` code block with 2–4 realistic examples
7. `## Response structure` — JSON code block showing exact response shape
8. `## Notes` — debug behavior, optional params, common use cases

### Constructor Format

```md
## Constructor

- `paramName` (required): Description.
- `paramName` (optional): Description.
````

### Methods Format

```md
## Methods

**`toResponse()`** - Converts the instance to a `Response` object with JSON body.

**`toJson()`** - Alternative using `Response.json()` for the JSON response.
```

### Full Template

````md
# ClassName

The `ClassName` class represents an HTTP response with status code NNN. Description of when to use it.

## Import

```ts
import { ClassName } from "@arkyn/server";
```
````

## Constructor

- `message` (required): A descriptive message for the response.
- `body` (optional): Additional data to include in the response body.

## Methods

**`toResponse()`** - Converts the instance into a `Response` object with JSON body and `Content-Type: application/json` header.

**`toJson()`** - Alternative method using `Response.json()` for generating the JSON response.

## Usage example

```typescript
import { ClassName } from "@arkyn/server";

// Basic usage
throw new ClassName("Descriptive message");

// With body / cause
return new ClassName("Success message", { id: "123" }).toResponse();
```

## Response structure

```json
{
  "ok": true,
  "status": 201,
  "message": "Resource created"
}
```

## Notes

When instantiated, this class automatically emits a debug log showing where it originated. See [DebugService](../services/debug-service.md) for configuration.

Common use cases include ...

````

---

## 4. Service Class (`.md`)

Covers classes with constructor + methods (e.g., `ApiService`, `SchemaValidator`, `DebugService`).

### Sections (in order)

1. `# ClassName`
2. Description paragraph
3. `## Import`
4. `## Constructor` — description paragraph + parameter bullets + constructor code block
5. `## Methods` — bold `**method(params)**` format, grouped by category if needed
6. `## Usage example` — comprehensive `typescript` block covering all main methods
7. Additional reference sections if relevant (e.g., `## Header priority`, `## Error structure`)
8. `## Notes`

### Full Template

```md
# ClassName

Description of what this class does and when to use it.

## Import

```ts
import { ClassName } from "@arkyn/server";
````

## Constructor

Creates a new `ClassName` instance.

- `param1` (required): Description.
- `param2` (optional): Description. Default is `value`.

```typescript
const instance = new ClassName({
  param1: "value",
  param2: true,
});
```

## Methods

**`methodA(param)`** - Description of what it does.

**`methodB(param, options?)`** - Description of what it does.

## Usage example

```typescript
import { ClassName } from "@arkyn/server";

const instance = new ClassName({ param1: "value" });

// Method A
const result = instance.methodA("input");

// Method B with options
const result2 = instance.methodB("input", { key: "val" });
```

## Notes

- Note about behavior or integration.

````

---

## 5. Validation Function (`.md`)

Covers async or sync validation functions that return `boolean` or `Promise<boolean>`.

### Sections (in order)

1. `# validateName`
2. Description mentioning what is validated and validation layers (format, RFC, DNS, etc.)
3. `## Import`
4. `## Parameters` — H3 per param
5. `## Usage example` — return type + multiple `typescript` examples (valid and invalid inputs)
6. `## Validation Steps` — numbered H3 steps describing each validation layer (format check, domain check, etc.)
7. `## Notes` — async behavior, performance, RFC references, alternative approaches

### Full Template

```md
# validateName

The `validateName` function validates X. It performs Y-layer validation including Z.

## Import

```ts
import { validateName } from "@arkyn/server";
````

## Parameters

### `rawValue` (required)

The value to validate. Leading and trailing whitespace is trimmed before validation.

**Type:** `string`

## Usage example

The function returns a boolean indicating whether the value is valid.

**Type:** `boolean`

```typescript
import { validateName } from "@arkyn/server";

// Valid
const isValid1 = validateName("valid-input");
console.log(isValid1); // true

// Invalid
const isValid2 = validateName("invalid-input");
console.log(isValid2); // false
```

## Validation Steps

### 1. Format Check

Description of the regex or basic format rules.

### 2. Business Rule Check

Description of additional rules applied.

## Notes

- Note about performance, dependencies, or edge cases.

````

---

## 6. Hook (`.md`)

Covers React hooks (e.g., `useDebounce`, `usePagination`).

### Sections (in order)

1. `# useHookName`
2. Description
3. `## Import`
4. `## Parameters` — H3 per parameter
5. `## Return value` — describe the returned value or object properties
6. `## Usage example` — `tsx` code block showing real usage inside a component
7. `## Notes` — cleanup, dependencies, caveats

### Full Template

```md
# useHookName

One-sentence description of what the hook does.

## Import

```ts
import { useHookName } from "@arkyn/package";
````

## Parameters

### `param1` (required)

Description.

**Type:** `string`

### `param2` (optional)

Description.

**Type:** `number`
**Default:** `300`

## Return value

The hook returns X.

**Type:** `ReturnType`

| Property   | Type                  | Description |
| ---------- | --------------------- | ----------- |
| `value`    | `string`              | Description |
| `setValue` | `(v: string) => void` | Description |

## Usage example

```tsx
import { useHookName } from "@arkyn/package";

function MyComponent() {
  const result = useHookName("initial", 500);

  return <div>{result}</div>;
}
```

## Notes

- Note about cleanup or side effects.
- Note about dependency array behavior.

```

---

## Workflow: Generating Docs from JsDoc

When a function, class, component, or hook is provided with its JSDoc:

1. **Identify the type** using the table at the top of this guide
2. **Determine the file name** in kebab-case (e.g., `useDebounce` → `use-debounce.md`)
3. **Select the matching template** and populate every section
4. **Map JsDoc fields** to doc sections:
   - `@param` → `## Parameters` (one H3 per param)
   - `@returns` → `## Usage example` return type line
   - `@throws` → `## Errors`
   - `@example` → included inside `## Usage example`
   - `@deprecated` → Note at top after description
   - `@see` → links in `## Notes`
5. **Add realistic usage examples** even if not in JsDoc — infer from parameter types and description
6. **Generate the file at the project root** with the correct extension
```
