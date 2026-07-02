import { MultiSelect } from "@arkyn/components/multiSelect";
import { Circle } from "lucide-react";

export default function MultiSelectRoute() {
	const options = [
		{ value: "js", label: "JavaScript" },
		{ value: "ts", label: "TypeScript" },
		{ value: "py", label: "Python" },
		{ value: "rb", label: "Ruby" },
		{ value: "go", label: "Go" },
	];

	return (
		<>
			<div className="exampleContainer row foreground">
				<MultiSelect
					name="ms1"
					variant="outline"
					label="Outline:"
					options={options}
					placeholder="Selecione..."
				/>
				<MultiSelect
					name="ms2"
					variant="solid"
					label="Solid:"
					options={options}
					placeholder="Selecione..."
				/>
				<MultiSelect
					name="ms3"
					variant="underline"
					label="Underline:"
					options={options}
					placeholder="Selecione..."
				/>
			</div>

			<div className="exampleContainer row foreground">
				<MultiSelect
					name="ms4"
					variant="outline"
					label="Searchable:"
					options={options}
					isSearchable
				/>
				<MultiSelect
					name="ms5"
					variant="solid"
					label="With prefix:"
					options={options}
					prefix="$"
				/>
				<MultiSelect
					name="ms6"
					variant="solid"
					label="With icon:"
					options={options}
					leftIcon={Circle}
				/>
			</div>

			<div className="exampleContainer row foreground">
				<MultiSelect
					name="ms7"
					variant="solid"
					label="Loading:"
					options={options}
					isLoading
				/>
				<MultiSelect
					name="ms8"
					variant="solid"
					label="Disabled:"
					options={options}
					disabled
				/>
				<MultiSelect
					name="ms9"
					variant="solid"
					label="Size lg:"
					options={options}
					size="lg"
				/>
			</div>

			<div className="exampleContainer row">
				<MultiSelect
					name="ms10"
					variant="outline"
					label="Outline:"
					options={options}
				/>
				<MultiSelect
					name="ms11"
					variant="solid"
					label="Solid:"
					options={options}
				/>
			</div>
		</>
	);
}
