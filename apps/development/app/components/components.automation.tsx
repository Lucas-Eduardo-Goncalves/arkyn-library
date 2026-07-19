import { Button } from "@arkyn/components/button";
import { DrawerContainer } from "@arkyn/components/drawerContainer";
import { DrawerHeader } from "@arkyn/components/drawerHeader";
import { ModalContainer } from "@arkyn/components/modalContainer";
import { ModalFooter } from "@arkyn/components/modalFooter";
import { ModalHeader } from "@arkyn/components/modalHeader";
import { useAutomation } from "@arkyn/components/useAutomation";
import { useDrawer } from "@arkyn/components/useDrawer";
import { useModal } from "@arkyn/components/useModal";
import { useState } from "react";

type SaveResponse = {
	closeModal?: boolean;
	name: string;
	message: string;
};

function simulateSaveAction(shouldFail: boolean): Promise<SaveResponse> {
	return new Promise((resolve) => {
		setTimeout(() => {
			if (shouldFail) {
				resolve({ name: "BadRequest", message: "Não foi possível salvar." });
			} else {
				resolve({
					closeModal: true,
					name: "Success",
					message: "Registro salvo com sucesso!",
				});
			}
		}, 400);
	});
}

export default function AutomationRoute() {
	const { modalIsOpen, openModal, closeModal } = useModal("automation-modal");
	const { drawerIsOpen, openDrawer, closeDrawer } =
		useDrawer("automation-drawer");
	const [response, setResponse] = useState<SaveResponse | undefined>();
	const [isSaving, setIsSaving] = useState(false);

	// `useAutomation` only knows how to close modals (via `closeModal: true`).
	// Drawers are closed explicitly in the handlers below.
	useAutomation(response);

	async function handleModalSave(shouldFail: boolean) {
		setIsSaving(true);
		const result = await simulateSaveAction(shouldFail);
		setIsSaving(false);
		setResponse(result);
	}

	async function handleDrawerSave(shouldFail: boolean) {
		setIsSaving(true);
		const result = await simulateSaveAction(shouldFail);
		setIsSaving(false);
		if (!shouldFail) closeDrawer();
		setResponse(result);
	}

	return (
		<>
			<ModalContainer
				isVisible={modalIsOpen}
				makeInvisible={() => closeModal()}
			>
				<ModalHeader>Salvar registro (Modal)</ModalHeader>
				<main style={{ padding: "1rem" }}>
					<p>Simula uma server action ao clicar em salvar.</p>
				</main>
				<ModalFooter>
					<Button variant="ghost" onClick={() => closeModal()}>
						Cancelar
					</Button>
					<Button
						scheme="danger"
						isLoading={isSaving}
						onClick={() => handleModalSave(true)}
					>
						Salvar com erro
					</Button>
					<Button isLoading={isSaving} onClick={() => handleModalSave(false)}>
						Salvar
					</Button>
				</ModalFooter>
			</ModalContainer>

			<DrawerContainer
				isVisible={drawerIsOpen}
				makeInvisible={() => closeDrawer()}
				orientation="right"
			>
				<DrawerHeader>Salvar registro (Drawer)</DrawerHeader>
				<div
					style={{
						padding: "1rem",
						display: "flex",
						flexDirection: "column",
						gap: "0.5rem",
					}}
				>
					<p>Simula uma server action ao clicar em salvar.</p>
					<Button
						scheme="danger"
						isLoading={isSaving}
						onClick={() => handleDrawerSave(true)}
					>
						Salvar com erro
					</Button>
					<Button isLoading={isSaving} onClick={() => handleDrawerSave(false)}>
						Salvar
					</Button>
				</div>
			</DrawerContainer>

			<div className="exampleContainer row">
				<Button onClick={() => openModal()}>Abrir Modal</Button>
				<Button onClick={() => openDrawer()}>Abrir Drawer</Button>
			</div>
		</>
	);
}
