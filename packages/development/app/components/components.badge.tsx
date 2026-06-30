import { Badge } from "@arkyn/components/badge";
import { CircleDashed } from "lucide-react";

export default function BadgeRoute() {
	return (
		<>
			<div className="exampleContainer row">
				<Badge leftIcon={CircleDashed} scheme="danger" variant="ghost">Danger</Badge>
				<Badge leftIcon={CircleDashed} scheme="info" variant="ghost">Info</Badge>
				<Badge leftIcon={CircleDashed} scheme="success" variant="ghost">Success</Badge>
				<Badge leftIcon={CircleDashed} scheme="warning" variant="ghost">Warning</Badge>
				<Badge leftIcon={CircleDashed} scheme="primary" variant="ghost">Primary</Badge>
				<Badge leftIcon={CircleDashed} scheme="secondary" variant="ghost">Secondary</Badge>
			</div>

			<div className="exampleContainer row">
				<Badge leftIcon={CircleDashed} scheme="danger" variant="outline">Danger</Badge>
				<Badge leftIcon={CircleDashed} scheme="info" variant="outline">Info</Badge>
				<Badge leftIcon={CircleDashed} scheme="success" variant="outline">Success</Badge>
				<Badge leftIcon={CircleDashed} scheme="warning" variant="outline">Warning</Badge>
				<Badge leftIcon={CircleDashed} scheme="primary" variant="outline">Primary</Badge>
				<Badge leftIcon={CircleDashed} scheme="secondary" variant="outline">Secondary</Badge>
			</div>

			<div className="exampleContainer row">
				<Badge leftIcon={CircleDashed} scheme="danger" variant="solid">Danger</Badge>
				<Badge leftIcon={CircleDashed} scheme="info" variant="solid">Info</Badge>
				<Badge leftIcon={CircleDashed} scheme="success" variant="solid">Success</Badge>
				<Badge leftIcon={CircleDashed} scheme="warning" variant="solid">Warning</Badge>
				<Badge leftIcon={CircleDashed} scheme="primary" variant="solid">Primary</Badge>
				<Badge leftIcon={CircleDashed} scheme="secondary" variant="solid">Secondary</Badge>
			</div>

			<div className="exampleContainer row">
				<Badge scheme="primary" variant="solid" size="md">Size md</Badge>
				<Badge scheme="primary" variant="solid" size="lg">Size lg</Badge>
				<Badge scheme="success" variant="ghost" size="md">Size md</Badge>
				<Badge scheme="success" variant="ghost" size="lg">Size lg</Badge>
			</div>

			<div className="exampleContainer row">
				<Badge scheme="primary" variant="solid" rightIcon={CircleDashed}>Right icon</Badge>
				<Badge scheme="info" variant="outline" rightIcon={CircleDashed}>Right icon</Badge>
				<Badge leftIcon={CircleDashed} scheme="warning" variant="ghost" rightIcon={CircleDashed}>Both icons</Badge>
			</div>
		</>
	);
}
