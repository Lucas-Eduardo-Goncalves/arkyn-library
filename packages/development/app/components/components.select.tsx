import { Select } from "@arkyn/components/select";
import { Circle } from "lucide-react";

export default function SelectRoute() {
	const options = [
		{ value: "option1", label: "Option 1" },
		{ value: "option2", label: "Option 2" },
		{ value: "option3", label: "Option 3" },
	];

	return (
		<>
			<div className="exampleContainer row foreground">
				<Select
					name="test"
					variant="outline"
					label="Outline:"
					placeholder="Digite algo..."
					options={options}
				/>
				<Select
					name="test"
					variant="solid"
					label="Solid:"
					placeholder="Digite algo..."
					options={options}
				/>
				<Select
					name="test"
					variant="underline"
					label="Underline:"
					placeholder="Digite algo..."
					options={options}
				/>
			</div>

			<div className="exampleContainer row foreground">
				<Select
					name="test"
					variant="outline"
					label="Outline:"
					placeholder="Digite algo..."
					options={options}
					prefix="$"
				/>
				<Select
					name="test"
					variant="solid"
					label="Solid:"
					placeholder="Digite algo..."
					options={options}
				/>
				<Select
					name="test"
					variant="outline"
					label="Outline:"
					placeholder="Digite algo..."
					options={options}
					leftIcon={Circle}
				/>
				<Select
					name="test"
					variant="solid"
					label="Solid:"
					placeholder="Digite algo..."
					options={options}
				/>
			</div>

			<div className="exampleContainer row">
				<Select
					name="test"
					variant="outline"
					label="Outline:"
					placeholder="Digite algo..."
					options={options}
				/>
				<Select
					name="test"
					variant="solid"
					label="Solid:"
					placeholder="Digite algo..."
					options={options}
				/>
				<Select
					name="test"
					variant="underline"
					label="Underline:"
					placeholder="Digite algo..."
					options={options}
				/>
			</div>
		</>
	);
}
