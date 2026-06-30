import { Link } from "react-router";

export default function IndexRoute() {
	return (
		<div className="exampleContainer">
			<Link to="/alert">Alert</Link>
			<Link to="/badge">Badge</Link>
			<Link to="/button">Button</Link>
			<Link to="/card-tab">Card Tab</Link>
		</div>
	);
}
