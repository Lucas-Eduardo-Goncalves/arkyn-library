import { useState } from "react";

import { useForm } from "../../hooks/useForm";
import { FieldError } from "../fieldError";
import { FieldLabel } from "../fieldLabel";
import { FieldWrapper } from "../fieldWrapper";

import { HasFileContent } from "./hasFileContent";
import { NoFileContent } from "./noFileContent";
import "./styles.css";

type AudioUploadProps = {
  /** Field name for form submission (stores the uploaded audio URL). Required. */
  name: string;
  /** Server endpoint URL that receives the `multipart/form-data` upload request. Required. */
  action: string;
  /** Form-data field name used for the file. @default "file" */
  fileName?: string;
  /** HTTP method for the upload request. @default "POST" */
  method?: string;
  /** Accepted audio MIME types or extensions (e.g. `"audio/mp3,audio/wav"`). @default "audio/*" */
  acceptAudio?: string;
  /** Text displayed in the drag-and-drop zone. @default "Ou arraste e solte um arquivo de áudio aqui" */
  dropAudioText?: string;
  /** Label for the file-picker button before a file is selected. @default "Selecionar arquivo de áudio" */
  selectAudioButtonText?: string;
  /** Label for the file-picker button after a file is selected. @default "Trocar arquivo de áudio" */
  changeAudioButtonText?: string;
  /** Callback fired after a successful upload. Receives the URL returned by the server. */
  onChange?: (url?: string) => void;
  /** Property name in the server response that contains the file URL. @default "url" */
  fileResponseName?: string;
  /** Optional label text displayed above the upload area. */
  label?: string;
  /** Displays an asterisk on the label to signal a required field. @default false */
  showAsterisk?: boolean;
  /** Disables file selection and upload. @default false */
  disabled?: boolean;
  /** Pre-populated audio URL (e.g. an existing recording). @default "" */
  defaultValue?: string;
};

/**
 * AudioUpload — drag-and-drop audio file uploader with server upload and playback preview.
 *
 * Sends the file via `fetch` as `multipart/form-data` and stores the returned URL
 * in a hidden `<input>` for form submission.
 * Integrates with `useForm` to display validation errors by field name.
 *
 * @param props.name - Field name for form submission. Required.
 * @param props.action - Upload endpoint URL. Required.
 * @param props.fileName - Form-data field name for the file. Default: "file"
 * @param props.method - HTTP method. Default: "POST"
 * @param props.acceptAudio - Accepted MIME types / extensions. Default: "audio/*"
 * @param props.onChange - Callback fired after a successful upload — receives the audio URL.
 * @param props.fileResponseName - Server response property containing the URL. Default: "url"
 * @param props.label - Label text displayed above the upload area.
 * @param props.showAsterisk - Appends `*` to the label. Default: false
 * @param props.disabled - Disables file selection and upload. Default: false
 * @param props.defaultValue - Pre-populated audio URL.
 *
 * @returns AudioUpload JSX element wrapped in `FieldWrapper`.
 *
 * @example
 * ```tsx
 * // Basic
 * <AudioUpload name="audio" action="/api/upload" />
 *
 * // With label and custom texts
 * <AudioUpload
 *   name="podcast"
 *   action="/api/upload/podcast"
 *   label="Podcast Episode"
 *   showAsterisk
 *   selectAudioButtonText="Choose audio file"
 *   onChange={(url) => setPodcastUrl(url)}
 * />
 * ```
 */

function AudioUpload(props: AudioUploadProps) {
  const {
    name,
    label,
    fileName = "file",
    method = "POST",
    onChange,
    fileResponseName = "url",
    selectAudioButtonText = "Selecionar arquivo de áudio",
    dropAudioText = "Ou arraste e solte um arquivo de áudio aqui",
    changeAudioButtonText = "Trocar arquivo de áudio",
    acceptAudio = "audio/*",
    action,
    defaultValue = "",
    showAsterisk = false,
    disabled = false,
  } = props;

  const { fieldErrors } = useForm();
  const fieldError = fieldErrors?.[name];

  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePath, setFilePath] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);

  async function handleUploadAudio(file: File) {
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
        setError("Erro ao enviar audio");
      })
      .finally(() => setIsLoading(false));
  }

  function handleSelectFile(file: File) {
    if (disabled) return;

    if (file.type.indexOf("audio") === -1) {
      setError("O arquivo selecionado não é um arquivo de áudio");
      return;
    }

    setFilePath(URL.createObjectURL(file));
    handleUploadAudio(file);
  }

  const errorMessage = fieldError || error;

  const hasErrorClassName = errorMessage ? "hasError" : "noHasError";
  const hasImageClassName = filePath ? "hasAudio" : "noHasAudio";
  const className = `arkynAudioUpload ${hasErrorClassName} ${hasImageClassName}`;

  return (
    <FieldWrapper>
      {label && <FieldLabel showAsterisk={showAsterisk}>{label}</FieldLabel>}

      <div className={className}>
        <input type="hidden" name={name} value={value || ""} />

        {!filePath && (
          <NoFileContent
            disabled={disabled}
            isLoading={isLoading}
            acceptAudio={acceptAudio}
            dropAudioText={dropAudioText}
            handleSelectFile={handleSelectFile}
            selectAudioButtonText={selectAudioButtonText}
          />
        )}

        {filePath && (
          <HasFileContent
            filePath={filePath}
            acceptAudio={acceptAudio}
            changeAudioButtonText={changeAudioButtonText}
            disabled={disabled}
            handleSelectFile={handleSelectFile}
            isLoading={isLoading}
            reSendAudio={
              !!errorMessage && file ? () => handleUploadAudio(file) : undefined
            }
          />
        )}
      </div>

      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </FieldWrapper>
  );
}

export { AudioUpload };
