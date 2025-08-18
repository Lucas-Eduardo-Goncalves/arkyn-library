import { useSlider } from "@components";
import { Pause, Play } from "lucide-react";
import { AudioHTMLAttributes, useEffect, useRef, useState } from "react";

import { Slider } from "../slider";
import "./styles.css";

type AudioInformationProps = {
  currentTime: number;
  totalTime: number;
  formattedCurrentTime: string;
  formattedTotalTime: string;
};

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
 * AudioPlayer component - used to play audio files with playback controls
 *
 * @param props - AudioPlayer component properties
 * @param props.src - Audio source URL (required)
 * @param props.disabled - Whether the audio player is disabled. Default: false
 * @param props.onPlayAudio - Callback function called when audio starts playing
 * @param props.onPauseAudio - Callback function called when audio is paused
 *
 * **...Other valid HTML audio properties**
 *
 * @returns AudioPlayer JSX element
 *
 * @example
 * ```tsx
 * // Basic audio player
 * <AudioPlayer src="/audio/sample.mp3" />
 *
 * // Audio player with callbacks
 * <AudioPlayer
 *   src="/audio/sample.mp3"
 *   onPlayAudio={(info) => console.log('Playing:', info)}
 *   onPauseAudio={(info) => console.log('Paused:', info)}
 * />
 *
 * // Disabled audio player
 * <AudioPlayer
 *   src="/audio/sample.mp3"
 *   disabled
 * />
 *
 * // Audio player with additional HTML audio attributes
 * <AudioPlayer
 *   src="/audio/sample.mp3"
 *   loop
 *   preload="metadata"
 *   onPlayAudio={(info) => {
 *     console.log(`Current: ${info.formattedCurrentTime}`);
 *     console.log(`Total: ${info.formattedTotalTime}`);
 *   }}
 * />
 * ```
 */

function AudioPlayer(props: AudioPlayerProps) {
  const { onPlayAudio, onPauseAudio, disabled, ...rest } = props;

  const [sliderValue, setSliderValue] = useSlider(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const audioReference = useRef<HTMLAudioElement>(null);

  const currentTime = audioReference.current?.currentTime;
  const totalTime = audioReference.current?.duration;

  const formattedCurrentTime = formatTime(currentTime);
  const formattedTotalTime = formatTime(totalTime);

  const audioInformation: AudioInformationProps = {
    totalTime,
    currentTime,
    formattedCurrentTime,
    formattedTotalTime,
  };

  function formatTime(time?: number) {
    if (!time) return "00:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  function handlePlayAudio() {
    const audioElement = audioReference.current;
    if (!audioElement) return;
    if (props.onPlayAudio) props.onPlayAudio(audioInformation);
    audioElement.play();
    setIsPlaying(true);
  }

  function handlePauseAudio() {
    const audioElement = audioReference.current;
    if (!audioElement) return;
    if (props.onPauseAudio) props.onPauseAudio(audioInformation);
    audioElement.pause();
    setIsPlaying(false);
  }

  function handleToggleAudio() {
    if (isPlaying) handlePauseAudio();
    else handlePlayAudio();
  }

  function handleSliderChange(value: number) {
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
