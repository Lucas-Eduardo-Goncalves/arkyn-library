import { TabButton } from "@arkyn/components/tabButton";
import { TabContainer } from "@arkyn/components/tabContainer";

export default function TabRoute() {
	return (
		<>
			<div className="exampleContainer foreground">
				<TabContainer defaultValue="overview">
					<TabButton value="overview">Overview</TabButton>
					<TabButton value="analytics">Analytics</TabButton>
					<TabButton value="settings">Settings</TabButton>
				</TabContainer>
			</div>

			<div className="exampleContainer foreground">
				<TabContainer defaultValue="js">
					<TabButton value="js">JavaScript</TabButton>
					<TabButton value="ts">TypeScript</TabButton>
					<TabButton value="py">Python</TabButton>
					<TabButton value="go" disabled>
						Go (disabled)
					</TabButton>
				</TabContainer>
			</div>

			<div className="exampleContainer foreground">
				<TabContainer disabled>
					<TabButton value="a">Tab A</TabButton>
					<TabButton value="b">Tab B</TabButton>
					<TabButton value="c">Tab C</TabButton>
				</TabContainer>
			</div>

			<div className="exampleContainer">
				<TabContainer defaultValue="overview">
					<TabButton value="overview">Overview</TabButton>
					<TabButton value="analytics">Analytics</TabButton>
					<TabButton value="settings">Settings</TabButton>
				</TabContainer>
			</div>
		</>
	);
}
