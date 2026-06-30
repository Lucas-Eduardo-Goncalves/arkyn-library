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
				<Select name="s1" variant="outline" label="Outline:" placeholder="Select..." options={options} />
				<Select name="s2" variant="solid" label="Solid:" placeholder="Select..." options={options} />
				<Select name="s3" variant="underline" label="Underline:" placeholder="Select..." options={options} />
			</div>

			<div className="exampleContainer row foreground">
				<Select name="s4" variant="outline" label="Searchable:" placeholder="Select..." options={options} isSearchable />
				<Select name="s5" variant="solid" label="Searchable:" placeholder="Select..." options={options} isSearchable />
				<Select name="s6" variant="underline" label="Searchable:" placeholder="Select..." options={options} isSearchable />
			</div>

			<div className="exampleContainer row foreground">
				<Select name="s7" variant="outline" label="Prefix $:" options={options} prefix="$" placeholder="Select..." />
				<Select name="s8" variant="solid" label="Left icon:" options={options} leftIcon={Circle} placeholder="Select..." />
				<Select name="s9" variant="solid" label="Size lg:" options={options} size="lg" placeholder="Select..." />
			</div>

			<div className="exampleContainer row foreground">
				<Select name="s10" variant="solid" label="Required:" options={options} showAsterisk placeholder="Select..." />
				<Select name="s11" variant="solid" label="With error:" options={options} errorMessage="Please select an option" placeholder="Select..." />
				<Select name="s12" variant="solid" label="Loading:" options={options} isLoading placeholder="Select..." />
			</div>

			<div className="exampleContainer row foreground">
				<Select name="s13" variant="solid" label="Disabled:" options={options} disabled placeholder="Select..." />
				<Select name="s14" variant="solid" label="Read only:" options={options} readOnly defaultValue="option1" placeholder="Select..." />
			</div>

			<div className="exampleContainer row">
				<Select name="s15" variant="outline" label="Outline:" placeholder="Select..." options={options} />
				<Select name="s16" variant="solid" label="Solid:" placeholder="Select..." options={options} />
				<Select name="s17" variant="underline" label="Underline:" placeholder="Select..." options={options} />
			</div>
		</>
	);
}
