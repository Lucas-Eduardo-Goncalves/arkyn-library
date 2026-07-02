import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AudioPlayer } from "../audioPlayer";

describe("AudioPlayer", () => {
	beforeEach(() => {
		window.HTMLMediaElement.prototype.play = vi
			.fn()
			.mockResolvedValue(undefined);
		window.HTMLMediaElement.prototype.pause = vi.fn();
		window.HTMLMediaElement.prototype.load = vi.fn();
	});

	afterEach(() => {
		cleanup();
	});

	it("should render without errors", () => {
		const { container } = render(<AudioPlayer src="/audio/episode.mp3" />);

		expect(container.querySelector(".arkynAudioPlayer")).toBeInTheDocument();
	});

	it("should render the audio element with the given src", () => {
		const { container } = render(<AudioPlayer src="/audio/episode.mp3" />);

		const audio = container.querySelector("audio");
		expect(audio).toBeInTheDocument();
		expect(audio).toHaveAttribute("src", "/audio/episode.mp3");
	});

	it("should render the play/pause toggle button", () => {
		render(<AudioPlayer src="/audio/episode.mp3" />);

		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("should render the current time and total time labels", () => {
		const { container } = render(<AudioPlayer src="/audio/episode.mp3" />);

		const paragraphs = container.querySelectorAll("p");
		expect(paragraphs).toHaveLength(2);
	});

	it("should render the formatted default time as 00:00", () => {
		render(<AudioPlayer src="/audio/episode.mp3" />);

		expect(screen.getAllByText("00:00")).toHaveLength(2);
	});

	it("should render the Slider progress bar", () => {
		const { container } = render(<AudioPlayer src="/audio/episode.mp3" />);

		expect(container.querySelector(".arkynSliderTrack")).toBeInTheDocument();
	});

	it("should render the Play icon by default (paused state)", () => {
		const { container } = render(<AudioPlayer src="/audio/episode.mp3" />);

		const button = screen.getByRole("button");
		expect(button.querySelector("svg")).toBeInTheDocument();
		expect(container.querySelector(".lucide-play")).toBeInTheDocument();
		expect(container.querySelector(".lucide-pause")).not.toBeInTheDocument();
	});

	it("should switch to the Pause icon when playback starts", async () => {
		const user = userEvent.setup();
		const { container } = render(<AudioPlayer src="/audio/episode.mp3" />);

		await user.click(screen.getByRole("button"));

		expect(container.querySelector(".lucide-pause")).toBeInTheDocument();
		expect(container.querySelector(".lucide-play")).not.toBeInTheDocument();
	});

	it("should switch back to the Play icon when playback is paused again", async () => {
		const user = userEvent.setup();
		const { container } = render(<AudioPlayer src="/audio/episode.mp3" />);

		const button = screen.getByRole("button");
		await user.click(button);
		await user.click(button);

		expect(container.querySelector(".lucide-play")).toBeInTheDocument();
		expect(container.querySelector(".lucide-pause")).not.toBeInTheDocument();
	});

	it("should call the audio element's play method when toggled on", async () => {
		const user = userEvent.setup();
		render(<AudioPlayer src="/audio/episode.mp3" />);

		await user.click(screen.getByRole("button"));

		expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
	});

	it("should call the audio element's pause method when toggled off", async () => {
		const user = userEvent.setup();
		render(<AudioPlayer src="/audio/episode.mp3" />);

		const button = screen.getByRole("button");
		await user.click(button);
		vi.mocked(window.HTMLMediaElement.prototype.pause).mockClear();
		await user.click(button);

		expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();
	});

	it("should call onPlayAudio when playback starts", async () => {
		const user = userEvent.setup();
		const handlePlay = vi.fn();
		render(<AudioPlayer src="/audio/episode.mp3" onPlayAudio={handlePlay} />);

		await user.click(screen.getByRole("button"));

		expect(handlePlay).toHaveBeenCalledTimes(1);
		expect(handlePlay).toHaveBeenCalledWith(
			expect.objectContaining({
				currentTime: expect.any(Number),
				totalTime: expect.any(Number),
				formattedCurrentTime: expect.any(String),
				formattedTotalTime: expect.any(String),
			}),
		);
	});

	it("should not call onPauseAudio when playback starts", async () => {
		const user = userEvent.setup();
		const handlePause = vi.fn();
		render(<AudioPlayer src="/audio/episode.mp3" onPauseAudio={handlePause} />);

		await user.click(screen.getByRole("button"));

		expect(handlePause).not.toHaveBeenCalled();
	});

	it("should call onPauseAudio when playback is paused", async () => {
		const user = userEvent.setup();
		const handlePause = vi.fn();
		render(<AudioPlayer src="/audio/episode.mp3" onPauseAudio={handlePause} />);

		const button = screen.getByRole("button");
		await user.click(button);
		await user.click(button);

		expect(handlePause).toHaveBeenCalledTimes(1);
		expect(handlePause).toHaveBeenCalledWith(
			expect.objectContaining({
				currentTime: expect.any(Number),
				totalTime: expect.any(Number),
				formattedCurrentTime: expect.any(String),
				formattedTotalTime: expect.any(String),
			}),
		);
	});

	it("should not call onPlayAudio or onPauseAudio when omitted", async () => {
		const user = userEvent.setup();
		render(<AudioPlayer src="/audio/episode.mp3" />);

		await expect(user.click(screen.getByRole("button"))).resolves.not.toThrow();
	});

	it("should call onPauseAudio when the audio ends", () => {
		const handlePause = vi.fn();
		const { container } = render(
			<AudioPlayer src="/audio/episode.mp3" onPauseAudio={handlePause} />,
		);

		const audio = container.querySelector("audio") as HTMLAudioElement;
		fireEvent.ended(audio);

		expect(handlePause).toHaveBeenCalledTimes(1);
	});

	it("should switch the icon back to Play when the audio ends", async () => {
		const user = userEvent.setup();
		const { container } = render(<AudioPlayer src="/audio/episode.mp3" />);

		await user.click(screen.getByRole("button"));
		expect(container.querySelector(".lucide-pause")).toBeInTheDocument();

		const audio = container.querySelector("audio") as HTMLAudioElement;
		fireEvent.ended(audio);

		expect(container.querySelector(".lucide-play")).toBeInTheDocument();
	});

	it("should not be disabled by default", () => {
		render(<AudioPlayer src="/audio/episode.mp3" />);

		expect(screen.getByRole("button")).not.toBeDisabled();
	});

	it("should disable the toggle button when disabled is true", () => {
		render(<AudioPlayer src="/audio/episode.mp3" disabled />);

		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("should disable the Slider when disabled is true", () => {
		const { container } = render(
			<AudioPlayer src="/audio/episode.mp3" disabled />,
		);

		expect(container.querySelector(".arkynSliderTrack")).toHaveClass(
			"isDisabled",
		);
	});

	it("should keep the Slider enabled when disabled is false", () => {
		const { container } = render(
			<AudioPlayer src="/audio/episode.mp3" disabled={false} />,
		);

		expect(container.querySelector(".arkynSliderTrack")).toHaveClass(
			"isEnabled",
		);
	});

	it("should not call onPlayAudio when clicking a disabled button", async () => {
		const user = userEvent.setup();
		const handlePlay = vi.fn();
		render(
			<AudioPlayer
				src="/audio/episode.mp3"
				disabled
				onPlayAudio={handlePlay}
			/>,
		);

		await user.click(screen.getByRole("button"));

		expect(handlePlay).not.toHaveBeenCalled();
	});

	it("should apply an inline style to the root element", () => {
		const { container } = render(
			<AudioPlayer src="/audio/episode.mp3" style={{ marginTop: 10 }} />,
		);

		const root = container.querySelector(".arkynAudioPlayer") as HTMLElement;
		expect(root).toHaveStyle({ marginTop: "10px" });
	});

	it("should render without a style prop", () => {
		const { container } = render(<AudioPlayer src="/audio/episode.mp3" />);

		const root = container.querySelector(".arkynAudioPlayer") as HTMLElement;
		expect(root).toBeInTheDocument();
	});

	it("should spread additional native audio attributes onto the audio element", () => {
		const { container } = render(
			<AudioPlayer src="/audio/episode.mp3" loop preload="auto" />,
		);

		const audio = container.querySelector("audio") as HTMLAudioElement;
		expect(audio).toHaveAttribute("preload", "auto");
		expect(audio.loop).toBe(true);
	});

	it("should forward data attributes passed through rest props to the audio element", () => {
		const { container } = render(
			<AudioPlayer src="/audio/episode.mp3" data-testid="audio-element" />,
		);

		expect(screen.getByTestId("audio-element")).toBe(
			container.querySelector("audio"),
		);
	});

	it("should render with an empty string src without throwing", () => {
		const { container } = render(<AudioPlayer src="" />);

		const audio = container.querySelector("audio");
		expect(audio).toBeInTheDocument();
		expect(audio).not.toHaveAttribute("src");
	});

	it("should toggle play state multiple times consistently", async () => {
		const user = userEvent.setup();
		const handlePlay = vi.fn();
		const handlePause = vi.fn();
		render(
			<AudioPlayer
				src="/audio/episode.mp3"
				onPlayAudio={handlePlay}
				onPauseAudio={handlePause}
			/>,
		);

		const button = screen.getByRole("button");
		await user.click(button);
		await user.click(button);
		await user.click(button);

		expect(handlePlay).toHaveBeenCalledTimes(2);
		expect(handlePause).toHaveBeenCalledTimes(1);
	});

	it("should render as a button element of type button", () => {
		render(<AudioPlayer src="/audio/episode.mp3" />);

		expect(screen.getByRole("button")).toHaveAttribute("type", "button");
	});
});
