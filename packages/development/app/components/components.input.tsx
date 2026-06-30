import { Input } from "@arkyn/components/input";

export default function InputRoute() {
	return (
		<>
			<div className="exampleContainer row foreground">
				<Input
					name="test"
					variant="outline"
					label="Outline:"
					placeholder="Digite algo..."
				/>
				<Input
					name="test"
					variant="solid"
					label="Solid:"
					placeholder="Digite algo..."
				/>
				<Input
					name="test"
					variant="underline"
					label="Underline:"
					placeholder="Digite algo..."
				/>
			</div>

			<div className="exampleContainer row">
				<Input
					name="test"
					variant="outline"
					label="Outline:"
					placeholder="Digite algo..."
				/>
				<Input
					name="test"
					variant="solid"
					label="Solid:"
					placeholder="Digite algo..."
				/>
				<Input
					name="test"
					variant="underline"
					label="Underline:"
					placeholder="Digite algo..."
				/>
			</div>
		</>
	);
}
