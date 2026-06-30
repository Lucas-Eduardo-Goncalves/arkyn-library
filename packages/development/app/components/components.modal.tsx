import { ModalContainer } from "@arkyn/components/modalContainer";
import { ModalFooter } from "@arkyn/components/modalFooter";
import { ModalHeader } from "@arkyn/components/modalHeader";
import { Button } from "@arkyn/components/button";
import { useState } from "react";

export default function ModalRoute() {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [isWizardOpen, setIsWizardOpen] = useState(false);
	const [isAlertOpen, setIsAlertOpen] = useState(false);

	return (
		<>
			<ModalContainer
				isVisible={isConfirmOpen}
				makeInvisible={() => setIsConfirmOpen(false)}
			>
				<ModalHeader>
					<h2>Confirmar exclusão</h2>
				</ModalHeader>
				<main style={{ padding: "1rem" }}>
					<p>Esta ação não pode ser desfeita. Deseja continuar?</p>
				</main>
				<ModalFooter>
					<Button variant="ghost" onClick={() => setIsConfirmOpen(false)}>
						Cancelar
					</Button>
					<Button scheme="danger" onClick={() => setIsConfirmOpen(false)}>
						Excluir
					</Button>
				</ModalFooter>
			</ModalContainer>

			<ModalContainer
				isVisible={isWizardOpen}
				makeInvisible={() => setIsWizardOpen(false)}
			>
				<ModalHeader showCloseButton={false}>
					<h2>Passo 1 de 3</h2>
				</ModalHeader>
				<main style={{ padding: "1rem" }}>
					<p>Conteúdo do passo atual do wizard.</p>
				</main>
				<ModalFooter alignment="between">
					<Button variant="outline" onClick={() => setIsWizardOpen(false)}>
						Voltar
					</Button>
					<Button onClick={() => setIsWizardOpen(false)}>Próximo</Button>
				</ModalFooter>
			</ModalContainer>

			<ModalContainer
				isVisible={isAlertOpen}
				makeInvisible={() => setIsAlertOpen(false)}
			>
				<ModalHeader>
					<h2>Informação</h2>
				</ModalHeader>
				<main style={{ padding: "1rem" }}>
					<p>Operação concluída com sucesso.</p>
				</main>
				<ModalFooter alignment="center">
					<Button onClick={() => setIsAlertOpen(false)}>OK</Button>
				</ModalFooter>
			</ModalContainer>

			<div className="exampleContainer row">
				<Button onClick={() => setIsConfirmOpen(true)}>Confirm Modal</Button>
				<Button onClick={() => setIsWizardOpen(true)}>Wizard Modal</Button>
				<Button onClick={() => setIsAlertOpen(true)}>Alert Modal</Button>
			</div>
		</>
	);
}
