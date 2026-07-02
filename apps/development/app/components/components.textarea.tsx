import { Textarea } from "@arkyn/components/textarea";

export default function TextareaRoute() {
	return (
		<>
			<div className="exampleContainer row foreground">
				<Textarea
					name="ta1"
					variant="solid"
					label="Solid:"
					placeholder="Enter text..."
				/>
				<Textarea
					name="ta2"
					variant="outline"
					label="Outline:"
					placeholder="Enter text..."
				/>
			</div>

			<div className="exampleContainer row foreground">
				<Textarea
					name="ta3"
					variant="solid"
					label="Size lg:"
					size="lg"
					placeholder="Large..."
				/>
				<Textarea
					name="ta4"
					variant="solid"
					label="Required:"
					showAsterisk
					placeholder="Required..."
				/>
			</div>

			<div className="exampleContainer row foreground">
				<Textarea
					name="ta5"
					variant="solid"
					label="Disabled:"
					disabled
					placeholder="Disabled..."
				/>
				<Textarea
					name="ta6"
					variant="solid"
					label="With error:"
					errorMessage="This field is required"
					placeholder="Error state..."
				/>
				<Textarea
					name="ta7"
					variant="solid"
					label="Read only:"
					readOnly
					defaultValue="Read only content"
				/>
			</div>

			<div className="exampleContainer row">
				<Textarea
					name="ta8"
					variant="solid"
					label="Solid:"
					placeholder="Dark mode..."
				/>
				<Textarea
					name="ta9"
					variant="outline"
					label="Outline:"
					placeholder="Dark mode..."
				/>
			</div>
		</>
	);
}
