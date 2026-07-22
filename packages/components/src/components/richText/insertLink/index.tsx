import { Link } from "lucide-react";
import { type MouseEvent, useEffect, useState } from "react";
import { Editor, Range, Transforms } from "slate";
import { useSlate } from "slate-react";

import { isValidHttpsUrl } from "../../../services/isValidHttpsUrl";
import type { RichTextInsertLinkProps } from "../../../types/richTextTypes";

import { Button } from "../../button";
import { Input } from "../../input";
import { ModalContainer } from "../../modal/modalContainer";
import { ModalFooter } from "../../modal/modalFooter";
import { ModalHeader } from "../../modal/modalHeader";

import "./styles.css";

function InsertLink(props: RichTextInsertLinkProps) {
	const {
		modalCancelButton = "Cancelar",
		modalConfirmButton = "Confirmar",
		modalInputUrlLabel = "URL do link:",
		modalTitle = "Inserir link",
		invalidUrlMessage = "URL inválida",
	} = props;

	const editor = useSlate();

	const [modalIsVisible, setModalIsVisible] = useState(false);
	const [linkURL, setLinkURL] = useState("");
	const [selection, setSelection] = useState(editor.selection);

	const isValidUrl = isValidHttpsUrl(linkURL);
	const errorMessage = linkURL && !isValidUrl ? invalidUrlMessage : "";

	function handleOpenModal(event: MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		setSelection(editor.selection);
		setModalIsVisible(true);
	}

	function handleConfirm(event: MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		if (!isValidUrl || !selection) return;

		Transforms.select(editor, selection);

		if (Range.isCollapsed(selection)) {
			Transforms.insertNodes(editor, {
				text: linkURL,
				link: true,
				href: linkURL,
			});
		} else {
			Editor.addMark(editor, "link", true);
			Editor.addMark(editor, "href", linkURL);
		}

		setModalIsVisible(false);
	}

	useEffect(() => {
		if (!modalIsVisible) {
			setLinkURL("");
			setSelection(null);
		}
	}, [modalIsVisible]);

	return (
		<>
			<button
				type="button"
				className="arkynRichTextInsertLink"
				onMouseDown={handleOpenModal}
			>
				<Link />
			</button>

			<ModalContainer
				isVisible={modalIsVisible}
				makeInvisible={() => setModalIsVisible(false)}
			>
				<ModalHeader>{modalTitle}</ModalHeader>

				<div className="arkynRichTextInsertLinkModalContent">
					<Input
						type="text"
						name="richTextLinkURL"
						label={modalInputUrlLabel}
						showAsterisk
						defaultValue={linkURL}
						onChange={(e) => setLinkURL(e.target.value)}
						errorMessage={errorMessage}
					/>
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

					<Button disabled={!isValidUrl} type="button" onClick={handleConfirm}>
						{modalConfirmButton}
					</Button>
				</ModalFooter>
			</ModalContainer>
		</>
	);
}

export { InsertLink };
