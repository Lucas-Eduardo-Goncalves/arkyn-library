import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
	index("./_index.tsx"),
	route("/alert", "./components/components.alert.tsx"),
	route("/badge", "./components/components.badge.tsx"),
	route("/button", "./components/components.button.tsx"),
	route("/card-tab", "./components/components.cardTab.tsx"),
	route("/icon-button", "./components/components.iconButton.tsx"),
	route("/checkbox", "./components/components.checkbox.tsx"),
	route("/input", "./components/components.input.tsx"),
	route("/currency-input", "./components/components.currencyInput.tsx"),
] satisfies RouteConfig;
