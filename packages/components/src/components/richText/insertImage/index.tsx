import { Image } from "lucide-react";
import { type MouseEvent, useState } from "react";
import { useSlate } from "slate-react";

import type { RichTextInsertImageProps } from "../../../types/richTextTypes";

import { Button } from "../../button";
import { ImageUpload } from "../../imageUpload";
import { Input } from "../../input";
import { ModalContainer } from "../../modal/modalContainer";
import { ModalFooter } from "../../modal/modalFooter";
import { ModalHeader } from "../../modal/modalHeader";
import { TabButton } from "../../tab/tabButton";
import { TabContainer } from "../../tab/tabContainer";

import "./styles.css";

function InsertImage(props: RichTextInsertImageProps) {
	const {
		action,
		tabLabels = ["Adicionar URL", "Upload de arquivo"],
		modalCancelButton = "Cancelar",
		modalConfirmButton = "Confirmar",
		modalInputImageLabel = "Imagem:",
		modalInputUrlLabel = "URL da imagem:",
		modalTitle = "Inserir imagem",
	} = props;

	const editor = useSlate();

	const [modalIsVisible, setModalIsVisible] = useState(false);
	const [imageURL, setImageURL] = useState("");
	const [uploadType, setUploadType] = useState("url");

	function handleMouseDown(event: MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		if (!imageURL || imageURL === "") return;

		editor.insertNodes([
			{ type: "paragraph", children: [{ text: "" }] },
			{ type: "image", src: imageURL, children: [{ text: "" }] },
			{ type: "paragraph", children: [{ text: "" }] },
		]);

		setModalIsVisible(false);
	}

	return (
		<>
			<button
				type="button"
				className="arkynRichTextInsertImage"
				onMouseDown={() => setModalIsVisible(true)}
			>
				<Image />
			</button>

			<ModalContainer
				isVisible={modalIsVisible}
				makeInvisible={() => setModalIsVisible(false)}
			>
				<ModalHeader>{modalTitle}</ModalHeader>

				<div className="arkynRichTextInsertImageModalContent">
					<TabContainer defaultValue={uploadType} onChange={setUploadType}>
						<TabButton value="url">{tabLabels[0]}</TabButton>
						<TabButton value="file">{tabLabels[1]}</TabButton>
					</TabContainer>

					{uploadType === "url" && (
						<>
							<Input
								type="text"
								name="richTextImageURL"
								label={modalInputUrlLabel}
								showAsterisk
								defaultValue={imageURL}
								onChange={(e) => setImageURL(e.target.value)}
							/>

							{imageURL && (
								<img
									className="arkynRichTextInsertImageModalPreviewImage"
									src={imageURL}
									alt="preview"
								/>
							)}
						</>
					)}

					{uploadType === "file" && (
						<ImageUpload
							name="richTextImageURL"
							action={action}
							label={modalInputImageLabel}
							showAsterisk
							defaultValue={imageURL}
							onChange={(url) => setImageURL(url)}
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

					<Button type="button" onClick={handleMouseDown}>
						{modalConfirmButton}
					</Button>
				</ModalFooter>
			</ModalContainer>
		</>
	);
}

export { InsertImage };
