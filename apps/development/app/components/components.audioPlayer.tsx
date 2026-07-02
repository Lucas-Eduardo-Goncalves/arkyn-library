import { AudioPlayer } from "@arkyn/components/audioPlayer";

export default function AudioPlayerRoute() {
	return (
		<>
			<div className="exampleContainer row foreground">
				<AudioPlayer src="/sample-audio.mp3" />
			</div>

			<div className="exampleContainer row foreground">
				<AudioPlayer src="/sample-audio.mp3" disabled />
			</div>

			<div className="exampleContainer row">
				<AudioPlayer src="/sample-audio.mp3" />
			</div>
		</>
	);
}
