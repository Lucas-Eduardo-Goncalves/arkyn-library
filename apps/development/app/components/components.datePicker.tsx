import { DatePicker } from "@arkyn/components/datePicker";
import { CalendarDays } from "lucide-react";
import { useState } from "react";

export default function DatePickerRoute() {
	const [controlledDate, setControlledDate] = useState(new Date());
	const [controlledRange, setControlledRange] = useState<[Date, Date]>([
		new Date(),
		new Date(),
	]);

	return (
		<>
			<div className="exampleContainer row foreground">
				<DatePicker
					type="single"
					name="d1"
					variant="outline"
					label="Outline:"
					placeholder="Selecione..."
				/>
				<DatePicker
					type="single"
					name="d2"
					variant="solid"
					label="Solid:"
					placeholder="Selecione..."
				/>
				<DatePicker
					type="single"
					name="d3"
					variant="underline"
					label="Underline:"
					placeholder="Selecione..."
				/>
			</div>

			<div className="exampleContainer row foreground">
				<DatePicker
					type="range"
					name="d4"
					variant="outline"
					label="Range outline:"
					placeholder="Selecione o período..."
				/>
				<DatePicker
					type="range"
					name="d5"
					variant="solid"
					label="Range solid:"
					placeholder="Selecione o período..."
				/>
				<DatePicker
					type="range"
					name="d6"
					variant="underline"
					label="Range underline:"
					placeholder="Selecione o período..."
				/>
			</div>

			<div className="exampleContainer row foreground">
				<DatePicker
					type="single"
					name="d7"
					variant="solid"
					label="Left icon:"
					leftIcon={CalendarDays}
					placeholder="Selecione..."
				/>
				<DatePicker
					type="single"
					name="d8"
					variant="solid"
					label="Basic calendar:"
					calendarVariant="basic"
					placeholder="Selecione..."
				/>
				<DatePicker
					type="single"
					name="d9"
					variant="solid"
					label="Size lg:"
					size="lg"
					placeholder="Selecione..."
				/>
			</div>

			<div className="exampleContainer row foreground">
				<DatePicker
					type="single"
					name="d10"
					variant="solid"
					label="Required:"
					showAsterisk
					placeholder="Selecione..."
				/>
				<DatePicker
					type="single"
					name="d11"
					variant="solid"
					label="With error:"
					errorMessage="Selecione uma data válida"
					placeholder="Selecione..."
				/>
				<DatePicker
					type="single"
					name="d12"
					variant="solid"
					label="Loading:"
					isLoading
					placeholder="Selecione..."
				/>
			</div>

			<div className="exampleContainer row foreground">
				<DatePicker
					type="single"
					name="d13"
					variant="solid"
					label="Disabled:"
					disabled
					placeholder="Selecione..."
				/>
				<DatePicker
					type="single"
					name="d14"
					variant="solid"
					label="Read only:"
					readOnly
					defaultValue={new Date()}
					placeholder="Selecione..."
				/>
			</div>

			<div className="exampleContainer foreground">
				<p>Controlled value: {controlledDate.toLocaleDateString("pt-BR")}</p>
				<DatePicker
					type="single"
					name="d18"
					variant="solid"
					label="Controlled:"
					value={controlledDate}
					onChange={setControlledDate}
				/>
			</div>

			<div className="exampleContainer foreground">
				<p>
					Controlled range: {controlledRange[0].toLocaleDateString("pt-BR")} –{" "}
					{controlledRange[1].toLocaleDateString("pt-BR")}
				</p>
				<DatePicker
					type="range"
					name="d19"
					variant="solid"
					label="Controlled range:"
					value={controlledRange}
					onChange={setControlledRange}
				/>
			</div>

			<div className="exampleContainer row">
				<DatePicker
					type="single"
					name="d15"
					variant="outline"
					label="Outline:"
					placeholder="Selecione..."
				/>
				<DatePicker
					type="single"
					name="d16"
					variant="solid"
					label="Solid:"
					placeholder="Selecione..."
				/>
				<DatePicker
					type="range"
					name="d17"
					variant="underline"
					label="Range underline:"
					placeholder="Selecione o período..."
				/>
			</div>
		</>
	);
}
