import { Popover } from "@arkyn/components/popover";
import { Button } from "@arkyn/components/button";

export default function PopoverRoute() {
	return (
		<>
			<div className="exampleContainer row">
				<Popover button={<Button>Bottom Left</Button>} orientation="bottomLeft" closeOnClick>
					<div style={{ padding: "1rem", minWidth: "160px" }}>
						<p>bottomLeft orientation</p>
					</div>
				</Popover>

				<Popover button={<Button>Bottom Right</Button>} orientation="bottomRight" closeOnClick>
					<div style={{ padding: "1rem", minWidth: "160px" }}>
						<p>bottomRight orientation</p>
					</div>
				</Popover>

				<Popover button={<Button>Top Left</Button>} orientation="topLeft" closeOnClick>
					<div style={{ padding: "1rem", minWidth: "160px" }}>
						<p>topLeft orientation</p>
					</div>
				</Popover>

				<Popover button={<Button>Top Right</Button>} orientation="topRight" closeOnClick>
					<div style={{ padding: "1rem", minWidth: "160px" }}>
						<p>topRight orientation</p>
					</div>
				</Popover>
			</div>

			<div className="exampleContainer row">
				<Popover button={<Button>Left</Button>} orientation="left" closeOnClick>
					<div style={{ padding: "1rem" }}>Left</div>
				</Popover>

				<Popover button={<Button>Right</Button>} orientation="right" closeOnClick>
					<div style={{ padding: "1rem" }}>Right</div>
				</Popover>

				<Popover button={<Button>Top</Button>} orientation="top" closeOnClick>
					<div style={{ padding: "1rem" }}>Top</div>
				</Popover>

				<Popover button={<Button>Bottom</Button>} orientation="bottom" closeOnClick>
					<div style={{ padding: "1rem" }}>Bottom</div>
				</Popover>
			</div>

			<div className="exampleContainer row">
				<Popover button={<Button variant="outline">Menu (keep open)</Button>} orientation="bottomLeft">
					<ul style={{ padding: "0.5rem", listStyle: "none", minWidth: "160px" }}>
						<li style={{ padding: "0.5rem" }}>Edit</li>
						<li style={{ padding: "0.5rem" }}>Duplicate</li>
						<li style={{ padding: "0.5rem" }}>Delete</li>
					</ul>
				</Popover>
			</div>
		</>
	);
}
