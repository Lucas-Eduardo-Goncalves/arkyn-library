import { Video } from "lucide-react";
import { type MouseEvent, useEffect, useState } from "react";
import { useSlate } from "slate-react";

import type { RichTextInsertVideoProps } from "../../../types/richTextTypes";

import { Button } from "../../button";
import { Input } from "../../input";
import { ModalContainer } from "../../modal/modalContainer";
import { ModalFooter } from "../../modal/modalFooter";
import { ModalHeader } from "../../modal/modalHeader";

import "./styles.css";

function InsertVideo(props: RichTextInsertVideoProps) {
	const {
		modalCancelButton = "Cancelar",
		modalConfirmButton = "Confirmar",
		modalInputUrlLabel = "URL do vídeo:",
		modalTitle = "Inserir vídeo",
		invalidUrlMessage = "URL inválida",
	} = props;

	const editor = useSlate();

	const [modalIsVisible, setModalIsVisible] = useState(false);
	const [videoId, setVideoId] = useState("");
	const [videoRawURL, setVideoRawURL] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	function handleMouseDown(event: MouseEvent<HTMLButtonElement>) {
		event.preventDefault();

		if (!videoId || videoId === "") return;
		const videoUrl = `https://www.youtube.com/embed/${videoId}`;

		editor.insertNodes([
			{ type: "paragraph", children: [{ text: "" }] },
			{ type: "video", src: videoUrl, children: [{ text: "" }] },
			{ type: "paragraph", children: [{ text: "" }] },
		]);

		setModalIsVisible(false);
	}

	useEffect(() => {
		if (!videoRawURL || videoRawURL === "") return;

		setVideoId("");
		setErrorMessage("");

		const searchParams = new URLSearchParams(videoRawURL.split("?")[1]);
		const vParam = searchParams.get("v");
		if (vParam) setVideoId(vParam);
		else setErrorMessage(invalidUrlMessage);
	}, [videoRawURL, invalidUrlMessage]);

	useEffect(() => {
		if (!modalIsVisible) {
			setVideoId("");
			setVideoRawURL("");
			setErrorMessage("");
		}
	}, [modalIsVisible]);

	return (
		<>
			<button
				type="button"
				className="arkynRichTextInsertVideo"
				onMouseDown={() => setModalIsVisible(true)}
			>
				<Video />
			</button>

			<ModalContainer
				isVisible={modalIsVisible}
				makeInvisible={() => setModalIsVisible(false)}
			>
				<ModalHeader>{modalTitle}</ModalHeader>

				<div className="arkynRichTextInsertVideoModalContent">
					<Input
						type="text"
						name="richTextVideoURL"
						label={modalInputUrlLabel}
						showAsterisk
						defaultValue={videoRawURL}
						onChange={(e) => setVideoRawURL(e.target.value)}
						errorMessage={errorMessage}
					/>

					{videoId && (
						<iframe
							width="auto"
							height="315"
							src={`https://www.youtube.com/embed/${videoId}`}
							title="YouTube video player"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							referrerPolicy="strict-origin-when-cross-origin"
							allowFullScreen
						/>
					)}
				</div>

				<ModalFooter>
					<Button
						type="button"
						scheme="danger"
						variant="outline"
						onClick={() => setModalIsVisible(false)}
					>
						{modalCancelButton}
					</Button>

					<Button disabled={!videoId} type="button" onClick={handleMouseDown}>
						{modalConfirmButton}
					</Button>
				</ModalFooter>
			</ModalContainer>
		</>
	);
}

export { InsertVideo };
