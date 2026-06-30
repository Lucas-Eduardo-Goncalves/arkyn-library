import { CurrencyInput } from "@arkyn/components/currencyInput";
import { Circle } from "lucide-react";

export default function CurrencyInputRoute() {
	return (
		<>
			<div className="exampleContainer row foreground">
				<CurrencyInput
					name="test"
					variant="outline"
					label="Outline:"
					locale="BRL"
				/>
				<CurrencyInput
					name="test"
					variant="solid"
					label="Solid:"
					locale="BRL"
				/>
				<CurrencyInput
					name="test"
					variant="underline"
					label="Underline:"
					locale="BRL"
				/>
			</div>

			<div className="exampleContainer row foreground">
				<CurrencyInput
					name="test"
					variant="outline"
					label="Outline:"
					locale="BRL"
					prefix="$"
				/>
				<CurrencyInput
					name="test"
					variant="solid"
					label="Solid:"
					locale="BRL"
					suffix="@"
				/>
				<CurrencyInput
					name="test"
					variant="outline"
					label="Outline:"
					locale="BRL"
					leftIcon={Circle}
				/>
				<CurrencyInput
					name="test"
					variant="solid"
					label="Solid:"
					locale="BRL"
					rightIcon={Circle}
				/>
			</div>

			<div className="exampleContainer row">
				<CurrencyInput
					name="test"
					variant="outline"
					label="Outline:"
					locale="BRL"
				/>
				<CurrencyInput
					name="test"
					variant="solid"
					label="Solid:"
					locale="BRL"
				/>
				<CurrencyInput
					name="test"
					variant="underline"
					label="Underline:"
					locale="BRL"
				/>
			</div>
		</>
	);
}
