import { Pause, Play } from "lucide-react";
import { AudioHTMLAttributes, JSX, useEffect, useRef, useState } from "react";

import { useSlider } from "../../hooks/useSlider";
import { Slider } from "../slider";
import "./styles.css";

/**
 * @typedef {Object} AudioInformationProps
 * @property {number} currentTime - Current playback time in seconds
 * @property {number} totalTime - Total duration of the audio in seconds
 * @property {string} formattedCurrentTime - Formatted current time as MM:SS
 * @property {string} formattedTotalTime - Formatted total time as MM:SS
 */
type AudioInformationProps = {
  currentTime: number;
  totalTime: number;
  formattedCurrentTime: string;
  formattedTotalTime: string;
};

/**
 * @typedef {Object} AudioPlayerProps
 * @property {string} src - Audio source URL (required)
 * @property {boolean} [disabled] - Whether the audio player controls are disabled
 * @property {function(AudioInformationProps): void} [onPlayAudio] - Callback fired when audio starts playing
 * @property {function(AudioInformationProps): void} [onPauseAudio] - Callback fired when audio is paused
 */
type AudioPlayerProps = Omit<
  AudioHTMLAttributes<HTMLAudioElement>,
  "onEnded" | "src"
> & {
  src: string;
  disabled?: boolean;
  onPlayAudio?: (props: AudioInformationProps) => void;
  onPauseAudio?: (props: AudioInformationProps) => void;
};

/**
 * AudioPlayer component
 *
 * A customizable audio player with play/pause controls, progress slider, and time display.
 * Provides callbacks for play and pause events with detailed audio information.
 *
 * @component
 *
 * @param {AudioPlayerProps} props - The component props
 *
 * @returns {JSX.Element} The rendered audio player component
 *
 * @requires lucide-react - For Play and Pause icons
 * @requires useSlider - For slider state management
 * @requires slider - For the progress slider component
 *
 * @example
 * // Basic usage
 * <AudioPlayer src="https://example.com/audio.mp3" />
 *
 * @example
 * // With callbacks
 * <AudioPlayer
 *   src="https://example.com/audio.mp3"
 *   onPlayAudio={(info) => console.log('Playing:', info.formattedCurrentTime)}
 *   onPauseAudio={(info) => console.log('Paused at:', info.formattedCurrentTime)}
 * />
 */
function AudioPlayer(props: AudioPlayerProps): JSX.Element {
  const { onPlayAudio, onPauseAudio, disabled, ...rest } = props;

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
  }, []);

  return (
    <div className="arkynAudioPlayer">
      <audio
        {...rest}
        ref={audioReference}
        src={props.src}
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
