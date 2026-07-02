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
import { ImageUpload } from "../index";

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

function createImageFile(name = "avatar.png", type = "image/png") {
	return new File(["image-content"], name, { type });
}

async function selectFile(buttonName: string | RegExp, file: File | null) {
	mockFilePicker(file);
	const user = userEvent.setup();
	await user.click(screen.getByRole("button", { name: buttonName }));
}

function dropFile(container: HTMLElement, file: File | null) {
	const dropZone = container.querySelector(
		".arkynImageUploadNoFileContent",
	) as HTMLElement;

	fireEvent.drop(dropZone, {
		dataTransfer: { files: file ? [file] : [] },
	});
}

describe("ImageUpload", () => {
	beforeEach(() => {
		global.fetch = vi.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve({ url: "https://cdn.test/avatar.png" }),
			} as Response),
		);
		window.URL.createObjectURL = vi.fn(() => "blob:preview-url");
	});

	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
	});

	it("should render without errors", () => {
		const { container } = render(
			<ImageUpload name="avatar" action="/upload" />,
		);

		expect(container).toBeInTheDocument();
	});

	it("should render the default drop text and select button when no image is present", () => {
		render(<ImageUpload name="avatar" action="/upload" />);

		expect(
			screen.getByText("Ou arraste e solte a imagem aqui"),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Selecionar imagem" }),
		).toBeInTheDocument();
	});

	it("should render without a label when label is omitted", () => {
		render(<ImageUpload name="avatar" action="/upload" />);

		expect(document.querySelector("label")).not.toBeInTheDocument();
	});

	it("should render the label when provided", () => {
		render(
			<ImageUpload name="avatar" action="/upload" label="Profile picture" />,
		);

		expect(screen.getByText("Profile picture")).toBeInTheDocument();
	});

	it("should not append an asterisk to the label by default", () => {
		render(
			<ImageUpload name="avatar" action="/upload" label="Profile picture" />,
		);

		const label = screen.getByText("Profile picture").closest("label");
		expect(label).toHaveClass("asteriskFalse");
	});

	it("should append an asterisk to the label when showAsterisk is true", () => {
		render(
			<ImageUpload
				name="avatar"
				action="/upload"
				label="Profile picture"
				showAsterisk
			/>,
		);

		const label = screen.getByText("Profile picture").closest("label");
		expect(label).toHaveClass("asteriskTrue");
	});

	it("should render a hidden input with the given name", () => {
		const { container } = render(
			<ImageUpload name="myAvatar" action="/upload" />,
		);

		const hiddenInput = container.querySelector(
			'input[type="hidden"]',
		) as HTMLInputElement;

		expect(hiddenInput).toBeInTheDocument();
		expect(hiddenInput).toHaveAttribute("name", "myAvatar");
	});

	it("should render an empty hidden input value by default", () => {
		const { container } = render(
			<ImageUpload name="avatar" action="/upload" />,
		);

		const hiddenInput = container.querySelector(
			'input[type="hidden"]',
		) as HTMLInputElement;

		expect(hiddenInput).toHaveValue("");
	});

	it("should render the hidden input pre-populated with defaultValue", () => {
		const { container } = render(
			<ImageUpload
				name="avatar"
				action="/upload"
				defaultValue="https://cdn.test/existing.png"
			/>,
		);

		const hiddenInput = container.querySelector(
			'input[type="hidden"]',
		) as HTMLInputElement;

		expect(hiddenInput).toHaveValue("https://cdn.test/existing.png");
	});

	it("should render the preview image and change button when defaultValue is present", () => {
		render(
			<ImageUpload
				name="avatar"
				action="/upload"
				defaultValue="https://cdn.test/existing.png"
			/>,
		);

		expect(
			screen.getByRole("button", { name: "Alterar imagem" }),
		).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: "Selecionar imagem" }),
		).not.toBeInTheDocument();
	});

	it("should not render a preview when defaultValue is null", () => {
		render(<ImageUpload name="avatar" action="/upload" defaultValue={null} />);

		expect(
			screen.getByRole("button", { name: "Selecionar imagem" }),
		).toBeInTheDocument();
	});

	it("should use the base class along with noHasImage and noHasError by default", () => {
		const { container } = render(
			<ImageUpload name="avatar" action="/upload" />,
		);

		const wrapper = container.querySelector(".arkynImageUpload");
		expect(wrapper).toHaveClass("arkynImageUpload");
		expect(wrapper).toHaveClass("noHasError");
		expect(wrapper).toHaveClass("noHasImage");
	});

	it("should apply the hasImage class once a file has been selected", async () => {
		const { container } = render(
			<ImageUpload name="avatar" action="/upload" />,
		);

		await selectFile("Selecionar imagem", createImageFile());

		const wrapper = container.querySelector(".arkynImageUpload");
		await waitFor(() => expect(wrapper).toHaveClass("hasImage"));
		expect(wrapper).not.toHaveClass("noHasImage");
	});

	it("should render the preview background image from the created object URL once selected", async () => {
		const { container } = render(
			<ImageUpload name="avatar" action="/upload" />,
		);

		await selectFile("Selecionar imagem", createImageFile());

		await waitFor(() => {
			const preview = container.querySelector(
				".arkynImageUploadHasFileContent",
			) as HTMLElement;
			expect(preview).toBeInTheDocument();
			expect(preview.style.backgroundImage).toContain("blob:preview-url");
		});
	});

	it("should upload the selected image via fetch with multipart form data", async () => {
		render(<ImageUpload name="avatar" action="/api/upload" />);

		const file = createImageFile();
		await selectFile("Selecionar imagem", file);

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
			<ImageUpload name="avatar" action="/api/upload" fileName="imageFile" />,
		);

		const file = createImageFile();
		await selectFile("Selecionar imagem", file);

		await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

		const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock
			.calls[0];
		expect((options.body as FormData).get("imageFile")).toBe(file);
	});

	it("should use a custom HTTP method when provided", async () => {
		render(<ImageUpload name="avatar" action="/api/upload" method="PUT" />);

		const file = createImageFile();
		await selectFile("Selecionar imagem", file);

		await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

		const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock
			.calls[0];
		expect(options.method).toBe("PUT");
	});

	it("should call onChange with the response url using the default fileResponseName", async () => {
		const handleChange = vi.fn();
		render(
			<ImageUpload
				name="avatar"
				action="/api/upload"
				onChange={handleChange}
			/>,
		);

		const file = createImageFile();
		await selectFile("Selecionar imagem", file);

		await waitFor(() =>
			expect(handleChange).toHaveBeenCalledWith("https://cdn.test/avatar.png"),
		);
		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	it("should read the url from a custom fileResponseName", async () => {
		global.fetch = vi.fn(() =>
			Promise.resolve({
				json: () =>
					Promise.resolve({ imageUrl: "https://cdn.test/custom.png" }),
			} as Response),
		);

		const handleChange = vi.fn();
		render(
			<ImageUpload
				name="avatar"
				action="/api/upload"
				fileResponseName="imageUrl"
				onChange={handleChange}
			/>,
		);

		const file = createImageFile();
		await selectFile("Selecionar imagem", file);

		await waitFor(() =>
			expect(handleChange).toHaveBeenCalledWith("https://cdn.test/custom.png"),
		);
	});

	it("should update the hidden input value after a successful upload", async () => {
		const { container } = render(
			<ImageUpload name="avatar" action="/api/upload" />,
		);

		const file = createImageFile();
		await selectFile("Selecionar imagem", file);

		const hiddenInput = container.querySelector(
			'input[type="hidden"]',
		) as HTMLInputElement;

		await waitFor(() =>
			expect(hiddenInput).toHaveValue("https://cdn.test/avatar.png"),
		);
	});

	it("should display the error message returned by the server", async () => {
		global.fetch = vi.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve({ error: "Imagem muito grande" }),
			} as Response),
		);

		render(<ImageUpload name="avatar" action="/api/upload" />);

		const file = createImageFile();
		await selectFile("Selecionar imagem", file);

		await waitFor(() =>
			expect(screen.getByText("Imagem muito grande")).toBeInTheDocument(),
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
			<ImageUpload
				name="avatar"
				action="/api/upload"
				onChange={handleChange}
			/>,
		);

		const file = createImageFile();
		await selectFile("Selecionar imagem", file);

		await waitFor(() => expect(screen.getByText("Falhou")).toBeInTheDocument());
		expect(handleChange).toHaveBeenCalledTimes(1);
		expect(handleChange).toHaveBeenCalledWith(undefined);
	});

	it("should display a generic error message when the upload request rejects", async () => {
		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});
		global.fetch = vi.fn(() => Promise.reject(new Error("network down")));

		render(<ImageUpload name="avatar" action="/api/upload" />);

		const file = createImageFile();
		await selectFile("Selecionar imagem", file);

		await waitFor(() =>
			expect(screen.getByText("Erro ao enviar imagem")).toBeInTheDocument(),
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
				json: () => Promise.resolve({ url: "https://cdn.test/retry.png" }),
			});

		render(<ImageUpload name="avatar" action="/api/upload" />);

		const file = createImageFile();
		await selectFile("Selecionar imagem", file);

		await waitFor(() => expect(screen.getByText("Falhou")).toBeInTheDocument());

		const resendButton = screen.getByRole("button", { name: "resend image" });
		expect(resendButton).toBeInTheDocument();

		const user = userEvent.setup();
		await user.click(resendButton);

		await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
		await waitFor(() =>
			expect(screen.queryByText("Falhou")).not.toBeInTheDocument(),
		);
	});

	it("should not render a resend button while there is no error", async () => {
		render(<ImageUpload name="avatar" action="/api/upload" />);

		const file = createImageFile();
		await selectFile("Selecionar imagem", file);

		await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
		expect(
			screen.queryByRole("button", { name: "resend image" }),
		).not.toBeInTheDocument();
	});

	it("should allow changing the image after one has already been selected", async () => {
		render(<ImageUpload name="avatar" action="/api/upload" />);

		const firstFile = createImageFile("first.png");
		await selectFile("Selecionar imagem", firstFile);

		await waitFor(() =>
			expect(
				screen.getByRole("button", { name: "Alterar imagem" }),
			).toBeInTheDocument(),
		);

		const secondFile = createImageFile("second.png");
		await selectFile("Alterar imagem", secondFile);

		await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
	});

	it("should use custom dropImageText, selectImageButtonText and changeImageButtonText", async () => {
		render(
			<ImageUpload
				name="avatar"
				action="/api/upload"
				dropImageText="Solte a imagem"
				selectImageButtonText="Escolher imagem"
				changeImageButtonText="Alterar avatar"
			/>,
		);

		expect(screen.getByText("Solte a imagem")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Escolher imagem" }),
		).toBeInTheDocument();

		await selectFile("Escolher imagem", createImageFile());

		await waitFor(() =>
			expect(
				screen.getByRole("button", { name: "Alterar avatar" }),
			).toBeInTheDocument(),
		);
	});

	it("should pass the acceptImage prop down to the native file input", () => {
		let capturedInput: HTMLInputElement | undefined;

		vi.spyOn(document, "createElement").mockImplementation((tagName) => {
			const element = originalCreateElement(tagName);
			if (tagName === "input") capturedInput = element as HTMLInputElement;
			return element;
		});

		render(
			<ImageUpload
				name="avatar"
				action="/api/upload"
				acceptImage="image/jpeg,image/png"
			/>,
		);

		screen.getByRole("button", { name: "Selecionar imagem" }).click();

		expect(capturedInput?.accept).toBe("image/jpeg,image/png");
	});

	it("should default acceptImage to 'image/*' when omitted", () => {
		let capturedInput: HTMLInputElement | undefined;

		vi.spyOn(document, "createElement").mockImplementation((tagName) => {
			const element = originalCreateElement(tagName);
			if (tagName === "input") capturedInput = element as HTMLInputElement;
			return element;
		});

		render(<ImageUpload name="avatar" action="/api/upload" />);

		screen.getByRole("button", { name: "Selecionar imagem" }).click();

		expect(capturedInput?.accept).toBe("image/*");
	});

	it("should select an image via drag and drop on the drop zone", async () => {
		const { container } = render(
			<ImageUpload name="avatar" action="/api/upload" />,
		);

		dropFile(container, createImageFile("dropped.png"));

		await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
		await waitFor(() =>
			expect(
				container.querySelector(".arkynImageUploadHasFileContent"),
			).toBeInTheDocument(),
		);
	});

	it("should ignore a drop event with no files", () => {
		const { container } = render(
			<ImageUpload name="avatar" action="/api/upload" />,
		);

		dropFile(container, null);

		expect(global.fetch).not.toHaveBeenCalled();
		expect(
			screen.getByText("Ou arraste e solte a imagem aqui"),
		).toBeInTheDocument();
	});

	it("should not select an image via drag and drop when disabled", () => {
		const { container } = render(
			<ImageUpload name="avatar" action="/api/upload" disabled />,
		);

		dropFile(container, createImageFile());

		expect(global.fetch).not.toHaveBeenCalled();
	});

	it("should not call handleSelectFile when disabled and the select button is clicked", async () => {
		render(<ImageUpload name="avatar" action="/api/upload" disabled />);

		await selectFile("Selecionar imagem", createImageFile());

		expect(global.fetch).not.toHaveBeenCalled();
		expect(
			screen.getByText("Ou arraste e solte a imagem aqui"),
		).toBeInTheDocument();
	});

	it("should disable the select button when disabled is true", () => {
		render(<ImageUpload name="avatar" action="/api/upload" disabled />);

		expect(
			screen.getByRole("button", { name: "Selecionar imagem" }),
		).toBeDisabled();
	});

	it("should not disable the select button by default", () => {
		render(<ImageUpload name="avatar" action="/api/upload" />);

		expect(
			screen.getByRole("button", { name: "Selecionar imagem" }),
		).not.toBeDisabled();
	});

	it("should disable the change button when disabled is true and a defaultValue image already exists", () => {
		render(
			<ImageUpload
				name="avatar"
				action="/api/upload"
				disabled
				defaultValue="https://cdn.test/existing.png"
			/>,
		);

		expect(
			screen.getByRole("button", { name: "Alterar imagem" }),
		).toBeDisabled();
	});

	it("should display a field error from FormProvider by field name", () => {
		render(
			<FormProvider fieldErrors={{ avatar: "Campo obrigatório" }}>
				<ImageUpload name="avatar" action="/api/upload" />
			</FormProvider>,
		);

		expect(screen.getByText("Campo obrigatório")).toBeInTheDocument();
	});

	it("should not display a field error for a different field name", () => {
		render(
			<FormProvider fieldErrors={{ other: "Campo obrigatório" }}>
				<ImageUpload name="avatar" action="/api/upload" />
			</FormProvider>,
		);

		expect(screen.queryByText("Campo obrigatório")).not.toBeInTheDocument();
	});

	it("should apply hasError class when a fieldError is present from FormProvider", () => {
		const { container } = render(
			<FormProvider fieldErrors={{ avatar: "Campo obrigatório" }}>
				<ImageUpload name="avatar" action="/api/upload" />
			</FormProvider>,
		);

		const wrapper = container.querySelector(".arkynImageUpload");
		expect(wrapper).toHaveClass("hasError");
	});

	it("should render without a FormProvider ancestor without throwing", () => {
		expect(() =>
			render(<ImageUpload name="avatar" action="/api/upload" />),
		).not.toThrow();
	});

	it("should prefer the field error over the local validation error when both could apply", async () => {
		global.fetch = vi.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve({ error: "Erro local" }),
			} as Response),
		);

		render(
			<FormProvider fieldErrors={{ avatar: "Erro do servidor" }}>
				<ImageUpload name="avatar" action="/api/upload" />
			</FormProvider>,
		);

		await selectFile("Selecionar imagem", createImageFile());

		await waitFor(() =>
			expect(screen.getByText("Erro do servidor")).toBeInTheDocument(),
		);
		expect(screen.queryByText("Erro local")).not.toBeInTheDocument();
	});

	it("should render the FieldWrapper section as the outer wrapper", () => {
		const { container } = render(
			<ImageUpload name="avatar" action="/api/upload" label="Avatar" />,
		);

		const section = container.querySelector("section.arkynFieldWrapper");
		expect(section).toBeInTheDocument();
		expect(
			within(section as HTMLElement).getByText("Avatar"),
		).toBeInTheDocument();
	});

	it("should merge a custom className with the internal FieldWrapper class", () => {
		const { container } = render(
			<ImageUpload
				name="avatar"
				action="/api/upload"
				className="custom-class"
			/>,
		);

		const section = container.querySelector("section.arkynFieldWrapper");
		expect(section).toHaveClass("arkynFieldWrapper");
		expect(section).toHaveClass("custom-class");
	});

	it("should skip the FieldTemplate wrapper when unShowFieldTemplate is true", () => {
		const { container } = render(
			<ImageUpload
				name="avatar"
				action="/api/upload"
				label="Avatar"
				unShowFieldTemplate
			/>,
		);

		expect(
			container.querySelector("section.arkynFieldWrapper"),
		).not.toBeInTheDocument();
		expect(screen.queryByText("Avatar")).not.toBeInTheDocument();
		expect(container.querySelector(".arkynImageUpload")).toBeInTheDocument();
	});

	it("should use vertical orientation by default", () => {
		const { container } = render(
			<ImageUpload name="avatar" action="/api/upload" label="Avatar" />,
		);

		const section = container.querySelector("section.arkynFieldWrapper");
		expect(section).toHaveClass("vertical");
	});

	it("should apply the horizontal orientation class when specified", () => {
		const { container } = render(
			<ImageUpload
				name="avatar"
				action="/api/upload"
				label="Avatar"
				orientation="horizontal"
			/>,
		);

		const section = container.querySelector("section.arkynFieldWrapper");
		expect(section).toHaveClass("horizontal");
	});

	it("should apply the horizontalReverse orientation class when specified", () => {
		const { container } = render(
			<ImageUpload
				name="avatar"
				action="/api/upload"
				label="Avatar"
				orientation="horizontalReverse"
			/>,
		);

		const section = container.querySelector("section.arkynFieldWrapper");
		expect(section).toHaveClass("horizontalReverse");
	});
});
