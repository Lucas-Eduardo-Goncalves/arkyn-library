import { Pause, Play } from "lucide-react";
import {
	type AudioHTMLAttributes,
	type JSX,
	useEffect,
	useRef,
	useState,
} from "react";

import { useSlider } from "../../hooks/useSlider";
import { Slider } from "../slider";
import "./styles.css";

/** Audio state snapshot passed to play/pause callbacks. */
type AudioInformationProps = {
	/** Current playback position in seconds. */
	currentTime: number;
	/** Total audio duration in seconds. */
	totalTime: number;
	/** Current position formatted as `MM:SS`. */
	formattedCurrentTime: string;
	/** Total duration formatted as `MM:SS`. */
	formattedTotalTime: string;
};

type AudioPlayerProps = Omit<
	AudioHTMLAttributes<HTMLAudioElement>,
	"onEnded" | "src"
> & {
	/** Audio file URL. Required. */
	src: string;
	/** Disables the play/pause button and the progress slider. @default false */
	disabled?: boolean;
	/** Callback fired when playback starts. Receives the current audio state. */
	onPlayAudio?: (props: AudioInformationProps) => void;
	/** Callback fired when playback is paused. Receives the current audio state. */
	onPauseAudio?: (props: AudioInformationProps) => void;
};

/**
 * AudioPlayer — play/pause controls, a scrubable progress bar, and elapsed/total time display.
 *
 * @param props.src - Audio file URL. Required.
 * @param props.disabled - Disables controls. Default: false
 * @param props.onPlayAudio - Callback fired when playback starts.
 * @param props.onPauseAudio - Callback fired when playback is paused.
 *
 * **...Other valid HTML properties for `<audio>` (except `onEnded` and `src`)**
 *
 * @returns AudioPlayer JSX element.
 *
 * @example
 * ```tsx
 * // Basic
 * <AudioPlayer src="/audio/episode.mp3" />
 *
 * // With play/pause callbacks
 * <AudioPlayer
 *   src="/audio/episode.mp3"
 *   onPlayAudio={(info) => console.log("Playing at", info.formattedCurrentTime)}
 *   onPauseAudio={(info) => console.log("Paused at", info.formattedCurrentTime)}
 * />
 * ```
 */
function AudioPlayer(props: AudioPlayerProps): JSX.Element {
	const { onPlayAudio, onPauseAudio, disabled, style, ...rest } = props;

	const [sliderValue, setSliderValue] = useSlider(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const audioReference = useRef<HTMLAudioElement>(null);

	const currentTime = audioReference.current?.currentTime || 0;
	const totalTime = audioReference.current?.duration || 0;

	const formattedCurrentTime = formatTime(currentTime);
	const formattedTotalTime = formatTime(totalTime);

	const audioInformation: AudioInformationProps = {
		totalTime,
		currentTime,
		formattedCurrentTime,
		formattedTotalTime,
	};

	function formatTime(time?: number): string {
		if (!time) return "00:00";

		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);

		const formattedMinutes = String(minutes).padStart(2, "0");
		const formattedSeconds = String(seconds).padStart(2, "0");

		return `${formattedMinutes}:${formattedSeconds}`;
	}

	function handlePlayAudio(): void {
		const audioElement = audioReference.current;
		if (!audioElement) return;
		if (props.onPlayAudio) props.onPlayAudio(audioInformation);
		audioElement.play();
		setIsPlaying(true);
	}

	function handlePauseAudio(): void {
		const audioElement = audioReference.current;
		if (!audioElement) return;
		if (props.onPauseAudio) props.onPauseAudio(audioInformation);
		audioElement.pause();
		setIsPlaying(false);
	}

	function handleToggleAudio(): void {
		if (isPlaying) handlePauseAudio();
		else handlePlayAudio();
	}

	function handleSliderChange(value: number): void {
		const audioElement = audioReference.current;
		if (!audioElement) return;

		const totalTime = audioElement.duration;
		const currentTime = (value / 100) * totalTime;

		audioElement.currentTime = currentTime;
	}

	if (isDragging || !isPlaying) {
		audioReference.current?.pause();
	} else if (isPlaying) {
		audioReference.current?.play();
	}

	useEffect(() => {
		const audioElement = audioReference.current;
		if (!audioElement) return;

		const handleTimeUpdate = () => {
			const totalTime = audioElement.duration;
			const currentTime = audioElement.currentTime;

			const value = (currentTime / totalTime) * 100;
			setSliderValue(value);
		};

		audioElement.addEventListener("timeupdate", handleTimeUpdate);

		return () => {
			audioElement.removeEventListener("timeupdate", handleTimeUpdate);
		};
	}, [setSliderValue]);

	return (
		<div className="arkynAudioPlayer" style={style}>
			<audio
				{...rest}
				ref={audioReference}
				src={props.src || undefined}
				onEnded={handlePauseAudio}
			/>

			<button type="button" disabled={disabled} onClick={handleToggleAudio}>
				{isPlaying && <Pause />}
				{!isPlaying && <Play />}
			</button>

			<p>{formattedCurrentTime}</p>

			<Slider
				value={sliderValue}
				onChange={handleSliderChange}
				onDragging={setIsDragging}
				disabled={disabled}
			/>

			<p>{formattedTotalTime}</p>
		</div>
	);
}

export { AudioPlayer };
