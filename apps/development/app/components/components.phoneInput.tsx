import { PhoneInput } from "@arkyn/components/phoneInput";

export default function PhoneInputRoute() {
	return (
		<>
			<div className="exampleContainer row foreground">
				<PhoneInput name="phone1" variant="solid" label="Solid:" />
				<PhoneInput name="phone2" variant="outline" label="Outline:" />
			</div>

			<div className="exampleContainer row foreground">
				<PhoneInput name="phone3" variant="solid" label="Size lg:" size="lg" />
				<PhoneInput
					name="phone4"
					variant="solid"
					label="USA default:"
					defaultCountryIso="US"
				/>
			</div>

			<div className="exampleContainer row foreground">
				<PhoneInput name="phone5" variant="solid" label="Disabled:" disabled />
				<PhoneInput name="phone6" variant="solid" label="Loading:" isLoading />
				<PhoneInput
					name="phone7"
					variant="solid"
					label="Required:"
					showAsterisk
				/>
			</div>

			<div className="exampleContainer row foreground">
				<PhoneInput
					name="phone8"
					variant="solid"
					label="With error:"
					errorMessage="Phone is required"
				/>
				<PhoneInput name="phone9" variant="solid" label="Read only:" readOnly />
			</div>

			<div className="exampleContainer row">
				<PhoneInput name="phone10" variant="solid" label="Solid:" />
				<PhoneInput name="phone11" variant="outline" label="Outline:" />
			</div>
		</>
	);
}
