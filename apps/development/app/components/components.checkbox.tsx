import { Checkbox } from "@arkyn/components/checkbox";

export default function CheckboxRoute() {
	return (
		<>
			<div className="exampleContainer row foreground">
				<Checkbox name="cb1" label="Size sm" size="sm" />
				<Checkbox name="cb2" label="Size md" size="md" />
				<Checkbox name="cb3" label="Size lg" size="lg" />
			</div>

			<div className="exampleContainer row foreground">
				<Checkbox name="cb4" label="Unchecked" size="md" />
				<Checkbox name="cb5" label="Default checked" size="md" defaultChecked />
				<Checkbox name="cb6" label="Disabled" size="md" disabled />
				<Checkbox
					name="cb7"
					label="Disabled + checked"
					size="md"
					disabled
					defaultChecked
				/>
			</div>

			<div className="exampleContainer row foreground">
				<Checkbox name="cb8" label="Required" showAsterisk />
				<Checkbox
					name="cb9"
					label="With error"
					errorMessage="This field is required"
				/>
			</div>

			<div className="exampleContainer row foreground">
				<Checkbox
					name="cb10"
					label="HorizontalReverse (default)"
					orientation="horizontalReverse"
				/>
				<Checkbox name="cb11" label="Horizontal" orientation="horizontal" />
				<Checkbox name="cb12" label="Vertical" orientation="vertical" />
			</div>

			<div className="exampleContainer row">
				<Checkbox name="cb13" label="Dark mode" size="md" />
				<Checkbox name="cb14" label="Dark checked" size="md" defaultChecked />
			</div>
		</>
	);
}
