import { Switch } from "@arkyn/components/switch";

export default function SwitchRoute() {
	return (
		<>
			<div className="exampleContainer row foreground">
				<Switch name="sw1" label="Small (sm)" size="sm" />
				<Switch name="sw2" label="Medium (md)" size="md" />
				<Switch name="sw3" label="Large (lg)" size="lg" />
			</div>

			<div className="exampleContainer row foreground">
				<Switch name="sw4" label="Default checked:" defaultChecked size="lg" />
				<Switch name="sw5" label="Disabled:" disabled size="lg" />
				<Switch
					name="sw6"
					label="Disabled + checked:"
					disabled
					defaultChecked
					size="lg"
				/>
			</div>

			<div className="exampleContainer row foreground">
				<Switch name="sw7" label="Horizontal:" orientation="horizontal" />
				<Switch name="sw8" label="Vertical:" orientation="vertical" />
				<Switch
					name="sw9"
					label="HorizontalReverse:"
					orientation="horizontalReverse"
				/>
			</div>

			<div className="exampleContainer row foreground">
				<Switch
					name="sw10"
					label="Required:"
					showAsterisk
					size="lg"
				/>
				<Switch
					name="sw11"
					label="Custom values:"
					value="active"
					unCheckedValue="inactive"
					size="lg"
				/>
			</div>

			<div className="exampleContainer row">
				<Switch name="sw12" label="Dark:" size="lg" />
				<Switch name="sw13" label="Dark checked:" defaultChecked size="lg" />
			</div>
		</>
	);
}
