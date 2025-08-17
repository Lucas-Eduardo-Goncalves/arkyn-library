import { HTMLAttributes, useEffect, useRef, useState } from "react";

import "./styles.css";

type SliderProps = HTMLAttributes<HTMLDivElement> & {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  onDragging?: (value: boolean) => void;
};

/**
 * Slider component - interactive range input for selecting numeric values
 *
 * @param props - Slider component properties
 * @param props.value - Current slider value (0-100)
 * @param props.onChange - Callback function called when value changes
 * @param props.disabled - Disables slider interaction. Default: false
 * @param props.onDragging - Callback function called when dragging state changes
 *
 * **...Other valid HTML properties for div element**
 *
 * @returns Slider JSX element
 *
 * @example
 * ```tsx
 * // Basic slider
 * const [value, setValue] = useState(50);
 * <Slider value={value} onChange={setValue} />
 *
 * // Disabled slider
 * <Slider value={75} onChange={() => {}} disabled />
 *
 * // Slider with dragging callback
 * const [isDragging, setIsDragging] = useState(false);
 * <Slider
 *   value={value}
 *   onChange={setValue}
 *   onDragging={setIsDragging}
 * />
 *
 * // Complete example with useSlider hook
 * function SliderExample() {
 *   const [sliderValue, setSliderValue] = useSlider(25);
 *   const [isDragging, setIsDragging] = useState(false);
 *
 *   return (
 *     <Slider
 *       value={sliderValue}
 *       onChange={setSliderValue}
 *       onDragging={setIsDragging}
 *       className="custom-slider"
 *     />
 *   );
 * }
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
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (event: MouseEvent) => {
    if (disabled) return;
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const newValue = Math.min(Math.max((offsetX / rect.width) * 100, 0), 100);

    onChange(newValue);
  };

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
      onDragging && onDragging(true);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      onDragging && onDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

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
