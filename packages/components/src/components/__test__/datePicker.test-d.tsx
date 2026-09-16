// Compile-time-only type tests (TEST-06). See calendar.test-d.tsx for why
// this file's naming keeps it out of `vitest run` while still reaching the
// existing `tsc --noEmit` typecheck script.
import type { ComponentProps } from "react";
import { expectTypeOf } from "vitest";
import { DatePicker } from "../datePicker";

type DatePickerProps = ComponentProps<typeof DatePicker>;
type SingleProps = Extract<DatePickerProps, { type: "single" }>;
type RangeProps = Extract<DatePickerProps, { type: "range" }>;

// Same discriminated-union guarantee as Calendar, plus `name` (required,
// shared across both modes) and `rangeSeparator` (range-only).
expectTypeOf<SingleProps["value"]>().toEqualTypeOf<Date | undefined>();
expectTypeOf<RangeProps["value"]>().toEqualTypeOf<[Date, Date] | undefined>();
expectTypeOf<SingleProps["onChange"]>().toEqualTypeOf<
	((date: Date) => void) | undefined
>();
expectTypeOf<RangeProps["onChange"]>().toEqualTypeOf<
	((date: [Date, Date]) => void) | undefined
>();
expectTypeOf<SingleProps["name"]>().toEqualTypeOf<string>();
expectTypeOf<RangeProps["name"]>().toEqualTypeOf<string>();
expectTypeOf<RangeProps>().toHaveProperty("rangeSeparator");
expectTypeOf<SingleProps>().not.toHaveProperty("rangeSeparator");

// Valid usage for both modes.
<DatePicker type="single" name="date" value={new Date()} />;
<DatePicker
	type="range"
	name="stay"
	value={[new Date(), new Date()]}
	rangeSeparator=" to "
/>;
<DatePicker type="single" name="date" />;

// `name` is required regardless of mode (it's on the shared base props).
// @ts-expect-error - `name` is required
<DatePicker type="single" />;
// @ts-expect-error - `name` is required
<DatePicker type="range" />;

// `type` is required and constrained to its two literal modes.
// @ts-expect-error - `type` is required
<DatePicker name="date" />;
// @ts-expect-error - `type` must be "single" | "range"
<DatePicker type="multiple" name="date" />;

// Cross-wiring value/onChange between modes must not compile — this is the
// exact guarantee that silently breaks if the union is ever collapsed.
// @ts-expect-error - single mode's value is a Date, not a [Date, Date] tuple
<DatePicker type="single" name="date" value={[new Date(), new Date()]} />;
// @ts-expect-error - range mode's value is a [Date, Date] tuple, not a Date
<DatePicker type="range" name="stay" value={new Date()} />;

// `rangeSeparator` only exists on the range variant.
// @ts-expect-error - `rangeSeparator` isn't a single-mode prop
<DatePicker type="single" name="date" rangeSeparator=" to " />;

// Shared literal-union props are constrained, not arbitrary strings.
expectTypeOf<DatePickerProps["size"]>().toEqualTypeOf<
	"md" | "lg" | undefined
>();
expectTypeOf<DatePickerProps["variant"]>().toEqualTypeOf<
	"solid" | "outline" | "underline" | undefined
>();
// @ts-expect-error - "xl" isn't a valid size
<DatePicker type="single" name="date" size="xl" />;
// @ts-expect-error - "ghost" isn't a valid variant
<DatePicker type="single" name="date" variant="ghost" />;
