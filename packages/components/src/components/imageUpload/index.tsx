import { useState } from "react";

import { useForm } from "../../hooks/useForm";
import { FieldTemplate } from "../../services/fieldTemplate";

import { HasFileContent } from "./hasFileContent";
import { NoFileContent } from "./noFileContent";
import "./styles.css";

type ImageUploadProps = {
	/** Field name for form submission (stores the uploaded image URL). Required. */
	name: string;
	/** Server endpoint URL that receives the `multipart/form-data` upload request. Required. */
	action: string;
	/** Pre-populated image URL displayed as a preview (e.g. an existing avatar). @default "" */
	defaultValue?: string | null;
	/** Additional CSS class applied to the wrapper element. */
	className?: string;
	/** Disables file selection and upload. @default false */
	disabled?: boolean;
	/** Optional label text displayed above the upload area. */
	label?: string;
	/** Displays an asterisk on the label to signal a required field. @default false */
	showAsterisk?: boolean;
	/** Label for the file-picker button after an image is selected. @default "Alterar imagem" */
	changeImageButtonText?: string;
	/** Label for the file-picker button before an image is selected. @default "Selecionar imagem" */
	selectImageButtonText?: string;
	/** Text displayed in the drag-and-drop zone. @default "Ou arraste e solte a imagem aqui" */
	dropImageText?: string;
	/** HTTP method for the upload request. @default "POST" */
	method?: string;
	/** Form-data field name used for the file. @default "file" */
	fileName?: string;
	/** Property name in the server response that contains the image URL. @default "url" */
	fileResponseName?: string;
	/** Accepted image MIME types or extensions (e.g. `"image/jpeg,image/png"`). @default "image/*" */
	acceptImage?: string;
	/** Callback fired after a successful upload. Receives the image URL returned by the server. */
	onChange?: (url: string) => void;
	/** When true, skips `FieldTemplate` wrapper (label and error text). @default false */
	unShowFieldTemplate?: boolean;
	/**
	 * Layout direction forwarded to `FieldTemplate`.
	 * @default "horizontal"
	 */
	orientation?: "horizontal" | "vertical" | "horizontalReverse";
};

/**
 * ImageUpload — drag-and-drop image uploader with server upload and image preview.
 *
 * Sends the file via `fetch` as `multipart/form-data` and stores the returned URL
 * in a hidden `<input>` for form submission.
 * Integrates with `useForm` to display validation errors by field name.
 *
 * @param props.name - Field name for form submission. Required.
 * @param props.action - Upload endpoint URL. Required.
 * @param props.defaultValue - Pre-populated image URL displayed as preview.
 * @param props.disabled - Disables file selection and upload. Default: false
 * @param props.label - Label text displayed above the upload area.
 * @param props.showAsterisk - Appends `*` to the label. Default: false
 * @param props.acceptImage - Accepted MIME types or extensions. Default: "image/*"
 * @param props.method - HTTP method. Default: "POST"
 * @param props.fileName - Form-data field name for the file. Default: "file"
 * @param props.fileResponseName - Server response property containing the URL. Default: "url"
 * @param props.onChange - Callback fired after a successful upload — receives the image URL.
 * @param props.orientation - Layout direction. Default: "horizontal"
 * @param props.unShowFieldTemplate - Skips wrapper, label, and error rendering. Default: false
 *
 * @returns ImageUpload JSX element wrapped in `FieldTemplate`.
 *
 * @example
 * ```tsx
 * // Basic
 * <ImageUpload name="avatar" action="/api/upload/image" />
 *
 * // Profile picture with existing image and label
 * <ImageUpload
 *   name="profilePicture"
 *   action="/api/upload/avatar"
 *   label="Profile Picture"
 *   showAsterisk
 *   defaultValue={user.avatarUrl}
 *   selectImageButtonText="Choose photo"
 *   onChange={(url) => updateProfile({ avatarUrl: url })}
 * />
 *
 * // Restricted to JPEG/PNG
 * <ImageUpload
 *   name="productImage"
 *   action="/api/upload/product"
 *   label="Product Image"
 *   acceptImage="image/jpeg,image/png"
 *   fileResponseName="imageUrl"
 * />
 * ```
 */

function ImageUpload(props: ImageUploadProps) {
	const {
		name,
		defaultValue = "",
		label,
		showAsterisk = false,
		action,
		fileName = "file",
		className: wrapperClassName = "",
		method = "POST",
		acceptImage = "image/*",
		fileResponseName = "url",
		changeImageButtonText = "Alterar imagem",
		selectImageButtonText = "Selecionar imagem",
		dropImageText = "Ou arraste e solte a imagem aqui",
		onChange,
		disabled = false,
		unShowFieldTemplate = false,
		orientation = "vertical",
	} = props;

	const { fieldErrors } = useForm();
	const fieldError = fieldErrors?.[name];

	const [value, setValue] = useState(defaultValue);
	const [error, setError] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [filePath, setFilePath] = useState(defaultValue);
	const [isLoading, setIsLoading] = useState(false);

	async function handleUploadImage(file: File) {
		if (disabled) return;

		setIsLoading(true);
		setFile(file);
		setError("");

		const formData = new FormData();
		formData.append(fileName, file);

		await fetch(action, { method: method, body: formData })
			.then(async (response) => await response.json())
			.then((response) => {
				if (response?.error) setError(response.error);
				else setValue(response?.[fileResponseName]);
				onChange?.(response?.[fileResponseName]);
			})
			.catch((error) => {
				console.error(error);
				setError("Erro ao enviar imagem");
			})
			.finally(() => setIsLoading(false));
	}

	function handleSelectFile(file: File) {
		if (disabled) return;

		setFilePath(URL.createObjectURL(file));
		handleUploadImage(file);
	}

	const errorMessage = fieldError || error;

	const hasErrorClassName = errorMessage ? "hasError" : "noHasError";
	const hasImageClassName = filePath ? "hasImage" : "noHasImage";
	const className = `arkynImageUpload ${hasErrorClassName} ${hasImageClassName}`;

	return (
		<FieldTemplate
			name={name}
			label={label}
			showAsterisk={showAsterisk}
			className={wrapperClassName}
			errorMessage={errorMessage}
			unShowFieldTemplate={unShowFieldTemplate}
			orientation={orientation}
		>
			<div className={className}>
				<input type="hidden" name={name} value={value || ""} />

				{!filePath && (
					<NoFileContent
						disabled={disabled}
						isLoading={isLoading}
						acceptImage={acceptImage}
						dropImageText={dropImageText}
						handleSelectFile={handleSelectFile}
						selectImageButtonText={selectImageButtonText}
					/>
				)}

				{filePath && (
					<HasFileContent
						disabled={disabled}
						isLoading={isLoading}
						acceptImage={acceptImage}
						filePath={filePath}
						handleSelectFile={handleSelectFile}
						changeImageButtonText={changeImageButtonText}
						reSendImage={
							errorMessage && file ? () => handleUploadImage(file) : undefined
						}
					/>
				)}
			</div>
		</FieldTemplate>
	);
}

export { ImageUpload };
