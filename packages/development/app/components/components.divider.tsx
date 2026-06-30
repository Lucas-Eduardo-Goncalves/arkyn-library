import { Divider } from "@arkyn/components/divider";

export default function DividerRoute() {
	return (
		<>
			<div className="exampleContainer foreground">
				<p>Section 1</p>
				<Divider />
				<p>Section 2</p>
				<Divider />
				<p>Section 3</p>
			</div>

			<div
				className="exampleContainer row foreground"
				style={{ alignItems: "stretch", height: "80px" }}
			>
				<p>Column A</p>
				<Divider orientation="vertical" />
				<p>Column B</p>
				<Divider orientation="vertical" />
				<p>Column C</p>
			</div>

			<div className="exampleContainer foreground">
				<p>Section 1</p>
				<Divider style={{ borderColor: "var(--spotlight-primary)" }} />
				<p>Section 2</p>
			</div>
		</>
	);
}
