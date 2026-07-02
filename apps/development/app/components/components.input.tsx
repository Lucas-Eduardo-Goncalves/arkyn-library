import { Input } from "@arkyn/components/input";
import { Circle } from "lucide-react";

export default function InputRoute() {
	return (
		<>
			<div className="exampleContainer row foreground">
				<Input
					name="i1"
					variant="outline"
					label="Outline:"
					placeholder="Digite algo..."
				/>
				<Input
					name="i2"
					variant="solid"
					label="Solid:"
					placeholder="Digite algo..."
				/>
				<Input
					name="i3"
					variant="underline"
					label="Underline:"
					placeholder="Digite algo..."
				/>
			</div>

			<div className="exampleContainer row foreground">
				<Input
					name="i4"
					variant="outline"
					label="Prefix $:"
					prefix="$"
					placeholder="0.00"
				/>
				<Input
					name="i5"
					variant="solid"
					label="Suffix @:"
					suffix="@"
					placeholder="user"
				/>
				<Input
					name="i6"
					variant="outline"
					label="Left icon:"
					leftIcon={Circle}
					placeholder="Search..."
				/>
				<Input
					name="i7"
					variant="solid"
					label="Right icon:"
					rightIcon={Circle}
					placeholder="Digite algo..."
				/>
			</div>

			<div className="exampleContainer row foreground">
				<Input
					name="i8"
					variant="solid"
					label="Size md:"
					size="md"
					placeholder="Medium..."
				/>
				<Input
					name="i9"
					variant="solid"
					label="Size lg:"
					size="lg"
					placeholder="Large..."
				/>
			</div>

			<div className="exampleContainer row foreground">
				<Input
					name="i10"
					variant="solid"
					label="Required:"
					showAsterisk
					placeholder="Required..."
				/>
				<Input
					name="i11"
					variant="solid"
					label="With error:"
					errorMessage="This field is required"
					placeholder="Error state..."
				/>
				<Input
					name="i12"
					variant="solid"
					label="Loading:"
					isLoading
					placeholder="Loading..."
				/>
			</div>

			<div className="exampleContainer row foreground">
				<Input
					name="i13"
					variant="solid"
					label="Disabled:"
					disabled
					placeholder="Disabled..."
				/>
				<Input
					name="i14"
					variant="solid"
					label="Read only:"
					readOnly
					defaultValue="Read only value"
				/>
				<Input
					name="i15"
					variant="outline"
					label="Password:"
					type="password"
					placeholder="••••••••"
				/>
			</div>

			<div className="exampleContainer row">
				<Input
					name="i16"
					variant="outline"
					label="Outline:"
					placeholder="Dark mode..."
				/>
				<Input
					name="i17"
					variant="solid"
					label="Solid:"
					placeholder="Dark mode..."
				/>
				<Input
					name="i18"
					variant="underline"
					label="Underline:"
					placeholder="Dark mode..."
				/>
			</div>
		</>
	);
}
