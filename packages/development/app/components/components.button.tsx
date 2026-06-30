import { Button } from "@arkyn/components/button";
import { CircleDashed } from "lucide-react";

export default function ButtonRoute() {
	return (
		<>
			<div className="exampleContainer row">
				<Button leftIcon={CircleDashed} scheme="danger" variant="ghost">Danger</Button>
				<Button leftIcon={CircleDashed} scheme="info" variant="ghost">Info</Button>
				<Button leftIcon={CircleDashed} scheme="success" variant="ghost">Success</Button>
				<Button leftIcon={CircleDashed} scheme="warning" variant="ghost">Warning</Button>
				<Button leftIcon={CircleDashed} scheme="primary" variant="ghost">Primary</Button>
			</div>

			<div className="exampleContainer row">
				<Button leftIcon={CircleDashed} scheme="danger" variant="outline">Danger</Button>
				<Button leftIcon={CircleDashed} scheme="info" variant="outline">Info</Button>
				<Button leftIcon={CircleDashed} scheme="success" variant="outline">Success</Button>
				<Button leftIcon={CircleDashed} scheme="warning" variant="outline">Warning</Button>
				<Button leftIcon={CircleDashed} scheme="primary" variant="outline">Primary</Button>
			</div>

			<div className="exampleContainer row">
				<Button leftIcon={CircleDashed} scheme="danger" variant="solid">Danger</Button>
				<Button leftIcon={CircleDashed} scheme="info" variant="solid">Info</Button>
				<Button leftIcon={CircleDashed} scheme="success" variant="solid">Success</Button>
				<Button leftIcon={CircleDashed} scheme="warning" variant="solid">Warning</Button>
				<Button leftIcon={CircleDashed} scheme="primary" variant="solid">Primary</Button>
			</div>

			<div className="exampleContainer row">
				<Button leftIcon={CircleDashed} scheme="danger" variant="invisible">Danger</Button>
				<Button leftIcon={CircleDashed} scheme="info" variant="invisible">Info</Button>
				<Button leftIcon={CircleDashed} scheme="success" variant="invisible">Success</Button>
				<Button leftIcon={CircleDashed} scheme="warning" variant="invisible">Warning</Button>
				<Button leftIcon={CircleDashed} scheme="primary" variant="invisible">Primary</Button>
			</div>

			<div className="exampleContainer row">
				<Button size="xs">Extra Small</Button>
				<Button size="sm">Small</Button>
				<Button size="md">Medium</Button>
				<Button size="lg">Large</Button>
			</div>

			<div className="exampleContainer row">
				<Button rightIcon={CircleDashed} scheme="primary">Right icon</Button>
				<Button leftIcon={CircleDashed} rightIcon={CircleDashed} scheme="primary">Both icons</Button>
				<Button isLoading scheme="primary">Loading</Button>
				<Button isLoading loadingText="Saving..." scheme="success">Save</Button>
				<Button disabled scheme="primary">Disabled</Button>
			</div>
		</>
	);
}
