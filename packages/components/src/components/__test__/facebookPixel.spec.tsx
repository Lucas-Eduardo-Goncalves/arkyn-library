import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FacebookPixel } from "../facebookPixel";

const facebookPixelClientMock = vi.fn();

vi.mock("../facebookPixel.client", () => ({
	FacebookPixelClient: (props: Record<string, unknown>) => {
		facebookPixelClientMock(props);
		return <div data-testid="facebook-pixel-client" />;
	},
}));

describe("FacebookPixel", () => {
	afterEach(() => {
		cleanup();
		vi.unstubAllEnvs();
		facebookPixelClientMock.mockClear();
	});

	it("should render nothing when NODE_ENV is not production and showInDevMode is omitted", () => {
		vi.stubEnv("NODE_ENV", "test");

		const { container } = render(<FacebookPixel pixelId="123456789012345" />);

		expect(container).toBeEmptyDOMElement();
		expect(facebookPixelClientMock).not.toHaveBeenCalled();
	});

	it("should render nothing when NODE_ENV is not production and showInDevMode is false", () => {
		vi.stubEnv("NODE_ENV", "development");

		const { container } = render(
			<FacebookPixel pixelId="123456789012345" showInDevMode={false} />,
		);

		expect(container).toBeEmptyDOMElement();
		expect(facebookPixelClientMock).not.toHaveBeenCalled();
	});

	it("should render the client pixel component when NODE_ENV is not production but showInDevMode is true", () => {
		vi.stubEnv("NODE_ENV", "development");

		render(<FacebookPixel pixelId="123456789012345" showInDevMode />);

		expect(screen.getByTestId("facebook-pixel-client")).toBeInTheDocument();
		expect(facebookPixelClientMock).toHaveBeenCalledTimes(1);
	});

	it("should render the client pixel component when NODE_ENV is production even without showInDevMode", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(<FacebookPixel pixelId="123456789012345" />);

		expect(screen.getByTestId("facebook-pixel-client")).toBeInTheDocument();
		expect(facebookPixelClientMock).toHaveBeenCalledTimes(1);
	});

	it("should render the client pixel component when NODE_ENV is production and showInDevMode is also true", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(<FacebookPixel pixelId="123456789012345" showInDevMode />);

		expect(screen.getByTestId("facebook-pixel-client")).toBeInTheDocument();
		expect(facebookPixelClientMock).toHaveBeenCalledTimes(1);
	});

	it("should pass the pixelId prop through to the client component", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(<FacebookPixel pixelId="999888777666555" />);

		expect(facebookPixelClientMock).toHaveBeenCalledWith(
			expect.objectContaining({ pixelId: "999888777666555" }),
		);
	});

	it("should pass the options prop through to the client component", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(
			<FacebookPixel
				pixelId="123456789012345"
				options={{ autoConfig: false, debug: true }}
			/>,
		);

		expect(facebookPixelClientMock).toHaveBeenCalledWith(
			expect.objectContaining({
				options: { autoConfig: false, debug: true },
			}),
		);
	});

	it("should default options to undefined when omitted", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(<FacebookPixel pixelId="123456789012345" />);

		const receivedProps = facebookPixelClientMock.mock.calls[0][0];
		expect(receivedProps.options).toBeUndefined();
	});

	it("should pass the pageView prop through to the client component", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(<FacebookPixel pixelId="123456789012345" pageView />);

		expect(facebookPixelClientMock).toHaveBeenCalledWith(
			expect.objectContaining({ pageView: true }),
		);
	});

	it("should pass the grantConsent prop through to the client component", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(<FacebookPixel pixelId="123456789012345" grantConsent />);

		expect(facebookPixelClientMock).toHaveBeenCalledWith(
			expect.objectContaining({ grantConsent: true }),
		);
	});

	it("should pass the revokeConsent prop through to the client component", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(<FacebookPixel pixelId="123456789012345" revokeConsent />);

		expect(facebookPixelClientMock).toHaveBeenCalledWith(
			expect.objectContaining({ revokeConsent: true }),
		);
	});

	it("should pass the track prop through to the client component", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(
			<FacebookPixel
				pixelId="123456789012345"
				track={["Purchase", { value: 99.9, currency: "BRL" }]}
			/>,
		);

		expect(facebookPixelClientMock).toHaveBeenCalledWith(
			expect.objectContaining({
				track: ["Purchase", { value: 99.9, currency: "BRL" }],
			}),
		);
	});

	it("should pass the trackCustom prop through to the client component", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(
			<FacebookPixel
				pixelId="123456789012345"
				trackCustom={["CustomEvent", { foo: "bar" }]}
			/>,
		);

		expect(facebookPixelClientMock).toHaveBeenCalledWith(
			expect.objectContaining({
				trackCustom: ["CustomEvent", { foo: "bar" }],
			}),
		);
	});

	it("should pass the trackSingle prop through to the client component", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(
			<FacebookPixel
				pixelId="123456789012345"
				trackSingle={["Lead", { value: 10 }]}
			/>,
		);

		expect(facebookPixelClientMock).toHaveBeenCalledWith(
			expect.objectContaining({
				trackSingle: ["Lead", { value: 10 }],
			}),
		);
	});

	it("should pass the trackSingleCustom prop through to the client component", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(
			<FacebookPixel
				pixelId="123456789012345"
				trackSingleCustom={["CustomLead", { value: 5 }]}
			/>,
		);

		expect(facebookPixelClientMock).toHaveBeenCalledWith(
			expect.objectContaining({
				trackSingleCustom: ["CustomLead", { value: 5 }],
			}),
		);
	});

	it("should pass track and related event props as undefined when omitted", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(<FacebookPixel pixelId="123456789012345" />);

		const receivedProps = facebookPixelClientMock.mock.calls[0][0];
		expect(receivedProps.track).toBeUndefined();
		expect(receivedProps.trackCustom).toBeUndefined();
		expect(receivedProps.trackSingle).toBeUndefined();
		expect(receivedProps.trackSingleCustom).toBeUndefined();
		expect(receivedProps.pageView).toBeUndefined();
		expect(receivedProps.grantConsent).toBeUndefined();
		expect(receivedProps.revokeConsent).toBeUndefined();
	});

	it("should pass all props through simultaneously without dropping any", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(
			<FacebookPixel
				pixelId="123456789012345"
				showInDevMode
				options={{ autoConfig: true, debug: false }}
				pageView
				grantConsent
				revokeConsent={false}
				track={["Purchase", { value: 1 }]}
				trackCustom={["Custom", { value: 2 }]}
				trackSingle={["Lead", { value: 3 }]}
				trackSingleCustom={["CustomLead", { value: 4 }]}
			/>,
		);

		expect(facebookPixelClientMock).toHaveBeenCalledWith({
			pixelId: "123456789012345",
			showInDevMode: true,
			options: { autoConfig: true, debug: false },
			pageView: true,
			grantConsent: true,
			revokeConsent: false,
			track: ["Purchase", { value: 1 }],
			trackCustom: ["Custom", { value: 2 }],
			trackSingle: ["Lead", { value: 3 }],
			trackSingleCustom: ["CustomLead", { value: 4 }],
		});
	});

	it("should render only one instance of the client component per render", () => {
		vi.stubEnv("NODE_ENV", "production");

		render(<FacebookPixel pixelId="123456789012345" />);

		expect(screen.getAllByTestId("facebook-pixel-client")).toHaveLength(1);
	});

	it("should not throw when pixelId is an empty string", () => {
		vi.stubEnv("NODE_ENV", "production");

		expect(() => render(<FacebookPixel pixelId="" />)).not.toThrow();
		expect(facebookPixelClientMock).toHaveBeenCalledWith(
			expect.objectContaining({ pixelId: "" }),
		);
	});

	it("should not render the client component when NODE_ENV is production but toggled back to non-production on re-render", () => {
		vi.stubEnv("NODE_ENV", "production");

		const { rerender } = render(<FacebookPixel pixelId="123456789012345" />);
		expect(screen.getByTestId("facebook-pixel-client")).toBeInTheDocument();

		vi.stubEnv("NODE_ENV", "test");
		rerender(<FacebookPixel pixelId="123456789012345" />);

		expect(
			screen.queryByTestId("facebook-pixel-client"),
		).not.toBeInTheDocument();
	});
});
