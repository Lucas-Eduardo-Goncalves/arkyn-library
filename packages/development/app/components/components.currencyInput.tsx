import { CurrencyInput } from "@arkyn/components/currencyInput";
import { Circle } from "lucide-react";

export default function CurrencyInputRoute() {
	return (
		<>
			<div className="exampleContainer row foreground">
				<CurrencyInput name="ci1" variant="outline" label="Outline:" locale="BRL" />
				<CurrencyInput name="ci2" variant="solid" label="Solid:" locale="BRL" />
				<CurrencyInput name="ci3" variant="underline" label="Underline:" locale="BRL" />
			</div>

			<div className="exampleContainer row foreground">
				<CurrencyInput name="ci4" variant="solid" label="BRL:" locale="BRL" />
				<CurrencyInput name="ci5" variant="solid" label="USD:" locale="USD" />
				<CurrencyInput name="ci6" variant="solid" label="EUR:" locale="EUR" />
			</div>

			<div className="exampleContainer row foreground">
				<CurrencyInput name="ci7" variant="outline" label="Prefix $:" locale="BRL" prefix="$" />
				<CurrencyInput name="ci8" variant="solid" label="Suffix %:" locale="BRL" suffix="%" />
				<CurrencyInput name="ci9" variant="outline" label="Left icon:" locale="BRL" leftIcon={Circle} />
				<CurrencyInput name="ci10" variant="solid" label="Right icon:" locale="BRL" rightIcon={Circle} />
			</div>

			<div className="exampleContainer row foreground">
				<CurrencyInput name="ci11" variant="solid" label="Size md:" locale="BRL" size="md" />
				<CurrencyInput name="ci12" variant="solid" label="Size lg:" locale="BRL" size="lg" />
			</div>

			<div className="exampleContainer row foreground">
				<CurrencyInput name="ci13" variant="solid" label="Required:" locale="BRL" showAsterisk />
				<CurrencyInput name="ci14" variant="solid" label="With error:" locale="BRL" errorMessage="Invalid value" />
				<CurrencyInput name="ci15" variant="solid" label="Loading:" locale="BRL" isLoading />
			</div>

			<div className="exampleContainer row foreground">
				<CurrencyInput name="ci16" variant="solid" label="Disabled:" locale="BRL" disabled />
				<CurrencyInput name="ci17" variant="solid" label="Read only:" locale="BRL" readOnly defaultValue={1500} />
			</div>

			<div className="exampleContainer row">
				<CurrencyInput name="ci18" variant="outline" label="Outline:" locale="BRL" />
				<CurrencyInput name="ci19" variant="solid" label="Solid:" locale="USD" />
			</div>
		</>
	);
}
