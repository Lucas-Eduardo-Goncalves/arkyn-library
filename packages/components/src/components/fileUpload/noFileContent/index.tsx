import { DragEvent } from "react";

import { Button } from "../../button";

import "./styles.css";

type NoFileContentProps = {
  disabled: boolean;
  acceptFile: string;
  isLoading: boolean;
  selectFileButtonText: string;
  dropFileText: string;
  handleSelectFile: (file: File) => void;
};

function NoFileContent(props: NoFileContentProps) {
  const {
    dropFileText,
    isLoading,
    acceptFile,
    handleSelectFile,
    selectFileButtonText,
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
    input.accept = acceptFile;

    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) handleSelectFile(file);
    };

    input.click();
  }

  return (
    <div onDrop={handleDrop} className="arkynFileUploadNoFileContent">
      <Button
        isLoading={isLoading}
        onClick={handleClick}
        variant="ghost"
        size="sm"
        type="button"
        disabled={disabled}
      >
        {selectFileButtonText}
      </Button>

      <p>{dropFileText}</p>
    </div>
  );
}

export { NoFileContent };
