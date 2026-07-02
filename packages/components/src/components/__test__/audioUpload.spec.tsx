import {
	cleanup,
	render,
	screen,
	waitFor,
	within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FormProvider } from "../../providers/formProvider";
import { AudioUpload } from "../audioUpload";

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

function createAudioFile(name = "song.mp3", type = "audio/mpeg") {
	return new File(["audio-content"], name, { type });
}

async function selectFile(buttonName: string | RegExp, file: File | null) {
	mockFilePicker(file);
	const user = userEvent.setup();
	await user.click(screen.getByRole("button", { name: buttonName }));
}

describe("AudioUpload", () => {
	beforeEach(() => {
		window.HTMLMediaElement.prototype.play = vi.fn();
		window.HTMLMediaElement.prototype.pause = vi.fn();
		window.URL.createObjectURL = vi.fn(() => "blob:mock-audio-url");
		global.fetch = vi.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve({ url: "https://cdn.test/audio.mp3" }),
			} as Response),
		);
	});

	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
	});

	it("should render without errors", () => {
		const { container } = render(<AudioUpload name="audio" action="/upload" />);

		expect(container).toBeInTheDocument();
	});

	it("should render the default drop text and select button", () => {
		render(<AudioUpload name="audio" action="/upload" />);

		expect(
			screen.getByText("Ou arraste e solte um arquivo de áudio aqui"),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Selecionar arquivo de áudio" }),
		).toBeInTheDocument();
	});

	it("should render without a label when label is omitted", () => {
		render(<AudioUpload name="audio" action="/upload" />);

		expect(screen.queryByText("Audio field")).not.toBeInTheDocument();
		expect(document.querySelector("label")).not.toBeInTheDocument();
	});

	it("should render the label when provided", () => {
		render(<AudioUpload name="audio" action="/upload" label="Audio field" />);

		expect(screen.getByText("Audio field")).toBeInTheDocument();
	});

	it("should not append an asterisk to the label by default", () => {
		render(<AudioUpload name="audio" action="/upload" label="Audio field" />);

		const label = screen.getByText("Audio field").closest("label");
		expect(label).toHaveClass("asteriskFalse");
	});

	it("should append an asterisk to the label when showAsterisk is true", () => {
		render(
			<AudioUpload
				name="audio"
				action="/upload"
				label="Audio field"
				showAsterisk
			/>,
		);

		const label = screen.getByText("Audio field").closest("label");
		expect(label).toHaveClass("asteriskTrue");
	});

	it("should render a hidden input with the given name", () => {
		const { container } = render(
			<AudioUpload name="myAudio" action="/upload" />,
		);

		const hiddenInput = container.querySelector(
			'input[type="hidden"]',
		) as HTMLInputElement;

		expect(hiddenInput).toBeInTheDocument();
		expect(hiddenInput).toHaveAttribute("name", "myAudio");
	});

	it("should render an empty hidden input value by default", () => {
		const { container } = render(<AudioUpload name="audio" action="/upload" />);

		const hiddenInput = container.querySelector(
			'input[type="hidden"]',
		) as HTMLInputElement;

		expect(hiddenInput).toHaveValue("");
	});

	it("should pre-populate the hidden input value from defaultValue", () => {
		const { container } = render(
			<AudioUpload
				name="audio"
				action="/upload"
				defaultValue="https://cdn.test/existing.mp3"
			/>,
		);

		const hiddenInput = container.querySelector(
			'input[type="hidden"]',
		) as HTMLInputElement;

		expect(hiddenInput).toHaveValue("https://cdn.test/existing.mp3");
	});

	it("should render the file preview immediately when a defaultValue is provided", () => {
		render(
			<AudioUpload
				name="audio"
				action="/upload"
				defaultValue="https://cdn.test/existing.mp3"
			/>,
		);

		expect(
			screen.queryByText("Ou arraste e solte um arquivo de áudio aqui"),
		).not.toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Trocar arquivo de áudio" }),
		).toBeInTheDocument();
	});

	it("should use the base class along with noHasAudio and noHasError by default", () => {
		const { container } = render(<AudioUpload name="audio" action="/upload" />);

		const wrapper = container.querySelector(".arkynAudioUpload");
		expect(wrapper).toHaveClass("arkynAudioUpload");
		expect(wrapper).toHaveClass("noHasError");
		expect(wrapper).toHaveClass("noHasAudio");
	});

	it("should apply the hasAudio class once a file has been selected", async () => {
		const { container } = render(<AudioUpload name="audio" action="/upload" />);

		await selectFile(
			"Selecionar arquivo de áudio",
			createAudioFile("track.mp3"),
		);

		const wrapper = container.querySelector(".arkynAudioUpload");
		await waitFor(() => expect(wrapper).toHaveClass("hasAudio"));
		expect(wrapper).not.toHaveClass("noHasAudio");
	});

	it("should apply the hasError class when a non-audio file is selected", async () => {
		const { container } = render(<AudioUpload name="audio" action="/upload" />);

		const invalidFile = new File(["text"], "notes.txt", {
			type: "text/plain",
		});
		await selectFile("Selecionar arquivo de áudio", invalidFile);

		const wrapper = container.querySelector(".arkynAudioUpload");
		expect(wrapper).toHaveClass("hasError");
	});

	it("should show a validation error message for non-audio files", async () => {
		render(<AudioUpload name="audio" action="/upload" />);

		const invalidFile = new File(["text"], "notes.txt", {
			type: "text/plain",
		});
		await selectFile("Selecionar arquivo de áudio", invalidFile);

		expect(
			screen.getByText("O arquivo selecionado não é um arquivo de áudio"),
		).toBeInTheDocument();
	});

	it("should not call fetch when the selected file is not an audio file", async () => {
		render(<AudioUpload name="audio" action="/upload" />);

		const invalidFile = new File(["text"], "notes.txt", {
			type: "text/plain",
		});
		await selectFile("Selecionar arquivo de áudio", invalidFile);

		expect(global.fetch).not.toHaveBeenCalled();
	});

	it("should not render the drop zone or picker button when nothing is selected on file rejection", async () => {
		render(<AudioUpload name="audio" action="/upload" />);

		const invalidFile = new File(["text"], "notes.txt", {
			type: "text/plain",
		});
		await selectFile("Selecionar arquivo de áudio", invalidFile);

		expect(
			screen.getByText("Ou arraste e solte um arquivo de áudio aqui"),
		).toBeInTheDocument();
	});

	it("should upload the selected audio file via fetch with multipart form data", async () => {
		render(<AudioUpload name="audio" action="/api/upload" />);

		const file = createAudioFile("song.mp3");
		await selectFile("Selecionar arquivo de áudio", file);

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
			<AudioUpload name="audio" action="/api/upload" fileName="audioFile" />,
		);

		const file = createAudioFile();
		await selectFile("Selecionar arquivo de áudio", file);

		await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

		const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock
			.calls[0];
		expect((options.body as FormData).get("audioFile")).toBe(file);
	});

	it("should use a custom HTTP method when provided", async () => {
		render(<AudioUpload name="audio" action="/api/upload" method="PUT" />);

		const file = createAudioFile();
		await selectFile("Selecionar arquivo de áudio", file);

		await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

		const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock
			.calls[0];
		expect(options.method).toBe("PUT");
	});

	it("should call onChange with the response url using the default fileResponseName", async () => {
		const handleChange = vi.fn();
		render(
			<AudioUpload name="audio" action="/api/upload" onChange={handleChange} />,
		);

		const file = createAudioFile();
		await selectFile("Selecionar arquivo de áudio", file);

		await waitFor(() =>
			expect(handleChange).toHaveBeenCalledWith("https://cdn.test/audio.mp3"),
		);
		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	it("should read the url from a custom fileResponseName", async () => {
		global.fetch = vi.fn(() =>
			Promise.resolve({
				json: () =>
					Promise.resolve({ audioUrl: "https://cdn.test/custom.mp3" }),
			} as Response),
		);

		const handleChange = vi.fn();
		render(
			<AudioUpload
				name="audio"
				action="/api/upload"
				fileResponseName="audioUrl"
				onChange={handleChange}
			/>,
		);

		const file = createAudioFile();
		await selectFile("Selecionar arquivo de áudio", file);

		await waitFor(() =>
			expect(handleChange).toHaveBeenCalledWith("https://cdn.test/custom.mp3"),
		);
	});

	it("should update the hidden input value after a successful upload", async () => {
		const { container } = render(
			<AudioUpload name="audio" action="/api/upload" />,
		);

		const file = createAudioFile();
		await selectFile("Selecionar arquivo de áudio", file);

		const hiddenInput = container.querySelector(
			'input[type="hidden"]',
		) as HTMLInputElement;

		await waitFor(() =>
			expect(hiddenInput).toHaveValue("https://cdn.test/audio.mp3"),
		);
	});

	it("should display the error message returned by the server", async () => {
		global.fetch = vi.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve({ error: "Arquivo muito grande" }),
			} as Response),
		);

		render(<AudioUpload name="audio" action="/api/upload" />);

		const file = createAudioFile();
		await selectFile("Selecionar arquivo de áudio", file);

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
			<AudioUpload name="audio" action="/api/upload" onChange={handleChange} />,
		);

		const file = createAudioFile();
		await selectFile("Selecionar arquivo de áudio", file);

		await waitFor(() => expect(screen.getByText("Falhou")).toBeInTheDocument());
		expect(handleChange).toHaveBeenCalledTimes(1);
		expect(handleChange).toHaveBeenCalledWith(undefined);
	});

	it("should display a generic error message when the upload request rejects", async () => {
		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});
		global.fetch = vi.fn(() => Promise.reject(new Error("network down")));

		render(<AudioUpload name="audio" action="/api/upload" />);

		const file = createAudioFile();
		await selectFile("Selecionar arquivo de áudio", file);

		await waitFor(() =>
			expect(screen.getByText("Erro ao enviar audio")).toBeInTheDocument(),
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
				json: () => Promise.resolve({ url: "https://cdn.test/retry.mp3" }),
			});

		render(<AudioUpload name="audio" action="/api/upload" />);

		const file = createAudioFile();
		await selectFile("Selecionar arquivo de áudio", file);

		await waitFor(() => expect(screen.getByText("Falhou")).toBeInTheDocument());

		const resendButton = screen.getByRole("button", {
			name: "resend image",
		});
		expect(resendButton).toBeInTheDocument();

		const user = userEvent.setup();
		await user.click(resendButton);

		await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
		await waitFor(() =>
			expect(screen.queryByText("Falhou")).not.toBeInTheDocument(),
		);
	});

	it("should not render a resend button while there is no error", async () => {
		render(<AudioUpload name="audio" action="/api/upload" />);

		const file = createAudioFile();
		await selectFile("Selecionar arquivo de áudio", file);

		await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
		expect(
			screen.queryByRole("button", { name: "resend image" }),
		).not.toBeInTheDocument();
	});

	it("should allow changing the file after one has already been selected", async () => {
		render(<AudioUpload name="audio" action="/api/upload" />);

		const firstFile = createAudioFile("first.mp3");
		await selectFile("Selecionar arquivo de áudio", firstFile);

		await waitFor(() =>
			expect(
				screen.getByRole("button", { name: "Trocar arquivo de áudio" }),
			).toBeInTheDocument(),
		);

		const secondFile = createAudioFile("second.mp3");
		await selectFile("Trocar arquivo de áudio", secondFile);

		await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
	});

	it("should use custom dropAudioText, selectAudioButtonText and changeAudioButtonText", async () => {
		render(
			<AudioUpload
				name="audio"
				action="/api/upload"
				dropAudioText="Solte o áudio"
				selectAudioButtonText="Escolher áudio"
				changeAudioButtonText="Alterar áudio"
			/>,
		);

		expect(screen.getByText("Solte o áudio")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Escolher áudio" }),
		).toBeInTheDocument();

		await selectFile("Escolher áudio", createAudioFile());

		await waitFor(() =>
			expect(
				screen.getByRole("button", { name: "Alterar áudio" }),
			).toBeInTheDocument(),
		);
	});

	it("should not call handleSelectFile when disabled and the select button is clicked", async () => {
		render(<AudioUpload name="audio" action="/api/upload" disabled />);

		await selectFile("Selecionar arquivo de áudio", createAudioFile());

		expect(global.fetch).not.toHaveBeenCalled();
		expect(
			screen.getByText("Ou arraste e solte um arquivo de áudio aqui"),
		).toBeInTheDocument();
	});

	it("should disable the select button when disabled is true", () => {
		render(<AudioUpload name="audio" action="/api/upload" disabled />);

		expect(
			screen.getByRole("button", { name: "Selecionar arquivo de áudio" }),
		).toBeDisabled();
	});

	it("should not disable the select button by default", () => {
		render(<AudioUpload name="audio" action="/api/upload" />);

		expect(
			screen.getByRole("button", { name: "Selecionar arquivo de áudio" }),
		).not.toBeDisabled();
	});

	it("should disable the change button when disabled is true and a file already exists", () => {
		render(
			<AudioUpload
				name="audio"
				action="/api/upload"
				disabled
				defaultValue="https://cdn.test/existing.mp3"
			/>,
		);

		expect(
			screen.getByRole("button", { name: "Trocar arquivo de áudio" }),
		).toBeDisabled();
	});

	it("should display a field error from FormProvider by field name", () => {
		render(
			<FormProvider fieldErrors={{ audio: "Campo obrigatório" }}>
				<AudioUpload name="audio" action="/api/upload" />
			</FormProvider>,
		);

		expect(screen.getByText("Campo obrigatório")).toBeInTheDocument();
	});

	it("should not display a field error for a different field name", () => {
		render(
			<FormProvider fieldErrors={{ other: "Campo obrigatório" }}>
				<AudioUpload name="audio" action="/api/upload" />
			</FormProvider>,
		);

		expect(screen.queryByText("Campo obrigatório")).not.toBeInTheDocument();
	});

	it("should apply hasError class when a fieldError is present from FormProvider", () => {
		const { container } = render(
			<FormProvider fieldErrors={{ audio: "Campo obrigatório" }}>
				<AudioUpload name="audio" action="/api/upload" />
			</FormProvider>,
		);

		const wrapper = container.querySelector(".arkynAudioUpload");
		expect(wrapper).toHaveClass("hasError");
	});

	it("should render without a FormProvider ancestor without throwing", () => {
		expect(() =>
			render(<AudioUpload name="audio" action="/api/upload" />),
		).not.toThrow();
	});

	it("should prefer the local validation error over the field error when both could apply", async () => {
		render(
			<FormProvider fieldErrors={{ audio: "Erro do servidor" }}>
				<AudioUpload name="audio" action="/api/upload" />
			</FormProvider>,
		);

		expect(screen.getByText("Erro do servidor")).toBeInTheDocument();
	});

	it("should pass the acceptAudio prop down to the native file input", () => {
		let capturedInput: HTMLInputElement | undefined;

		vi.spyOn(document, "createElement").mockImplementation((tagName) => {
			const element = originalCreateElement(tagName);
			if (tagName === "input") capturedInput = element as HTMLInputElement;
			return element;
		});

		render(
			<AudioUpload name="audio" action="/api/upload" acceptAudio="audio/mp3" />,
		);

		screen.getByRole("button", { name: "Selecionar arquivo de áudio" }).click();

		expect(capturedInput?.accept).toBe("audio/mp3");
	});

	it("should render the audio player once a file exists", async () => {
		const { container } = render(
			<AudioUpload
				name="audio"
				action="/api/upload"
				defaultValue="https://cdn.test/existing.mp3"
			/>,
		);

		expect(container.querySelector(".arkynAudioPlayer")).toBeInTheDocument();
	});

	it("should not render the audio player when there is no file", () => {
		const { container } = render(
			<AudioUpload name="audio" action="/api/upload" />,
		);

		expect(
			container.querySelector(".arkynAudioPlayer"),
		).not.toBeInTheDocument();
	});

	it("should render the FieldWrapper section as the outer wrapper", () => {
		const { container } = render(
			<AudioUpload name="audio" action="/api/upload" label="Audio" />,
		);

		const section = container.querySelector("section.arkynFieldWrapper");
		expect(section).toBeInTheDocument();
		expect(
			within(section as HTMLElement).getByText("Audio"),
		).toBeInTheDocument();
	});
});
