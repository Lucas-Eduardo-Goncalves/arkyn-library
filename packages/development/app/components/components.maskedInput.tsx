import { MaskedInput } from "@arkyn/components/maskedInput";
import { Circle } from "lucide-react";

export default function MaskedInputRoute() {
	return (
		<>
			<div className="exampleContainer row foreground">
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="test"
					variant="outline"
					label="Outline:"
					placeholder="Digite algo..."
				/>
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="test"
					variant="solid"
					label="Solid:"
					placeholder="Digite algo..."
				/>
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="test"
					variant="underline"
					label="Underline:"
					placeholder="Digite algo..."
				/>
			</div>

			<div className="exampleContainer row foreground">
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="test"
					variant="outline"
					label="Outline:"
					placeholder="Digite algo..."
					prefix="$"
				/>
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="test"
					variant="solid"
					label="Solid:"
					placeholder="Digite algo..."
					suffix="@"
				/>
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="test"
					variant="outline"
					label="Outline:"
					placeholder="Digite algo..."
					leftIcon={Circle}
				/>
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="test"
					variant="solid"
					label="Solid:"
					placeholder="Digite algo..."
					rightIcon={Circle}
				/>
			</div>

			<div className="exampleContainer row">
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="test"
					variant="outline"
					label="Outline:"
					placeholder="Digite algo..."
				/>
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="test"
					variant="solid"
					label="Solid:"
					placeholder="Digite algo..."
				/>
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="test"
					variant="underline"
					label="Underline:"
					placeholder="Digite algo..."
				/>
			</div>
		</>
	);
}
