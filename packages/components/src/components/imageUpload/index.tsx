import { useState } from "react";

import { useForm } from "../../hooks/useForm";
import { FieldError } from "../fieldError";
import { FieldLabel } from "../fieldLabel";
import { FieldWrapper } from "../fieldWrapper";

import { HasFileContent } from "./hasFileContent";
import { NoFileContent } from "./noFileContent";
import "./styles.css";

type ImageUploadProps = {
  name: string;
  action: string;
  defaultValue?: string | null;
  className?: string;

  disabled?: boolean;

  label?: string;
  showAsterisk?: boolean;

  changeImageButtonText?: string;
  selectImageButtonText?: string;
  dropImageText?: string;

  method?: string;
  fileName?: string;
  fileResponseName?: string;
  acceptImage?: string;

  onChange?: (url?: string) => void;
};

/**
 * ImageUpload component - specialized file upload component for image files with preview functionality
 *
 * @param props - ImageUpload component properties
 * @param props.name - Required field name for form handling
 * @param props.defaultValue - Initial image URL to display as preview. Default: ""
 * @param props.disabled - Whether the image upload is disabled. Default: false
 * @param props.className - Additional class name(s) for the wrapper element
 * @param props.label - Optional label text to display above the image upload area
 * @param props.showAsterisk - Whether to show asterisk on label for required fields. Default: false
 * @param props.changeImageButtonText - Text for the button to change/replace an uploaded image. Default: "Alterar imagem"
 * @param props.selectImageButtonText - Text for the button to select an image. Default: "Selecionar imagem"
 * @param props.dropImageText - Text displayed in the drop zone area. Default: "Ou arraste e solte a imagem aqui"
 * @param props.action - Required endpoint URL where the image will be uploaded
 * @param props.method - HTTP method for the upload request. Default: "POST"
 * @param props.fileName - Form data field name for the image file. Default: "file"
 * @param props.fileResponseName - Property name in the response object containing the image URL. Default: "url"
 * @param props.acceptImage - Image file types accepted by the input (e.g., "image/*", ".jpg,.png"). Default: "image/*"
 * @param props.onChange - Callback function called when image upload completes successfully, receives the image URL
 *
 * @returns ImageUpload JSX element wrapped in FieldGroup with optional label, image preview, and error handling
 *
 * @example
 * ```tsx
 * // Basic image upload
 * <ImageUpload
 *   name="avatar"
 *   action="/api/upload/image"
 * />
 *
 * // Image upload with label and custom text
 * <ImageUpload
 *   name="profilePicture"
 *   action="/api/upload/avatar"
 *   label="Profile Picture"
 *   showAsterisk
 *   selectImageButtonText="Choose Photo"
 *   changeImageButtonText="Change Photo"
 *   dropImageText="Drop your photo here"
 * />
 *
 * // Image upload with default value and restrictions
 * <ImageUpload
 *   name="productImage"
 *   action="/api/upload/product"
 *   label="Product Image"
 *   defaultValue="https://example.com/default-image.jpg"
 *   acceptImage=".jpg,.jpeg,.png,.webp"
 *   fileName="productImage"
 *   fileResponseName="imageUrl"
 *   onChange={(url) => console.log('Image uploaded:', url)}
 * />
 *
 * // Disabled image upload with existing image
 * <ImageUpload
 *   name="banner"
 *   action="/api/upload/banner"
 *   label="Banner Image"
 *   defaultValue="https://example.com/banner.jpg"
 *   disabled
 * />
 *
 * // Image upload with custom HTTP method and response handling
 * <ImageUpload
 *   name="gallery"
 *   action="/api/images"
 *   method="PUT"
 *   fileName="galleryImage"
 *   fileResponseName="imageUrl"
 *   label="Gallery Image"
 *   acceptImage="image/jpeg,image/png"
 *   onChange={(url) => {
 *     if (url) {
 *       setImageUrl(url);
 *       console.log('Upload successful:', url);
 *     }
 *   }}
 * />
 *
 * // Image upload for user avatar with form integration
 * <ImageUpload
 *   name="userAvatar"
 *   action="/api/users/avatar"
 *   label="User Avatar"
 *   showAsterisk
 *   defaultValue={user?.avatarUrl}
 *   selectImageButtonText="Select Avatar"
 *   changeImageButtonText="Update Avatar"
 *   dropImageText="Drop avatar image here"
 *   onChange={(avatarUrl) => {
 *     updateUserProfile({ avatarUrl });
 *   }}
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
        if (!!response?.error) setError(response.error);
        else setValue(response?.[fileResponseName]);
        onChange && onChange(response?.[fileResponseName]);
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
    <FieldWrapper className={wrapperClassName}>
      {label && <FieldLabel showAsterisk={showAsterisk}>{label}</FieldLabel>}

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
              !!errorMessage && file ? () => handleUploadImage(file) : undefined
            }
          />
        )}
      </div>

      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </FieldWrapper>
  );
}

export { ImageUpload };
