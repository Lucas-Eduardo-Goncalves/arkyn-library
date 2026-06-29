import type { DragEvent } from "react";

import { Button } from "../../button";
import "./styles.css";

type NoFileContentProps = {
	disabled: boolean;
	acceptAudio: string;
	isLoading: boolean;
	selectAudioButtonText: string;
	dropAudioText: string;
	handleSelectFile: (file: File) => void;
};

function NoFileContent(props: NoFileContentProps) {
	const {
		dropAudioText,
		isLoading,
		acceptAudio,
		handleSelectFile,
		selectAudioButtonText,
		disabled,
	} = props;

	function handleDrop(event: DragEvent<HTMLDivElement>) {
		if (disabled) return;

		event.preventDefault();
		const file = event.dataTransfer.files[0];
		if (file) handleSelectFile(file);
	}

	function handleClick() {
		if (disabled) return;

		const input = document.createElement("input");

		input.type = "file";
		input.accept = acceptAudio;

		input.onchange = (event) => {
			const file = (event.target as HTMLInputElement).files?.[0];
			if (file) handleSelectFile(file);
		};

		input.click();
	}

	return (
		<div onDrop={handleDrop} className="arkynAudioUploadNoFileContent">
			<Button
				isLoading={isLoading}
				onClick={handleClick}
				variant="ghost"
				size="sm"
				type="button"
				disabled={disabled}
			>
				{selectAudioButtonText}
			</Button>

			<p>{dropAudioText}</p>
		</div>
	);
}

export { NoFileContent };
