import { useState } from "react";

import { useForm } from "../../hooks/useForm";
import { FieldError } from "../fieldError";
import { FieldLabel } from "../fieldLabel";
import { FieldWrapper } from "../fieldWrapper";

import { HasFileContent } from "./hasFileContent";
import { NoFileContent } from "./noFileContent";
import "./styles.css";

type AudioUploadProps = {
  name: string;
  action: string;

  fileName?: string;
  method?: string;

  acceptAudio?: string;
  dropAudioText?: string;
  selectAudioButtonText?: string;
  changeAudioButtonText?: string;

  onChange?: (url?: string) => void;
  fileResponseName?: string;

  label?: string;
  showAsterisk?: boolean;

  disabled?: boolean;
  defaultValue?: string;
};

/**
 * AudioUpload component - handles audio file upload with drag & drop functionality and server upload
 *
 * @param props - AudioUpload component properties
 * @param props.name - Required field name for form handling
 * @param props.action - Required server endpoint URL for file upload
 * @param props.fileName - Name of the file field in FormData. Default: "file"
 * @param props.method - HTTP method for upload request. Default: "POST"
 * @param props.acceptAudio - Audio file types to accept. Default: "audio/*"
 * @param props.dropAudioText - Text displayed in drop zone. Default: "Ou arraste e solte um arquivo de áudio aqui"
 * @param props.selectAudioButtonText - Text for file selection button. Default: "Selecionar arquivo de áudio"
 * @param props.changeAudioButtonText - Text for change file button. Default: "Trocar arquivo de áudio"
 * @param props.onChange - Callback function called after successful upload with the file URL
 * @param props.fileResponseName - Name of the URL field in server response. Default: "url"
 * @param props.label - Optional label text to display above the upload area
 * @param props.showAsterisk - Whether to show asterisk on label for required fields. Default: false
 * @param props.disabled - Whether the upload is disabled. Default: false
 * @param props.defaultValue - Default audio URL value
 *
 * @returns AudioUpload JSX element with drag & drop zone or audio preview
 *
 * @example
 * ```tsx
 * // Basic audio upload
 * <AudioUpload
 *   name="audio"
 *   action="/api/upload"
 * />
 *
 * // Audio upload with label and custom texts
 * <AudioUpload
 *   name="podcast"
 *   action="/api/upload/podcast"
 *   label="Upload Podcast"
 *   showAsterisk
 *   selectAudioButtonText="Choose Audio File"
 *   dropAudioText="Drop your audio file here"
 *   changeAudioButtonText="Change Audio"
 * />
 *
 * // Audio upload with callback and custom settings
 * <AudioUpload
 *   name="recording"
 *   action="/api/upload"
 *   label="Voice Recording"
 *   acceptAudio="audio/mp3,audio/wav"
 *   onChange={(url) => console.log('Uploaded:', url)}
 *   fileResponseName="audioUrl"
 *   fileName="recording"
 *   method="PUT"
 * />
 *
 * // Disabled audio upload with default value
 * <AudioUpload
 *   name="preview"
 *   action="/api/upload"
 *   disabled
 *   defaultValue="/path/to/audio.mp3"
 *   label="Audio Preview"
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
