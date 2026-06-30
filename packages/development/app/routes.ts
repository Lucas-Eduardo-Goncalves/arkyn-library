import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
	index("./_index.tsx"),
	route("/alert", "./components/components.alert.tsx"),
	route("/badge", "./components/components.badge.tsx"),
	route("/button", "./components/components.button.tsx"),
] satisfies RouteConfig;
