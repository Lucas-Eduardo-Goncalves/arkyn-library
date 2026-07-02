import { AudioUpload } from "@arkyn/components/audioUpload";

export default function AudioUploadRoute() {
	return (
		<>
			<div className="exampleContainer row foreground">
				<AudioUpload
					name="audio1"
					action="/api/upload"
					label="Audio File:"
					showAsterisk
				/>
				<AudioUpload name="audio2" action="/api/upload" />
			</div>

			<div className="exampleContainer row foreground">
				<AudioUpload
					name="audio3"
					action="/api/upload"
					disabled
					label="Disabled:"
				/>
				<AudioUpload
					name="audio4"
					action="/api/upload"
					label="Custom texts:"
					selectAudioButtonText="Choose audio"
					dropAudioText="Or drag and drop here"
				/>
			</div>

			<div className="exampleContainer row">
				<AudioUpload name="audio5" action="/api/upload" label="Audio File:" />
			</div>
		</>
	);
}
