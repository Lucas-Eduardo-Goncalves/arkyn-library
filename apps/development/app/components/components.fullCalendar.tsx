import { FullCalendar } from "@arkyn/components/fullCalendar";
import { useState } from "react";

export default function FullCalendarRoute() {
	const [controlledView, setControlledView] = useState(new Date(2026, 5, 30));
	const events = [
		{
			title: "Team standup",
			initialDate: new Date(2026, 5, 30, 9, 0),
			endDate: new Date(2026, 5, 30, 9, 30),
			scheme: "primary" as const,
		},
		{
			title: "Design review",
			initialDate: new Date(2026, 5, 30, 14, 0),
			endDate: new Date(2026, 5, 30, 15, 0),
			scheme: "success" as const,
		},
		{
			title: "Client meeting",
			initialDate: new Date(2026, 6, 2, 10, 0),
			endDate: new Date(2026, 6, 2, 11, 0),
			scheme: "warning" as const,
		},
		{
			title: "Deploy deadline",
			initialDate: new Date(2026, 6, 5, 18, 0),
			scheme: "danger" as const,
		},
		{
			title: "Sprint planning",
			initialDate: new Date(2026, 6, 7, 9, 0),
			endDate: new Date(2026, 6, 7, 11, 0),
			scheme: "info" as const,
		},
	];

	return (
		<>
			<div className="exampleContainer">
				<FullCalendar
					events={events}
					defaultViewValue={new Date(2026, 5, 30)}
				/>
			</div>

			<div className="exampleContainer">
				<p>Controlled view: {controlledView.toLocaleDateString("pt-BR")}</p>
				<FullCalendar
					events={events}
					viewValue={controlledView}
					onChangeView={setControlledView}
				/>
			</div>
		</>
	);
}
