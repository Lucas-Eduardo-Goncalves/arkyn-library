import { Slider } from "@arkyn/components/slider";
import { useState } from "react";

export default function SliderRoute() {
	const [value1, setValue1] = useState(30);
	const [value2, setValue2] = useState(60);
	const [value3, setValue3] = useState(75);

	return (
		<>
			<div className="exampleContainer foreground">
				<p>Value: {Math.round(value1)}%</p>
				<Slider value={value1} onChange={setValue1} />
			</div>

			<div className="exampleContainer foreground">
				<p>Value: {Math.round(value2)}%</p>
				<Slider value={value2} onChange={setValue2} />
			</div>

			<div className="exampleContainer foreground">
				<p>Disabled — Value: {Math.round(value3)}%</p>
				<Slider value={value3} onChange={setValue3} disabled />
			</div>

			<div className="exampleContainer">
				<p>Value: {Math.round(value1)}%</p>
				<Slider value={value1} onChange={setValue1} />
			</div>
		</>
	);
}
