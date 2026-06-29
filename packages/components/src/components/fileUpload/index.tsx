import { useState } from "react";

import { useForm } from "../../hooks/useForm";
import { FieldError } from "../fieldError";
import { FieldLabel } from "../fieldLabel";
import { FieldWrapper } from "../fieldWrapper";

import { HasFileContent } from "./hasFileContent";
import { NoFileContent } from "./noFileContent";
import "./styles.css";

type FileUploadProps = {
	/** Field name for form submission (stores the uploaded file URL). Required. */
	name: string;
	/** Server endpoint URL that receives the `multipart/form-data` upload request. Required. */
	action: string;
	/** Disables file selection and upload. @default false */
	disabled?: boolean;
	/** Optional label text displayed above the upload area. */
	label?: string;
	/** Displays an asterisk on the label to signal a required field. @default false */
	showAsterisk?: boolean;
	/** Label for the file-picker button after a file is selected. @default "Alterar arquivo" */
	changeFileButtonText?: string;
	/** Label for the file-picker button before a file is selected. @default "Selecionar arquivo" */
	selectFileButtonText?: string;
	/** Text displayed in the drag-and-drop zone. @default "Ou arraste e solte o arquivo aqui" */
	dropFileText?: string;
	/** HTTP method for the upload request. @default "POST" */
	method?: string;
	/** Form-data field name used for the file. @default "file" */
	fileName?: string;
	/** Property name in the server response that contains the file URL. @default "url" */
	fileResponseName?: string;
	/** Accepted file MIME types or extensions (e.g. `".pdf"`, `"image/*"`). @default "*" */
	acceptFile?: string;
	/** Callback fired after a successful upload. Receives the URL returned by the server. */
	onChange?: (url?: string) => void;
};

/**
 * FileUpload — drag-and-drop file uploader with server upload and file-name preview.
 *
 * Sends the file via `fetch` as `multipart/form-data` and stores the returned URL
 * in a hidden `<input>` for form submission.
 * Integrates with `useForm` to display validation errors by field name.
 *
 * @param props.name - Field name for form submission. Required.
 * @param props.action - Upload endpoint URL. Required.
 * @param props.disabled - Disables file selection and upload. Default: false
 * @param props.label - Label text displayed above the upload area.
 * @param props.showAsterisk - Appends `*` to the label. Default: false
 * @param props.acceptFile - Accepted MIME types or extensions. Default: "*"
 * @param props.method - HTTP method. Default: "POST"
 * @param props.fileName - Form-data field name for the file. Default: "file"
 * @param props.fileResponseName - Server response property containing the URL. Default: "url"
 * @param props.onChange - Callback fired after a successful upload — receives the file URL.
 *
 * @returns FileUpload JSX element wrapped in `FieldWrapper`.
 *
 * @example
 * ```tsx
 * // Basic
 * <FileUpload name="document" action="/api/upload" />
 *
 * // PDF only with label and callback
 * <FileUpload
 *   name="contract"
 *   action="/api/upload/docs"
 *   label="Contract (PDF)"
 *   showAsterisk
 *   acceptFile=".pdf"
 *   fileResponseName="documentUrl"
 *   onChange={(url) => setContractUrl(url)}
 * />
 * ```
 */

function FileUpload(props: FileUploadProps) {
	const {
		name,
		label,
		showAsterisk = false,
		action,
		fileName = "file",
		method = "POST",
		acceptFile = "*",
		fileResponseName = "url",
		changeFileButtonText = "Alterar arquivo",
		selectFileButtonText = "Selecionar arquivo",
		dropFileText = "Ou arraste e solte o arquivo aqui",
		onChange,
		disabled = false,
	} = props;

	const { fieldErrors } = useForm();
	const fieldError = fieldErrors?.[name];

	const [value, setValue] = useState("");
	const [error, setError] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	async function handleUploadFile(file: File) {
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
				setError("Erro ao enviar o arquivo");
			})
			.finally(() => setIsLoading(false));
	}

	function handleSelectFile(file: File) {
		if (disabled) return;
		handleUploadFile(file);
	}

	const errorMessage = fieldError || error;

	const hasErrorClassName = errorMessage ? "hasError" : "noHasError";
	const hasFileClassName = file ? "hasFile" : "noHasFile";
	const className = `arkynFileUpload ${hasErrorClassName} ${hasFileClassName}`;

	return (
		<FieldWrapper>
			{label && <FieldLabel showAsterisk={showAsterisk}>{label}</FieldLabel>}

			<div className={className}>
				<input type="hidden" name={name} value={value || ""} />

				{!file && (
					<NoFileContent
						disabled={disabled}
						isLoading={isLoading}
						acceptFile={acceptFile}
						dropFileText={dropFileText}
						handleSelectFile={handleSelectFile}
						selectFileButtonText={selectFileButtonText}
					/>
				)}

				{file && (
					<HasFileContent
						disabled={disabled}
						isLoading={isLoading}
						acceptFile={acceptFile}
						file={file}
						handleSelectFile={handleSelectFile}
						changeFileButtonText={changeFileButtonText}
						reSendFile={
							errorMessage && file ? () => handleUploadFile(file) : undefined
						}
					/>
				)}
			</div>

			{errorMessage && <FieldError>{errorMessage}</FieldError>}
		</FieldWrapper>
	);
}

export { FileUpload };
