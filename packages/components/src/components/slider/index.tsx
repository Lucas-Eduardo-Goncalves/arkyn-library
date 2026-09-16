import {
	type HTMLAttributes,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

import "./styles.css";

type SliderProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
	/** Current slider position as a percentage (0–100). Required. */
	value: number;
	/** Callback fired whenever the value changes. Required. */
	onChange: (value: number) => void;
	/** Disables all drag, click, touch, and keyboard interactions. @default false */
	disabled?: boolean;
	/** Callback fired when the dragging state changes (`true` = drag started, `false` = drag ended). */
	onDragging?: (isDragging: boolean) => void;
	/**
	 * Amount ArrowLeft/ArrowRight/ArrowUp/ArrowDown move the value by.
	 * PageUp/PageDown move by 10× this amount. Home/End jump to 0/100.
	 * @default 1
	 */
	step?: number;
};

/**
 * Slider, interactive track for selecting a numeric value between 0 and 100.
 *
 * Pair with `useSlider` for managed state.
 *
 * @param props.value - Current position as a percentage (0–100). Required.
 * @param props.onChange - Callback fired on value change. Required.
 * @param props.disabled - Disables interactions. Default: false
 * @param props.onDragging - Callback fired when dragging starts or stops.
 * @param props.step - Keyboard ArrowLeft/Right/Up/Down increment. Default: 1
 *
 * Exposes `role="slider"` with `aria-valuemin`/`aria-valuemax`/`aria-valuenow`,
 * and supports keyboard interaction (ArrowLeft/ArrowDown to decrease,
 * ArrowRight/ArrowUp to increase, PageDown/PageUp for a larger step,
 * Home/End to jump to 0/100) and touch dragging in addition to mouse.
 *
 * **...Other valid HTML properties for `<div>`**
 *
 * @returns Slider JSX element.
 *
 * @example
 * ```tsx
 * // Controlled slider
 * const [value, setValue] = useState(50);
 * <Slider value={value} onChange={setValue} />
 *
 * // With useSlider hook
 * const [value, setValue] = useSlider(25);
 * <Slider value={value} onChange={setValue} onDragging={setIsDragging} />
 *
 * // Disabled
 * <Slider value={75} onChange={() => {}} disabled />
 * ```
 */

function clampPercentage(value: number): number {
	return Math.min(Math.max(value, 0), 100);
}

function Slider(props: SliderProps) {
	const {
		onChange,
		value,
		disabled = false,
		onDragging,
		className = "",
		step = 1,
		...rest
	} = props;

	const [isDragging, setIsDragging] = useState(false);
	const sliderRef = useRef<HTMLDivElement>(null);

	const getValueFromClientX = useCallback((clientX: number) => {
		if (!sliderRef.current) return null;

		const rect = sliderRef.current.getBoundingClientRect();
		if (rect.width === 0) return null;

		const offsetX = clientX - rect.left;
		return clampPercentage((offsetX / rect.width) * 100);
	}, []);

	const handleMouseDown = () => setIsDragging(true);
	const handleMouseUp = useCallback(() => setIsDragging(false), []);

	const handleMouseMove = useCallback(
		(event: MouseEvent) => {
			if (disabled || !isDragging) return;

			const newValue = getValueFromClientX(event.clientX);
			if (newValue !== null) onChange(newValue);
		},
		[disabled, isDragging, onChange, getValueFromClientX],
	);

	const handleTouchMove = useCallback(
		(event: TouchEvent) => {
			if (disabled || !isDragging) return;

			const touch = event.touches[0];
			if (!touch) return;

			const newValue = getValueFromClientX(touch.clientX);
			if (newValue !== null) onChange(newValue);
		},
		[disabled, isDragging, onChange, getValueFromClientX],
	);

	const handleSliderClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (disabled) return;

		const newValue = getValueFromClientX(event.clientX);
		if (newValue !== null) onChange(newValue);
	};

	const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
		if (disabled) return;
		setIsDragging(true);

		const touch = event.touches[0];
		if (!touch) return;

		const newValue = getValueFromClientX(touch.clientX);
		if (newValue !== null) onChange(newValue);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (disabled) return;

		const bigStep = step * 10;
		const keyToNewValue: Record<string, number> = {
			ArrowLeft: value - step,
			ArrowDown: value - step,
			ArrowRight: value + step,
			ArrowUp: value + step,
			PageDown: value - bigStep,
			PageUp: value + bigStep,
			Home: 0,
			End: 100,
		};

		const newValue = keyToNewValue[event.key];
		if (newValue === undefined) return;

		event.preventDefault();
		onChange(clampPercentage(newValue));
	};

	useEffect(() => {
		if (isDragging) {
			onDragging?.(true);
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
			document.addEventListener("touchmove", handleTouchMove);
			document.addEventListener("touchend", handleMouseUp);
		} else {
			onDragging?.(false);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			document.removeEventListener("touchmove", handleTouchMove);
			document.removeEventListener("touchend", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			document.removeEventListener("touchmove", handleTouchMove);
			document.removeEventListener("touchend", handleMouseUp);
		};
	}, [isDragging, onDragging, handleMouseUp, handleMouseMove, handleTouchMove]);

	const isDraggingClass = isDragging ? "isDragging" : "isNotDragging";
	const disabledClass = disabled ? "isDisabled" : "isEnabled";
	const sliderClassname = `arkynSliderTrack ${isDraggingClass} ${disabledClass} ${className}`;

	return (
		<div
			role="slider"
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={value}
			aria-orientation="horizontal"
			aria-disabled={disabled || undefined}
			tabIndex={disabled ? -1 : 0}
			{...rest}
			className={sliderClassname}
			onMouseDown={handleMouseDown}
			onTouchStart={handleTouchStart}
			onClick={handleSliderClick}
			onKeyDown={handleKeyDown}
			ref={sliderRef}
		>
			<div className="arkynSliderFill" style={{ width: `${value}%` }} />
			<div className="arkynSliderThumb" style={{ left: `${value}%` }} />
		</div>
	);
}

export { Slider };
