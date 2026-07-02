import { Button } from "@arkyn/components/button";
import { DrawerContainer } from "@arkyn/components/drawerContainer";
import { DrawerHeader } from "@arkyn/components/drawerHeader";
import { useState } from "react";

export default function DrawerRoute() {
	const [isLeftOpen, setIsLeftOpen] = useState(false);
	const [isRightOpen, setIsRightOpen] = useState(false);

	return (
		<>
			<DrawerContainer
				isVisible={isLeftOpen}
				makeInvisible={() => setIsLeftOpen(false)}
				orientation="left"
			>
				<DrawerHeader>Left Drawer</DrawerHeader>

				<div style={{ padding: "1rem" }}>
					<p>Drawer content here.</p>
					<p>Slides in from the left.</p>
				</div>
			</DrawerContainer>

			<DrawerContainer
				isVisible={isRightOpen}
				makeInvisible={() => setIsRightOpen(false)}
				orientation="right"
			>
				<DrawerHeader showCloseButton={false}>
					Right Drawer (no close button)
				</DrawerHeader>
				<div style={{ padding: "1rem" }}>
					<p>Slides in from the right.</p>
					<Button onClick={() => setIsRightOpen(false)}>Close manually</Button>
				</div>
			</DrawerContainer>

			<div className="exampleContainer row">
				<Button onClick={() => setIsLeftOpen(true)}>Open Left Drawer</Button>
				<Button onClick={() => setIsRightOpen(true)}>Open Right Drawer</Button>
			</div>
		</>
	);
}
