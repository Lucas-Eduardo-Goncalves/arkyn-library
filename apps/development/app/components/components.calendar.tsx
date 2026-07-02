import { Calendar } from "@arkyn/components/calendar";

export default function CalendarRoute() {
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
		</>
	);
}
