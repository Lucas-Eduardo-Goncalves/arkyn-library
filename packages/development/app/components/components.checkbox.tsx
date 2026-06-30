import { Checkbox } from "@arkyn/components/checkbox";

export default function CheckboxRoute() {
	return (
		<>
			<div className="exampleContainer row foreground">
				<Checkbox name="test" label="Teste" />
			</div>

			<div className="exampleContainer row">
				<Checkbox name="test" label="Teste" />
			</div>
		</>
	);
}
