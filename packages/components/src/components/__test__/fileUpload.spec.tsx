import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FormProvider } from "../../../providers/formProvider";
import { FileUpload } from "../index";

const originalCreateElement = document.createElement.bind(document);

function mockFilePicker(file: File | null) {
	vi.spyOn(document, "createElement").mockImplementation((tagName) => {
		const element = originalCreateElement(tagName);

		if (tagName === "input") {
			vi.spyOn(element as HTMLInputElement, "click").mockImplementation(() => {
				Object.defineProperty(element, "files", {
					value: file ? [file] : [],
					configurable: true,
				});
				element.dispatchEvent(new Event("change"));
			});
		}

		return element;
	});
}

function createFile(name = "document.pdf", type = "application/pdf") {
	return new File(["file-content"], name, { type });
}

async function selectFile(buttonName: string | RegExp, file: File | null) {
	mockFilePicker(file);
	const user = userEvent.setup();
	await user.click(screen.getByRole("button", { name: buttonName }));
}

function dropFile(container: HTMLElement, file: File | null) {
	const dropZone = container.querySelector(
		".arkynFileUploadNoFileContent",
	) as HTMLElement;

	fireEvent.drop(dropZone, {
		dataTransfer: { files: file ? [file] : [] },
	});
}

describe("FileUpload", () => {
	beforeEach(() => {
		global.fetch = vi.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve({ url: "https://cdn.test/document.pdf" }),
			} as Response),
		);
	});

	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
	});

	it("should render without errors", () => {
		const { container } = render(
			<FileUpload name="document" action="/upload" />,
		);

		expect(container).toBeInTheDocument();
	});

	it("should render the default drop text and select button", () => {
		render(<FileUpload name="document" action="/upload" />);

		expect(
			screen.getByText("Ou arraste e solte o arquivo aqui"),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Selecionar arquivo" }),
		).toBeInTheDocument();
	});

	it("should render without a label when label is omitted", () => {
		render(<FileUpload name="document" action="/upload" />);

		expect(document.querySelector("label")).not.toBeInTheDocument();
	});

	it("should render the label when provided", () => {
		render(
			<FileUpload name="document" action="/upload" label="Document field" />,
		);

		expect(screen.getByText("Document field")).toBeInTheDocument();
	});

	it("should not append an asterisk to the label by default", () => {
		render(
			<FileUpload name="document" action="/upload" label="Document field" />,
		);

		const label = screen.getByText("Document field").closest("label");
		expect(label).toHaveClass("asteriskFalse");
	});

	it("should append an asterisk to the label when showAsterisk is true", () => {
		render(
			<FileUpload
				name="document"
				action="/upload"
				label="Document field"
				showAsterisk
			/>,
		);

		const label = screen.getByText("Document field").closest("label");
		expect(label).toHaveClass("asteriskTrue");
	});

	it("should render a hidden input with the given name", () => {
		const { container } = render(
			<FileUpload name="myDocument" action="/upload" />,
		);

		const hiddenInput = container.querySelector(
			'input[type="hidden"]',
		) as HTMLInputElement;

		expect(hiddenInput).toBeInTheDocument();
		expect(hiddenInput).toHaveAttribute("name", "myDocument");
	});

	it("should render an empty hidden input value by default", () => {
		const { container } = render(
			<FileUpload name="document" action="/upload" />,
		);

		const hiddenInput = container.querySelector(
			'input[type="hidden"]',
		) as HTMLInputElement;

		expect(hiddenInput).toHaveValue("");
	});

	it("should use the base class along with noHasFile and noHasError by default", () => {
		const { container } = render(
			<FileUpload name="document" action="/upload" />,
		);

		const wrapper = container.querySelector(".arkynFileUpload");
		expect(wrapper).toHaveClass("arkynFileUpload");
		expect(wrapper).toHaveClass("noHasError");
		expect(wrapper).toHaveClass("noHasFile");
	});

	it("should apply the hasFile class once a file has been selected", async () => {
		const { container } = render(
			<FileUpload name="document" action="/upload" />,
		);

		await selectFile("Selecionar arquivo", createFile());

		const wrapper = container.querySelector(".arkynFileUpload");
		await waitFor(() => expect(wrapper).toHaveClass("hasFile"));
		expect(wrapper).not.toHaveClass("noHasFile");
	});

	it("should render the file name once a file has been selected", async () => {
		render(<FileUpload name="document" action="/upload" />);

		await selectFile("Selecionar arquivo", createFile("report.pdf"));

		await waitFor(() =>
			expect(screen.getByText("report.pdf")).toBeInTheDocument(),
		);
	});

	it("should upload the selected file via fetch with multipart form data", async () => {
		render(<FileUpload name="document" action="/api/upload" />);

		const file = createFile();
		await selectFile("Selecionar arquivo", file);

		await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

		const [url, options] = (global.fetch as ReturnType<typeof vi.fn>).mock
			.calls[0];
		expect(url).toBe("/api/upload");
		expect(options.method).toBe("POST");
		expect(options.body).toBeInstanceOf(FormData);
		expect((options.body as FormData).get("file")).toBe(file);
	});

	it("should use the custom fileName for the form-data field", async () => {
		render(
			<FileUpload name="document" action="/api/upload" fileName="docFile" />,
		);

		const file = createFile();
		await selectFile("Selecionar arquivo", file);

		await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

		const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock
			.calls[0];
		expect((options.body as FormData).get("docFile")).toBe(file);
	});

	it("should use a custom HTTP method when provided", async () => {
		render(<FileUpload name="document" action="/api/upload" method="PUT" />);

		const file = createFile();
		await selectFile("Selecionar arquivo", file);

		await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

		const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock
			.calls[0];
		expect(options.method).toBe("PUT");
	});

	it("should call onChange with the response url using the default fileResponseName", async () => {
		const handleChange = vi.fn();
		render(
			<FileUpload
				name="document"
				action="/api/upload"
				onChange={handleChange}
			/>,
		);

		const file = createFile();
		await selectFile("Selecionar arquivo", file);

		await waitFor(() =>
			expect(handleChange).toHaveBeenCalledWith(
				"https://cdn.test/document.pdf",
			),
		);
		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	it("should read the url from a custom fileResponseName", async () => {
		global.fetch = vi.fn(() =>
			Promise.resolve({
				json: () =>
					Promise.resolve({ documentUrl: "https://cdn.test/custom.pdf" }),
			} as Response),
		);

		const handleChange = vi.fn();
		render(
			<FileUpload
				name="document"
				action="/api/upload"
				fileResponseName="documentUrl"
				onChange={handleChange}
			/>,
		);

		const file = createFile();
		await selectFile("Selecionar arquivo", file);

		await waitFor(() =>
			expect(handleChange).toHaveBeenCalledWith("https://cdn.test/custom.pdf"),
		);
	});

	it("should update the hidden input value after a successful upload", async () => {
		const { container } = render(
			<FileUpload name="document" action="/api/upload" />,
		);

		const file = createFile();
		await selectFile("Selecionar arquivo", file);

		const hiddenInput = container.querySelector(
			'input[type="hidden"]',
		) as HTMLInputElement;

		await waitFor(() =>
			expect(hiddenInput).toHaveValue("https://cdn.test/document.pdf"),
		);
	});

	it("should display the error message returned by the server", async () => {
		global.fetch = vi.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve({ error: "Arquivo muito grande" }),
			} as Response),
		);

		render(<FileUpload name="document" action="/api/upload" />);

		const file = createFile();
		await selectFile("Selecionar arquivo", file);

		await waitFor(() =>
			expect(screen.getByText("Arquivo muito grande")).toBeInTheDocument(),
		);
	});

	it("should call onChange with undefined when the server responds with an error", async () => {
		global.fetch = vi.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve({ error: "Falhou" }),
			} as Response),
		);

		const handleChange = vi.fn();
		render(
			<FileUpload
				name="document"
				action="/api/upload"
				onChange={handleChange}
			/>,
		);

		const file = createFile();
		await selectFile("Selecionar arquivo", file);

		await waitFor(() => expect(screen.getByText("Falhou")).toBeInTheDocument());
		expect(handleChange).toHaveBeenCalledTimes(1);
		expect(handleChange).toHaveBeenCalledWith(undefined);
	});

	it("should display a generic error message when the upload request rejects", async () => {
		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});
		global.fetch = vi.fn(() => Promise.reject(new Error("network down")));

		render(<FileUpload name="document" action="/api/upload" />);

		const file = createFile();
		await selectFile("Selecionar arquivo", file);

		await waitFor(() =>
			expect(screen.getByText("Erro ao enviar o arquivo")).toBeInTheDocument(),
		);

		consoleErrorSpy.mockRestore();
	});

	it("should render a resend button when an upload fails and allow retrying", async () => {
		global.fetch = vi
			.fn()
			.mockResolvedValueOnce({
				json: () => Promise.resolve({ error: "Falhou" }),
			})
			.mockResolvedValueOnce({
				json: () => Promise.resolve({ url: "https://cdn.test/retry.pdf" }),
			});

		render(<FileUpload name="document" action="/api/upload" />);

		const file = createFile();
		await selectFile("Selecionar arquivo", file);

		await waitFor(() => expect(screen.getByText("Falhou")).toBeInTheDocument());

		const resendButton = screen.getByRole("button", { name: "resend file" });
		expect(resendButton).toBeInTheDocument();

		const user = userEvent.setup();
		await user.click(resendButton);

		await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
		await waitFor(() =>
			expect(screen.queryByText("Falhou")).not.toBeInTheDocument(),
		);
	});

	it("should not render a resend button while there is no error", async () => {
		render(<FileUpload name="document" action="/api/upload" />);

		const file = createFile();
		await selectFile("Selecionar arquivo", file);

		await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
		expect(
			screen.queryByRole("button", { name: "resend file" }),
		).not.toBeInTheDocument();
	});

	it("should allow changing the file after one has already been selected", async () => {
		render(<FileUpload name="document" action="/api/upload" />);

		const firstFile = createFile("first.pdf");
		await selectFile("Selecionar arquivo", firstFile);

		await waitFor(() =>
			expect(
				screen.getByRole("button", { name: "Alterar arquivo" }),
			).toBeInTheDocument(),
		);

		const secondFile = createFile("second.pdf");
		await selectFile("Alterar arquivo", secondFile);

		await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
		await waitFor(() =>
			expect(screen.getByText("second.pdf")).toBeInTheDocument(),
		);
	});

	it("should use custom dropFileText, selectFileButtonText and changeFileButtonText", async () => {
		render(
			<FileUpload
				name="document"
				action="/api/upload"
				dropFileText="Solte o arquivo"
				selectFileButtonText="Escolher arquivo"
				changeFileButtonText="Alterar documento"
			/>,
		);

		expect(screen.getByText("Solte o arquivo")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Escolher arquivo" }),
		).toBeInTheDocument();

		await selectFile("Escolher arquivo", createFile());

		await waitFor(() =>
			expect(
				screen.getByRole("button", { name: "Alterar documento" }),
			).toBeInTheDocument(),
		);
	});

	it("should pass the acceptFile prop down to the native file input", () => {
		let capturedInput: HTMLInputElement | undefined;

		vi.spyOn(document, "createElement").mockImplementation((tagName) => {
			const element = originalCreateElement(tagName);
			if (tagName === "input") capturedInput = element as HTMLInputElement;
			return element;
		});

		render(
			<FileUpload name="document" action="/api/upload" acceptFile=".pdf" />,
		);

		screen.getByRole("button", { name: "Selecionar arquivo" }).click();

		expect(capturedInput?.accept).toBe(".pdf");
	});

	it("should default acceptFile to '*' when omitted", () => {
		let capturedInput: HTMLInputElement | undefined;

		vi.spyOn(document, "createElement").mockImplementation((tagName) => {
			const element = originalCreateElement(tagName);
			if (tagName === "input") capturedInput = element as HTMLInputElement;
			return element;
		});

		render(<FileUpload name="document" action="/api/upload" />);

		screen.getByRole("button", { name: "Selecionar arquivo" }).click();

		expect(capturedInput?.accept).toBe("*");
	});

	it("should select a file via drag and drop on the drop zone", async () => {
		const { container } = render(
			<FileUpload name="document" action="/api/upload" />,
		);

		dropFile(container, createFile("dropped.pdf"));

		await waitFor(() =>
			expect(screen.getByText("dropped.pdf")).toBeInTheDocument(),
		);
		await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
	});

	it("should ignore a drop event with no files", () => {
		const { container } = render(
			<FileUpload name="document" action="/api/upload" />,
		);

		dropFile(container, null);

		expect(global.fetch).not.toHaveBeenCalled();
		expect(
			screen.getByText("Ou arraste e solte o arquivo aqui"),
		).toBeInTheDocument();
	});

	it("should not select a file via drag and drop when disabled", () => {
		const { container } = render(
			<FileUpload name="document" action="/api/upload" disabled />,
		);

		dropFile(container, createFile());

		expect(global.fetch).not.toHaveBeenCalled();
	});

	it("should not call handleSelectFile when disabled and the select button is clicked", async () => {
		render(<FileUpload name="document" action="/api/upload" disabled />);

		await selectFile("Selecionar arquivo", createFile());

		expect(global.fetch).not.toHaveBeenCalled();
		expect(
			screen.getByText("Ou arraste e solte o arquivo aqui"),
		).toBeInTheDocument();
	});

	it("should disable the select button when disabled is true", () => {
		render(<FileUpload name="document" action="/api/upload" disabled />);

		expect(
			screen.getByRole("button", { name: "Selecionar arquivo" }),
		).toBeDisabled();
	});

	it("should not disable the select button by default", () => {
		render(<FileUpload name="document" action="/api/upload" />);

		expect(
			screen.getByRole("button", { name: "Selecionar arquivo" }),
		).not.toBeDisabled();
	});

	it("should disable the change button when disabled is true and a file already exists", async () => {
		render(<FileUpload name="document" action="/api/upload" />);

		await selectFile("Selecionar arquivo", createFile());

		await waitFor(() =>
			expect(
				screen.getByRole("button", { name: "Alterar arquivo" }),
			).toBeInTheDocument(),
		);
	});

	it("should display a field error from FormProvider by field name", () => {
		render(
			<FormProvider fieldErrors={{ document: "Campo obrigatório" }}>
				<FileUpload name="document" action="/api/upload" />
			</FormProvider>,
		);

		expect(screen.getByText("Campo obrigatório")).toBeInTheDocument();
	});

	it("should not display a field error for a different field name", () => {
		render(
			<FormProvider fieldErrors={{ other: "Campo obrigatório" }}>
				<FileUpload name="document" action="/api/upload" />
			</FormProvider>,
		);

		expect(screen.queryByText("Campo obrigatório")).not.toBeInTheDocument();
	});

	it("should apply hasError class when a fieldError is present from FormProvider", () => {
		const { container } = render(
			<FormProvider fieldErrors={{ document: "Campo obrigatório" }}>
				<FileUpload name="document" action="/api/upload" />
			</FormProvider>,
		);

		const wrapper = container.querySelector(".arkynFileUpload");
		expect(wrapper).toHaveClass("hasError");
	});

	it("should render without a FormProvider ancestor without throwing", () => {
		expect(() =>
			render(<FileUpload name="document" action="/api/upload" />),
		).not.toThrow();
	});

	it("should prefer the field error over the local validation error when both could apply", async () => {
		global.fetch = vi.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve({ error: "Erro local" }),
			} as Response),
		);

		render(
			<FormProvider fieldErrors={{ document: "Erro do servidor" }}>
				<FileUpload name="document" action="/api/upload" />
			</FormProvider>,
		);

		await selectFile("Selecionar arquivo", createFile());

		await waitFor(() =>
			expect(screen.getByText("Erro do servidor")).toBeInTheDocument(),
		);
		expect(screen.queryByText("Erro local")).not.toBeInTheDocument();
	});

	it("should render the FieldWrapper section as the outer wrapper", () => {
		const { container } = render(
			<FileUpload name="document" action="/api/upload" label="Document" />,
		);

		const section = container.querySelector("section.arkynFieldWrapper");
		expect(section).toBeInTheDocument();
		expect(
			within(section as HTMLElement).getByText("Document"),
		).toBeInTheDocument();
	});

	it("should render the correct file icon based on the selected file type", async () => {
		const { container } = render(
			<FileUpload name="document" action="/api/upload" />,
		);

		const imageFile = new File(["img"], "photo.png", { type: "image/png" });
		await selectFile("Selecionar arquivo", imageFile);

		await waitFor(() =>
			expect(screen.getByText("photo.png")).toBeInTheDocument(),
		);
		expect(container.querySelector(".lucide-file-image")).toBeInTheDocument();
	});
});
