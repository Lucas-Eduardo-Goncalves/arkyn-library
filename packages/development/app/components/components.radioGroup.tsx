import { RadioBox } from "@arkyn/components/radioBox";
import { RadioGroup } from "@arkyn/components/radioGroup";

export default function RadioGroupRoute() {
	return (
		<>
			<div className="exampleContainer row foreground">
				<RadioGroup name="rg1" label="Size sm:" size="sm" defaultValue="a">
					<RadioBox value="a">Option A</RadioBox>
					<RadioBox value="b">Option B</RadioBox>
					<RadioBox value="c">Option C</RadioBox>
				</RadioGroup>

				<RadioGroup name="rg2" label="Size md:" size="md" defaultValue="b">
					<RadioBox value="a">Option A</RadioBox>
					<RadioBox value="b">Option B</RadioBox>
					<RadioBox value="c">Option C</RadioBox>
				</RadioGroup>

				<RadioGroup name="rg3" label="Size lg:" size="lg">
					<RadioBox value="a">Option A</RadioBox>
					<RadioBox value="b">Option B</RadioBox>
					<RadioBox value="c">Option C</RadioBox>
				</RadioGroup>
			</div>

			<div className="exampleContainer row foreground">
				<RadioGroup name="rg4" label="Disabled:" disabled defaultValue="a">
					<RadioBox value="a">Option A</RadioBox>
					<RadioBox value="b">Option B</RadioBox>
				</RadioGroup>

				<RadioGroup
					name="rg5"
					label="With error:"
					errorMessage="Select an option"
				>
					<RadioBox value="a">Option A</RadioBox>
					<RadioBox value="b">Option B</RadioBox>
				</RadioGroup>

				<RadioGroup name="rg6" label="Required:" showAsterisk>
					<RadioBox value="a">Alpha</RadioBox>
					<RadioBox value="b">Beta</RadioBox>
					<RadioBox value="c" disabled>
						Gamma (disabled)
					</RadioBox>
				</RadioGroup>
			</div>

			<div className="exampleContainer row">
				<RadioGroup name="rg7" label="Dark:" size="md" defaultValue="a">
					<RadioBox value="a">Option A</RadioBox>
					<RadioBox value="b">Option B</RadioBox>
					<RadioBox value="c">Option C</RadioBox>
				</RadioGroup>
			</div>
		</>
	);
}
