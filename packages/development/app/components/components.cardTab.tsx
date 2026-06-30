import { CardTabButton } from "@arkyn/components/cardTabButton";
import { CardTabContainer } from "@arkyn/components/cardTabContainer";

export default function CardTabRoute() {
	return (
		<>
			<div className="exampleContainer">
				<CardTabContainer defaultValue="1">
					<CardTabButton value="1">Javascript</CardTabButton>
					<CardTabButton value="2">Python</CardTabButton>
					<CardTabButton value="3">Java</CardTabButton>
				</CardTabContainer>
			</div>

			<div className="exampleContainer">
				<CardTabContainer defaultValue="overview">
					<CardTabButton value="overview">Overview</CardTabButton>
					<CardTabButton value="analytics">Analytics</CardTabButton>
					<CardTabButton value="settings">Settings</CardTabButton>
					<CardTabButton value="billing" disabled>
						Billing (disabled)
					</CardTabButton>
				</CardTabContainer>
			</div>

			<div className="exampleContainer">
				<CardTabContainer disabled>
					<CardTabButton value="a">Tab A</CardTabButton>
					<CardTabButton value="b">Tab B</CardTabButton>
					<CardTabButton value="c">Tab C</CardTabButton>
				</CardTabContainer>
			</div>
		</>
	);
}
