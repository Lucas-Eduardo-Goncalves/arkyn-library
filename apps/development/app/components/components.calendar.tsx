import { Calendar } from "@arkyn/components/calendar";
import { useState } from "react";

export default function CalendarRoute() {
	const [controlledDate, setControlledDate] = useState(new Date());
	const [controlledRange, setControlledRange] = useState<[Date, Date]>([
		new Date(),
		new Date(),
	]);

	return (
		<>
			<div className="exampleContainer row">
				<Calendar type="single" variant="complete" />
				<Calendar type="single" variant="basic" />
			</div>

			<div className="exampleContainer row">
				<Calendar type="range" variant="complete" />
				<Calendar type="range" variant="basic" />
			</div>

			<div className="exampleContainer foreground">
				<p>Controlled value: {controlledDate.toLocaleDateString("pt-BR")}</p>
				<Calendar
					type="single"
					variant="complete"
					value={controlledDate}
					onChange={setControlledDate}
				/>
			</div>

			<div className="exampleContainer foreground">
				<p>
					Controlled range: {controlledRange[0].toLocaleDateString("pt-BR")} –{" "}
					{controlledRange[1].toLocaleDateString("pt-BR")}
				</p>
				<Calendar
					type="range"
					variant="complete"
					value={controlledRange}
					onChange={setControlledRange}
				/>
			</div>
		</>
	);
}
