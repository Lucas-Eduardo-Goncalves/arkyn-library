import { CardTabButton } from "@arkyn/components/cardTabButton";
import { CardTabContainer } from "@arkyn/components/cardTabContainer";

export default function CardTabRoute() {
	return (
		<div className="exampleContainer">
			<CardTabContainer>
				<CardTabButton value="1">Javascript</CardTabButton>
				<CardTabButton value="2">Python</CardTabButton>
				<CardTabButton value="3">Java</CardTabButton>
			</CardTabContainer>
		</div>
	);
}
