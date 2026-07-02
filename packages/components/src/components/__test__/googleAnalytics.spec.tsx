import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GoogleAnalytics } from "../index";

const googleAnalyticsClientMock = vi.fn(() => null);

vi.mock("../googleAnalytics.client", () => ({
	GoogleAnalyticsClient: (props: { measurementId: string }) =>
		googleAnalyticsClientMock(props),
}));

describe("GoogleAnalytics", () => {
	const originalNodeEnv = process.env.NODE_ENV;

	afterEach(() => {
		process.env.NODE_ENV = originalNodeEnv;
		googleAnalyticsClientMock.mockClear();
	});

	it("should render nothing outside production mode by default", () => {
		process.env.NODE_ENV = "test";

		const { container } = render(
			<GoogleAnalytics measurementId="G-XXXXXXXXXX" />,
		);

		expect(container).toBeEmptyDOMElement();
		expect(googleAnalyticsClientMock).not.toHaveBeenCalled();
	});

	it("should render nothing in development mode by default", () => {
		process.env.NODE_ENV = "development";

		const { container } = render(
			<GoogleAnalytics measurementId="G-XXXXXXXXXX" />,
		);

		expect(container).toBeEmptyDOMElement();
		expect(googleAnalyticsClientMock).not.toHaveBeenCalled();
	});

	it("should render the client snippet in production mode", () => {
		process.env.NODE_ENV = "production";

		render(<GoogleAnalytics measurementId="G-XXXXXXXXXX" />);

		expect(googleAnalyticsClientMock).toHaveBeenCalledTimes(1);
		expect(googleAnalyticsClientMock).toHaveBeenCalledWith({
			measurementId: "G-XXXXXXXXXX",
		});
	});

	it("should render the client snippet when showInDevMode is true, even outside production", () => {
		process.env.NODE_ENV = "test";

		render(<GoogleAnalytics measurementId="G-XXXXXXXXXX" showInDevMode />);

		expect(googleAnalyticsClientMock).toHaveBeenCalledTimes(1);
		expect(googleAnalyticsClientMock).toHaveBeenCalledWith({
			measurementId: "G-XXXXXXXXXX",
		});
	});

	it("should not render the client snippet when showInDevMode is false outside production", () => {
		process.env.NODE_ENV = "development";

		render(
			<GoogleAnalytics measurementId="G-XXXXXXXXXX" showInDevMode={false} />,
		);

		expect(googleAnalyticsClientMock).not.toHaveBeenCalled();
	});

	it("should default showInDevMode to false when omitted", () => {
		process.env.NODE_ENV = "development";

		const { container } = render(
			<GoogleAnalytics measurementId="G-XXXXXXXXXX" />,
		);

		expect(container).toBeEmptyDOMElement();
	});

	it("should pass through a custom measurementId to the client snippet", () => {
		process.env.NODE_ENV = "production";

		render(<GoogleAnalytics measurementId="G-CUSTOM12345" />);

		expect(googleAnalyticsClientMock).toHaveBeenCalledWith({
			measurementId: "G-CUSTOM12345",
		});
	});

	it("should pass an empty string measurementId through unchanged", () => {
		process.env.NODE_ENV = "production";

		render(<GoogleAnalytics measurementId="" />);

		expect(googleAnalyticsClientMock).toHaveBeenCalledWith({
			measurementId: "",
		});
	});

	it("should re-render with the client snippet when switching from dev to production", () => {
		process.env.NODE_ENV = "development";

		const { rerender, container } = render(
			<GoogleAnalytics measurementId="G-XXXXXXXXXX" />,
		);

		expect(container).toBeEmptyDOMElement();
		expect(googleAnalyticsClientMock).not.toHaveBeenCalled();

		process.env.NODE_ENV = "production";
		rerender(<GoogleAnalytics measurementId="G-XXXXXXXXXX" />);

		expect(googleAnalyticsClientMock).toHaveBeenCalledTimes(1);
	});

	it("should stop rendering the client snippet when measurementId changes while in dev mode without showInDevMode", () => {
		process.env.NODE_ENV = "production";

		const { rerender } = render(
			<GoogleAnalytics measurementId="G-FIRST00000" />,
		);

		expect(googleAnalyticsClientMock).toHaveBeenCalledWith({
			measurementId: "G-FIRST00000",
		});

		process.env.NODE_ENV = "development";
		googleAnalyticsClientMock.mockClear();
		rerender(<GoogleAnalytics measurementId="G-SECOND0000" />);

		expect(googleAnalyticsClientMock).not.toHaveBeenCalled();
	});

	it("should not throw and render nothing when NODE_ENV is undefined", () => {
		process.env.NODE_ENV = undefined as unknown as string;

		const { container } = render(
			<GoogleAnalytics measurementId="G-XXXXXXXXXX" />,
		);

		expect(container).toBeEmptyDOMElement();
		expect(googleAnalyticsClientMock).not.toHaveBeenCalled();
	});
});
