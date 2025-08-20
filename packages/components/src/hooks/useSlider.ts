import { useState } from "react";

type UseSliderReturnProps = [number, (number: number) => void];

/**
 * useSlider hook - manages slider value state with boundary validation
 *
 * @param defaultValue - Initial value for the slider (0-100). Default: 0
 *
 * @returns Array containing current slider value and setter function
 * - [0]: Current slider value (number between 0-100)
 * - [1]: Function to update slider value with boundary validation
 *
 * @example
 * ```tsx
 * // Basic usage
 * const [value, setValue] = useSlider();
 *
 * // With default value
 * const [value, setValue] = useSlider(50);
 *
 * // Usage in component
 * function SliderComponent() {
 *   const [sliderValue, changeSliderValue] = useSlider(25);
 *
 *   return (
 *     <Slider value={sliderValue} onChange={changeSliderValue} />
 *   );
 * }
 * ```
 */

function useSlider(defaultValue?: number): UseSliderReturnProps {
  function getDefaultValue() {
    if (!defaultValue) return 0;
    if (defaultValue <= 0) return 0;
    if (defaultValue >= 100) return 100;
    return defaultValue;
  }

  const [sliderValue, setSliderValue] = useState(getDefaultValue());

  function changeSliderValue(value: number) {
    if (value <= 0) return setSliderValue(0);
    if (value >= 100) return setSliderValue(100);
    return setSliderValue(value);
  }

  return [sliderValue, changeSliderValue];
}

export { useSlider };
