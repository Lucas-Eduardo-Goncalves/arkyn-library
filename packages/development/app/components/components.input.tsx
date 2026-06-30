import { Input } from "@arkyn/components/input";
import { Circle } from "lucide-react";

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

			<div className="exampleContainer row foreground">
				<Input
					name="test"
					variant="outline"
					label="Outline:"
					placeholder="Digite algo..."
					prefix="$"
				/>
				<Input
					name="test"
					variant="solid"
					label="Solid:"
					placeholder="Digite algo..."
					suffix="@"
				/>
				<Input
					name="test"
					variant="outline"
					label="Outline:"
					placeholder="Digite algo..."
					leftIcon={Circle}
				/>
				<Input
					name="test"
					variant="solid"
					label="Solid:"
					placeholder="Digite algo..."
					rightIcon={Circle}
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
