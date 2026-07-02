import { MaskedInput } from "@arkyn/components/maskedInput";
import { Circle, CreditCard, Phone } from "lucide-react";

export default function MaskedInputRoute() {
	return (
		<>
			<div className="exampleContainer row foreground">
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="mi1"
					variant="outline"
					label="CPF Outline:"
					placeholder="000.000.000-00"
				/>
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="mi2"
					variant="solid"
					label="CPF Solid:"
					placeholder="000.000.000-00"
				/>
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="mi3"
					variant="underline"
					label="CPF Underline:"
					placeholder="000.000.000-00"
				/>
			</div>

			<div className="exampleContainer row foreground">
				<MaskedInput
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					name="mi4"
					variant="solid"
					label="Phone:"
					leftIcon={Phone}
					placeholder="(00) 00000-0000"
				/>
				<MaskedInput
					mask="____ ____ ____ ____"
					replacement={{ _: /\d/ }}
					name="mi5"
					variant="solid"
					label="Credit card:"
					leftIcon={CreditCard}
					placeholder="0000 0000 0000 0000"
				/>
				<MaskedInput
					mask="__/__/____"
					replacement={{ _: /\d/ }}
					name="mi6"
					variant="solid"
					label="Date:"
					placeholder="DD/MM/YYYY"
				/>
			</div>

			<div className="exampleContainer row foreground">
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="mi7"
					variant="solid"
					label="Show mask:"
					showMask
				/>
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="mi8"
					variant="solid"
					label="Separate:"
					separate
					placeholder="Only digits stored"
				/>
			</div>

			<div className="exampleContainer row foreground">
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="mi9"
					variant="outline"
					label="Prefix $:"
					prefix="$"
				/>
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="mi10"
					variant="solid"
					label="Suffix @:"
					suffix="@"
				/>
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="mi11"
					variant="outline"
					label="Left icon:"
					leftIcon={Circle}
				/>
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="mi12"
					variant="solid"
					label="Right icon:"
					rightIcon={Circle}
				/>
			</div>

			<div className="exampleContainer row foreground">
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="mi13"
					variant="solid"
					label="Size lg:"
					size="lg"
					placeholder="000.000.000-00"
				/>
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="mi14"
					variant="solid"
					label="Required:"
					showAsterisk
					placeholder="000.000.000-00"
				/>
			</div>

			<div className="exampleContainer row foreground">
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="mi15"
					variant="solid"
					label="With error:"
					errorMessage="Invalid CPF"
				/>
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="mi16"
					variant="solid"
					label="Loading:"
					isLoading
				/>
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="mi17"
					variant="solid"
					label="Disabled:"
					disabled
				/>
			</div>

			<div className="exampleContainer row">
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="mi18"
					variant="outline"
					label="Outline:"
					placeholder="000.000.000-00"
				/>
				<MaskedInput
					mask="___.___.___-__"
					replacement={{ _: /\d/ }}
					name="mi19"
					variant="solid"
					label="Solid:"
					placeholder="000.000.000-00"
				/>
			</div>
		</>
	);
}
