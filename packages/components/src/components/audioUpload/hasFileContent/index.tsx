import { RefreshCw } from "lucide-react";

import { AudioPlayer } from "../../audioPlayer";
import { Button } from "../../button";
import { Divider } from "../../divider";
import { IconButton } from "../../iconButton";
import { Tooltip } from "../../tooltip";

import "./styles.css";

type HasFileContentProps = {
  filePath: string;
  disabled: boolean;
  acceptAudio: string;
  isLoading: boolean;
  handleSelectFile: (file: File) => void;
  reSendAudio?: () => void;
  changeAudioButtonText: string;
};

function HasFileContent(props: HasFileContentProps) {
  const {
    filePath,
    disabled,
    acceptAudio,
    handleSelectFile,
    isLoading,
    reSendAudio,
    changeAudioButtonText,
  } = props;

  function handleClick() {
    if (disabled) return;

    const input = document.createElement("input");

    input.type = "file";
    input.accept = acceptAudio;

    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) handleSelectFile(file);
    };

    input.click();
  }

  return (
    <div className="arkynAudioUploadHasFileContentContainer">
      <AudioPlayer src={filePath} />
      <Divider />

      <div className="arkynAudioUploadButtonsContainer">
        {!!reSendAudio && (
          <Tooltip orientation="bottom" text="Reenviar áudio">
            <IconButton
              type="button"
              aria-label="resend image"
              variant="outline"
              scheme="danger"
              size="sm"
              isLoading={isLoading}
              onClick={reSendAudio}
              icon={RefreshCw}
              disabled={disabled}
            />
          </Tooltip>
        )}

        <Button
          isLoading={isLoading}
          onClick={handleClick}
          variant="outline"
          size="sm"
          type="button"
          disabled={disabled}
        >
          {changeAudioButtonText}
        </Button>
      </div>
    </div>
  );
}

export { HasFileContent };
