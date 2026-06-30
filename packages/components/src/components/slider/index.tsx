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
	/** Disables all drag and click interactions. @default false */
	disabled?: boolean;
	/** Callback fired when the dragging state changes (`true` = drag started, `false` = drag ended). */
	onDragging?: (isDragging: boolean) => void;
};

/**
 * Slider — interactive track for selecting a numeric value between 0 and 100.
 *
 * Pair with `useSlider` for managed state.
 *
 * @param props.value - Current position as a percentage (0–100). Required.
 * @param props.onChange - Callback fired on value change. Required.
 * @param props.disabled - Disables interactions. Default: false
 * @param props.onDragging - Callback fired when dragging starts or stops.
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

function Slider(props: SliderProps) {
	const {
		onChange,
		value,
		disabled = false,
		onDragging,
		className = "",
		...rest
	} = props;

	const [isDragging, setIsDragging] = useState(false);
	const sliderRef = useRef<HTMLDivElement>(null);

	const handleMouseDown = () => setIsDragging(true);
	const handleMouseUp = useCallback(() => setIsDragging(false), []);

	const handleMouseMove = useCallback(
		(event: MouseEvent) => {
			if (disabled) return;
			if (!isDragging || !sliderRef.current) return;

			const rect = sliderRef.current.getBoundingClientRect();
			const offsetX = event.clientX - rect.left;
			const newValue = Math.min(Math.max((offsetX / rect.width) * 100, 0), 100);

			onChange(newValue);
		},
		[disabled, isDragging, onChange],
	);

	const handleSliderClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (disabled) return;
		if (!sliderRef.current) return;

		const rect = sliderRef.current.getBoundingClientRect();
		const offsetX = event.clientX - rect.left;
		const newValue = Math.min(Math.max((offsetX / rect.width) * 100, 0), 100);

		onChange(newValue);
	};

	useEffect(() => {
		if (isDragging) {
			onDragging?.(true);
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		} else {
			onDragging?.(false);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging, onDragging, handleMouseUp, handleMouseMove]);

	const isDraggingClass = isDragging ? "isDragging" : "isNotDragging";
	const disabledClass = disabled ? "isDisabled" : "isEnabled";
	const sliderClassname = `arkynSliderTrack ${isDraggingClass} ${disabledClass} ${className}`;

	return (
		<div
			{...rest}
			className={sliderClassname}
			onMouseDown={handleMouseDown}
			onClick={handleSliderClick}
			ref={sliderRef}
		>
			<div className="arkynSliderFill" style={{ width: `${value}%` }} />
			<div className="arkynSliderThumb" style={{ left: `${value}%` }} />
		</div>
	);
}

export { Slider };
