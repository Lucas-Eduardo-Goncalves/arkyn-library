import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GoogleTagManager } from "../googleTagManager";

const googleTagManagerClientMock = vi.fn();

vi.mock("../googleTagManager/googleTagManager.client", () => ({
	GoogleTagManagerClient: (props: Record<string, unknown>) => {
		googleTagManagerClientMock(props);
		return <div data-testid="google-tag-manager-client" />;
	},
}));

describe("GoogleTagManager", () => {
	afterEach(() => {
		cleanup();
		vi.unstubAllEnvs();
		googleTagManagerClientMock.mockClear();
	});

	it("should render nothing when NODE_ENV is not production and showInDevMode is omitted", () => {
		vi.stubEnv("NODE_ENV", "test");

		const { container } = render(<GoogleTagManager gtmId="GTM-XXXXXXX" />);

		expect(container).toBeEmptyDOMElement();
		expect(googleTagManagerClientMock).not.toHaveBeenCalled();
	});

	it("should render nothing when NODE_ENV is not production and showInDevMode is false", () => {
		vi.stubEnv("NODE_ENV", "development");

		const { container } = render(
			<GoogleTagManager gtmId="GTM-XXXXXXX" showInDevMode={false} />,
		);

		expect(container).toBeEmptyDOMElement();
		expect(googleTagManagerClientMock).not.toHaveBeenCalled();
	});

	it("should render the client component when NODE_ENV is not production but showInDevMode is true", () => {
		vi.stubEnv("NODE_ENV", "development");

		render(<GoogleTagManager gtmId="GTM-XXXXXXX" showInDevMode />);

		expect(screen.getByTestId("google-tag-manager-client")).toBeInTheDocument();
		expect(googleTagManagerClientMock).toHaveBeenCalledTimes(1);
	});

	it("should render the client component when NODE_ENV is production even without showInDevMode", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(<GoogleTagManager gtmId="GTM-XXXXXXX" />);

		expect(screen.getByTestId("google-tag-manager-client")).toBeInTheDocument();
		expect(googleTagManagerClientMock).toHaveBeenCalledTimes(1);
	});

	it("should render the client component when NODE_ENV is production and showInDevMode is also true", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(<GoogleTagManager gtmId="GTM-XXXXXXX" showInDevMode />);

		expect(screen.getByTestId("google-tag-manager-client")).toBeInTheDocument();
		expect(googleTagManagerClientMock).toHaveBeenCalledTimes(1);
	});

	it("should pass the gtmId prop through to the client component", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(<GoogleTagManager gtmId="GTM-ABC1234" />);

		expect(googleTagManagerClientMock).toHaveBeenCalledWith(
			expect.objectContaining({ gtmId: "GTM-ABC1234" }),
		);
	});

	it("should default auth to an empty string when omitted", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(<GoogleTagManager gtmId="GTM-XXXXXXX" />);

		expect(googleTagManagerClientMock).toHaveBeenCalledWith(
			expect.objectContaining({ auth: "" }),
		);
	});

	it("should pass a custom auth prop through to the client component", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(<GoogleTagManager gtmId="GTM-XXXXXXX" auth="my-auth-token" />);

		expect(googleTagManagerClientMock).toHaveBeenCalledWith(
			expect.objectContaining({ auth: "my-auth-token" }),
		);
	});

	it("should default preview to an empty string when omitted", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(<GoogleTagManager gtmId="GTM-XXXXXXX" />);

		expect(googleTagManagerClientMock).toHaveBeenCalledWith(
			expect.objectContaining({ preview: "" }),
		);
	});

	it("should pass a custom preview prop through to the client component", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(<GoogleTagManager gtmId="GTM-XXXXXXX" preview="env-3" />);

		expect(googleTagManagerClientMock).toHaveBeenCalledWith(
			expect.objectContaining({ preview: "env-3" }),
		);
	});

	it("should default dataLayerName to 'dataLayer' when omitted", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(<GoogleTagManager gtmId="GTM-XXXXXXX" />);

		expect(googleTagManagerClientMock).toHaveBeenCalledWith(
			expect.objectContaining({ dataLayerName: "dataLayer" }),
		);
	});

	it("should pass a custom dataLayerName prop through to the client component", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(
			<GoogleTagManager gtmId="GTM-XXXXXXX" dataLayerName="customLayer" />,
		);

		expect(googleTagManagerClientMock).toHaveBeenCalledWith(
			expect.objectContaining({ dataLayerName: "customLayer" }),
		);
	});

	it("should default events to an empty object when omitted", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(<GoogleTagManager gtmId="GTM-XXXXXXX" />);

		expect(googleTagManagerClientMock).toHaveBeenCalledWith(
			expect.objectContaining({ events: {} }),
		);
	});

	it("should pass a custom events prop through to the client component", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(
			<GoogleTagManager
				gtmId="GTM-XXXXXXX"
				events={{ eventCategory: "cta", eventAction: "click" }}
			/>,
		);

		expect(googleTagManagerClientMock).toHaveBeenCalledWith(
			expect.objectContaining({
				events: { eventCategory: "cta", eventAction: "click" },
			}),
		);
	});

	it("should default dataLayer to an empty object when omitted", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(<GoogleTagManager gtmId="GTM-XXXXXXX" />);

		expect(googleTagManagerClientMock).toHaveBeenCalledWith(
			expect.objectContaining({ dataLayer: {} }),
		);
	});

	it("should pass a custom dataLayer prop through to the client component", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(
			<GoogleTagManager
				gtmId="GTM-XXXXXXX"
				dataLayer={{ pageType: "home", userType: "anonymous" }}
			/>,
		);

		expect(googleTagManagerClientMock).toHaveBeenCalledWith(
			expect.objectContaining({
				dataLayer: { pageType: "home", userType: "anonymous" },
			}),
		);
	});

	it("should pass all props through simultaneously without dropping any", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(
			<GoogleTagManager
				gtmId="GTM-XXXXXXX"
				auth="my-auth-token"
				preview="env-3"
				dataLayerName="customLayer"
				events={{ eventCategory: "cta" }}
				dataLayer={{ pageType: "home" }}
				showInDevMode
			/>,
		);

		expect(googleTagManagerClientMock).toHaveBeenCalledWith({
			gtmId: "GTM-XXXXXXX",
			auth: "my-auth-token",
			preview: "env-3",
			dataLayerName: "customLayer",
			events: { eventCategory: "cta" },
			dataLayer: { pageType: "home" },
		});
	});

	it("should render only one instance of the client component per render", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(<GoogleTagManager gtmId="GTM-XXXXXXX" />);

		expect(screen.getAllByTestId("google-tag-manager-client")).toHaveLength(1);
	});

	it("should not throw when gtmId is an empty string", () => {
		vi.stubEnv("NODE_ENV", "production");

		expect(() => render(<GoogleTagManager gtmId="" />)).not.toThrow();
		expect(googleTagManagerClientMock).toHaveBeenCalledWith(
			expect.objectContaining({ gtmId: "" }),
		);
	});

	it("should not render the client component when NODE_ENV is production but toggled back to non-production on re-render", () => {
		vi.stubEnv("NODE_ENV", "production");

		const { rerender } = render(<GoogleTagManager gtmId="GTM-XXXXXXX" />);
		expect(screen.getByTestId("google-tag-manager-client")).toBeInTheDocument();

		vi.stubEnv("NODE_ENV", "test");
		rerender(<GoogleTagManager gtmId="GTM-XXXXXXX" />);

		expect(
			screen.queryByTestId("google-tag-manager-client"),
		).not.toBeInTheDocument();
	});
});
