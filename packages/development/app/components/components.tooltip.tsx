import { Button } from "@arkyn/components/button";
import { IconButton } from "@arkyn/components/iconButton";
import { Tooltip } from "@arkyn/components/tooltip";
import { Info, Save, Trash2 } from "lucide-react";

export default function TooltipRoute() {
	return (
		<>
			<div className="exampleContainer row foreground">
				<Tooltip text="Tooltip on top" orientation="top">
					<Button>Top</Button>
				</Tooltip>
				<Tooltip text="Tooltip on right" orientation="right">
					<Button>Right</Button>
				</Tooltip>
				<Tooltip text="Tooltip on bottom" orientation="bottom">
					<Button>Bottom</Button>
				</Tooltip>
				<Tooltip text="Tooltip on left" orientation="left">
					<Button>Left</Button>
				</Tooltip>
			</div>

			<div className="exampleContainer row foreground">
				<Tooltip text="Size md" size="md" orientation="top">
					<Button>Size md</Button>
				</Tooltip>
				<Tooltip text="Size lg — default" size="lg" orientation="top">
					<Button>Size lg</Button>
				</Tooltip>
			</div>

			<div className="exampleContainer row foreground">
				<Tooltip text="Save changes" orientation="bottom">
					<IconButton icon={Save} aria-label="Save" />
				</Tooltip>
				<Tooltip text="More information" orientation="bottom">
					<IconButton icon={Info} aria-label="Info" />
				</Tooltip>
				<Tooltip text="Delete item" orientation="bottom">
					<IconButton icon={Trash2} aria-label="Delete" scheme="danger" />
				</Tooltip>
			</div>

			<div className="exampleContainer row">
				<Tooltip text="Dark mode tooltip" orientation="top">
					<Button>Hover me</Button>
				</Tooltip>
				<Tooltip text="Dark right" orientation="right">
					<Button>Right</Button>
				</Tooltip>
			</div>
		</>
	);
}
