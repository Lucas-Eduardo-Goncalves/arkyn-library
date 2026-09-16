// Compile-time-only type tests (TEST-06). Not executed by `vitest run` — this
// file's name deliberately doesn't match `*.test.tsx`/`*.spec.tsx`, so it's
// skipped by vitest's test runner but still picked up (and type-checked) by
// the existing `tsc --noEmit` typecheck script (see tsconfig.json's
// `include`), which is how these assertions actually get enforced.
import type { ComponentProps } from "react";
import { expectTypeOf } from "vitest";
import { Calendar } from "../calendar";

type CalendarProps = ComponentProps<typeof Calendar>;
type SingleProps = Extract<CalendarProps, { type: "single" }>;
type RangeProps = Extract<CalendarProps, { type: "range" }>;

// The union discriminates on `type`, so narrowing by it should change the
// shape of `value`/`onChange` — this is the core guarantee a discriminated
// union is supposed to provide, and isn't exercised by any runtime test.
expectTypeOf<SingleProps["value"]>().toEqualTypeOf<Date | undefined>();
expectTypeOf<RangeProps["value"]>().toEqualTypeOf<[Date, Date] | undefined>();
expectTypeOf<SingleProps["onChange"]>().toEqualTypeOf<
	((date: Date) => void) | undefined
>();
expectTypeOf<RangeProps["onChange"]>().toEqualTypeOf<
	((date: [Date, Date]) => void) | undefined
>();

// Valid usage for both modes.
<Calendar
	type="single"
	value={new Date()}
	onChange={(date) => date.getTime()}
/>;
<Calendar
	type="range"
	value={[new Date(), new Date()]}
	onChange={([start, end]) => [start.getTime(), end.getTime()]}
/>;
<Calendar type="single" />;
<Calendar type="range" />;

// A single-mode value must not be assignable where range mode expects
// `[Date, Date]`, and vice versa — this is exactly what would silently break
// if the union were ever accidentally collapsed into one shared shape.
// @ts-expect-error - single mode's value is a Date, not a [Date, Date] tuple
<Calendar type="single" value={[new Date(), new Date()]} />;
// @ts-expect-error - range mode's value is a [Date, Date] tuple, not a Date
<Calendar type="range" value={new Date()} />;
// @ts-expect-error - single mode's onChange receives a Date, not a tuple
<Calendar type="single" onChange={(date: [Date, Date]) => date.length} />;
// @ts-expect-error - range mode's onChange receives a [Date, Date], not a Date
<Calendar type="range" onChange={(date: Date) => date.getTime()} />;

// `type` is required and must be one of the two literal modes.
// @ts-expect-error - `type` is required
<Calendar />;
// @ts-expect-error - `type` must be "single" | "range", not an arbitrary string
<Calendar type="multiple" />;

// `variant` is shared across both modes and constrained to its own union.
expectTypeOf<CalendarProps["variant"]>().toEqualTypeOf<
	"basic" | "complete" | undefined
>();
// @ts-expect-error - "compact" isn't a valid variant
<Calendar type="single" variant="compact" />;
