import { useState } from "react";

type UseSliderReturnProps = [number, (number: number) => void];

/**
 * useSlider — state manager for the `Slider` component. Clamps values to `[0, 100]`.
 *
 * @param defaultValue - Initial percentage value (0–100). Default: 0
 *
 * @returns `[value, setValue]` — current percentage and a setter that clamps at the boundaries.
 *
 * @example
 * ```tsx
 * const [volume, setVolume] = useSlider(50);
 * return <Slider value={volume} onChange={setVolume} />;
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
