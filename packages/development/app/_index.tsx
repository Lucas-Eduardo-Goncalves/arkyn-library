import { Link } from "react-router";

export default function IndexRoute() {
	return (
		<div className="exampleContainer">
			<Link to="/alert">Alert</Link>
			<Link to="/badge">Badge</Link>
			<Link to="/button">Button</Link>
			<Link to="/icon-button">Icon Button</Link>
			<Link to="/card-tab">Card Tab</Link>
			<Link to="/checkbox">Checkbox</Link>
			<Link to="/input">Input</Link>
			<Link to="/currency-input">Currency Input</Link>
			<Link to="/masked-input">Masked Input</Link>
			<Link to="/select">Select</Link>
		</div>
	);
}
