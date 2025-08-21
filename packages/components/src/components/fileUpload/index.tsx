import { useState } from "react";

import { useForm } from "../../hooks/useForm";
import { FieldError } from "../fieldError";
import { FieldLabel } from "../fieldLabel";
import { FieldWrapper } from "../fieldWrapper";

import { HasFileContent } from "./hasFileContent";
import { NoFileContent } from "./noFileContent";
import "./styles.css";

type FileUploadProps = {
  name: string;
  action: string;

  disabled?: boolean;

  label?: string;
  showAsterisk?: boolean;

  changeFileButtonText?: string;
  selectFileButtonText?: string;
  dropFileText?: string;

  method?: string;
  fileName?: string;
  fileResponseName?: string;
  acceptFile?: string;

  onChange?: (url?: string) => void;
};

/**
 * FileUpload component - used for uploading files with drag and drop functionality
 *
 * @param props - FileUpload component properties
 * @param props.name - Required field name for form handling
 * @param props.action - Required endpoint URL where the file will be uploaded
 * @param props.disabled - Whether the file upload is disabled. Default: false
 * @param props.label - Optional label text to display above the file upload area
 * @param props.showAsterisk - Whether to show asterisk on label for required fields. Default: false
 * @param props.changeFileButtonText - Text for the button to change/replace an uploaded file. Default: "Alterar arquivo"
 * @param props.selectFileButtonText - Text for the button to select a file. Default: "Selecionar arquivo"
 * @param props.dropFileText - Text displayed in the drop zone area. Default: "Ou arraste e solte o arquivo aqui"
 * @param props.method - HTTP method for the upload request. Default: "POST"
 * @param props.fileName - Form data field name for the file. Default: "file"
 * @param props.fileResponseName - Property name in the response object containing the file URL. Default: "url"
 * @param props.acceptFile - File types accepted by the input (e.g., "image/*", ".pdf"). Default: "*"
 * @param props.onChange - Callback function called when file upload completes successfully, receives the file URL
 *
 * @returns FileUpload JSX element wrapped in FieldGroup with optional label and error handling
 *
 * @example
 * ```tsx
 * // Basic file upload
 * <FileUpload
 *   name="document"
 *   action="/api/upload"
 * />
 *
 * // File upload with label and custom text
 * <FileUpload
 *   name="avatar"
 *   action="/api/upload/avatar"
 *   label="Profile Picture"
 *   showAsterisk
 *   selectFileButtonText="Choose Image"
 *   changeFileButtonText="Change Image"
 *   dropFileText="Drop your image here"
 * />
 *
 * // File upload with restrictions and callback
 * <FileUpload
 *   name="pdf"
 *   action="/api/upload/document"
 *   label="Upload PDF Document"
 *   acceptFile=".pdf"
 *   fileName="document"
 *   fileResponseName="documentUrl"
 *   onChange={(url) => console.log('File uploaded:', url)}
 * />
 *
 * // Disabled file upload
 * <FileUpload
 *   name="attachment"
 *   action="/api/upload"
 *   label="Attachment"
 *   disabled
 * />
 *
 * // File upload with custom HTTP method and response handling
 * <FileUpload
 *   name="file"
 *   action="/api/files"
 *   method="PUT"
 *   fileName="uploadedFile"
 *   fileResponseName="fileUrl"
 *   label="Custom Upload"
 *   onChange={(url) => {
 *     if (url) {
 *       setFileUrl(url);
 *       console.log('Upload successful:', url);
 *     }
 *   }}
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
        if (!!response?.error) setError(response.error);
        else setValue(response?.[fileResponseName]);
        onChange && onChange(response?.[fileResponseName]);
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
              !!errorMessage && file ? () => handleUploadFile(file) : undefined
            }
          />
        )}
      </div>

      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </FieldWrapper>
  );
}

export { FileUpload };
