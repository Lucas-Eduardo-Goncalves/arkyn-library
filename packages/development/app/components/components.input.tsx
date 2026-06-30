import { Input } from "@arkyn/components/input";

export default function InputRoute() {
	return (
		<>
			<div className="exampleContainer row foreground">
				<Input name="test" variant="outline" />
				<Input name="test" variant="solid" />
				<Input name="test" variant="underline" />
			</div>

			<div className="exampleContainer row">
				<Input name="test" variant="outline" />
				<Input name="test" variant="solid" />
				<Input name="test" variant="underline" />
			</div>
		</>
	);
}
