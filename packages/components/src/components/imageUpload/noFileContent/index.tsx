import { DragEvent } from "react";

import { Button } from "../../button";
import "./styles.css";

type NoFileContentProps = {
  disabled: boolean;
  acceptImage: string;
  isLoading: boolean;
  selectImageButtonText: string;
  dropImageText: string;
  handleSelectFile: (file: File) => void;
};

function NoFileContent(props: NoFileContentProps) {
  const {
    dropImageText,
    isLoading,
    acceptImage,
    handleSelectFile,
    selectImageButtonText,
    disabled,
  } = props;

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    if (disabled) return;

    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) handleSelectFile(file);
  }

  function handleClick() {
    if (disabled) return;

    const input = document.createElement("input");

    input.type = "file";
    input.accept = acceptImage;

    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) handleSelectFile(file);
    };

    input.click();
  }

  return (
    <div onDrop={handleDrop} className="arkynImageUploadNoFileContent">
      <Button
        isLoading={isLoading}
        onClick={handleClick}
        variant="ghost"
        size="sm"
        type="button"
        disabled={disabled}
      >
        {selectImageButtonText}
      </Button>

      <p>{dropImageText}</p>
    </div>
  );
}

export { NoFileContent };
