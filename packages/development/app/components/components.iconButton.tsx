import { IconButton } from "@arkyn/components/iconButton";
import { CircleDashed } from "lucide-react";

export default function IconButtonRoute() {
	return (
		<>
			<div className="exampleContainer row">
				<IconButton
					aria-label="ghost danger"
					icon={CircleDashed}
					scheme="danger"
					variant="ghost"
				/>
				<IconButton
					aria-label="ghost info"
					icon={CircleDashed}
					scheme="info"
					variant="ghost"
				/>
				<IconButton
					aria-label="ghost success"
					icon={CircleDashed}
					scheme="success"
					variant="ghost"
				/>
				<IconButton
					aria-label="ghost warning"
					icon={CircleDashed}
					scheme="warning"
					variant="ghost"
				/>
				<IconButton
					aria-label="ghost primary"
					icon={CircleDashed}
					scheme="primary"
					variant="ghost"
				/>
			</div>

			<div className="exampleContainer row">
				<IconButton
					aria-label="outline danger"
					icon={CircleDashed}
					scheme="danger"
					variant="outline"
				/>
				<IconButton
					aria-label="outline info"
					icon={CircleDashed}
					scheme="info"
					variant="outline"
				/>
				<IconButton
					aria-label="outline success"
					icon={CircleDashed}
					scheme="success"
					variant="outline"
				/>
				<IconButton
					aria-label="outline warning"
					icon={CircleDashed}
					scheme="warning"
					variant="outline"
				/>
				<IconButton
					aria-label="outline primary"
					icon={CircleDashed}
					scheme="primary"
					variant="outline"
				/>
			</div>

			<div className="exampleContainer row">
				<IconButton
					aria-label="solid danger"
					icon={CircleDashed}
					scheme="danger"
					variant="solid"
				/>
				<IconButton
					aria-label="solid info"
					icon={CircleDashed}
					scheme="info"
					variant="solid"
				/>
				<IconButton
					aria-label="solid success"
					icon={CircleDashed}
					scheme="success"
					variant="solid"
				/>
				<IconButton
					aria-label="solid warning"
					icon={CircleDashed}
					scheme="warning"
					variant="solid"
				/>
				<IconButton
					aria-label="solid primary"
					icon={CircleDashed}
					scheme="primary"
					variant="solid"
				/>
			</div>

			<div className="exampleContainer row">
				<IconButton
					aria-label="invisible danger"
					icon={CircleDashed}
					scheme="danger"
					variant="invisible"
				/>
				<IconButton
					aria-label="invisible info"
					icon={CircleDashed}
					scheme="info"
					variant="invisible"
				/>
				<IconButton
					aria-label="invisible success"
					icon={CircleDashed}
					scheme="success"
					variant="invisible"
				/>
				<IconButton
					aria-label="invisible warning"
					icon={CircleDashed}
					scheme="warning"
					variant="invisible"
				/>
				<IconButton
					aria-label="invisible primary"
					icon={CircleDashed}
					scheme="primary"
					variant="invisible"
				/>
			</div>

			<div className="exampleContainer row">
				<IconButton aria-label="xs" icon={CircleDashed} size="xs" />
				<IconButton aria-label="sm" icon={CircleDashed} size="sm" />
				<IconButton aria-label="md" icon={CircleDashed} size="md" />
				<IconButton aria-label="lg" icon={CircleDashed} size="lg" />
			</div>

			<div className="exampleContainer row">
				<IconButton aria-label="loading" icon={CircleDashed} isLoading />
				<IconButton aria-label="disabled" icon={CircleDashed} disabled />
			</div>
		</>
	);
}
