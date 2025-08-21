import { MultiSelect } from "@components";
import { useState } from "react";
import { AlertExamples } from "./components/examples.alert";
import { AudioPlayerExamples } from "./components/examples.audioPlayer";
import { AudioUploadExamples } from "./components/examples.audioUpload";
import { BadgeExamples } from "./components/examples.badge";
import { ButtonExamples } from "./components/examples.button";
import { CardTabExamples } from "./components/examples.cardTab";
import { CheckboxExamples } from "./components/examples.checkbox";
import { CurrencyInputExamples } from "./components/examples.currencyInput";
import { DividerExamples } from "./components/examples.divider";
import { DrawerExamples } from "./components/examples.drawer";
import { FileUploadExamples } from "./components/examples.fileUpload";
import { IconButtonExamples } from "./components/examples.iconButton";
import { InputExamples } from "./components/examples.input";
import { MaskedInputExamples } from "./components/examples.maskedInput";
import { ModalExamples } from "./components/examples.modal";
import { MultiSelectExamples } from "./components/examples.multiSelect";
import { PhoneInputExamples } from "./components/examples.phoneInput";
import { RadioExamples } from "./components/examples.radio";
import { SliderExamples } from "./components/examples.slider";
import { SwitchExamples } from "./components/examples.switch";
import { TabExamples } from "./components/examples.tab";
import { TextareaExamples } from "./components/examples.texarea";
import { TooltipExamples } from "./components/examples.tooltip";

function App() {
  const [selectedOption, setSelectedOption] = useState<string[]>([]);

  const options = [
    { label: "Alert", value: "alert" },
    { label: "AudioPlayer", value: "audio-player" },
    { label: "AudioUpload", value: "audio-upload" },
    { label: "Badge", value: "badge" },
    { label: "Button", value: "button" },
    { label: "CardTab", value: "card-tab" },
    { label: "Checkbox", value: "checkbox" },
    { label: "CurrencyInput", value: "currency-input" },
    { label: "Divider", value: "divider" },
    { label: "Drawer", value: "drawer" },
    { label: "FileUpload", value: "file-upload" },
    { label: "IconButton", value: "icon-button" },
    { label: "Input", value: "input" },
    { label: "MaskedInput", value: "masked-input" },
    { label: "Modal", value: "modal" },
    { label: "MultiSelect", value: "multi-select" },
    { label: "PhoneInput", value: "phone-input" },
    { label: "Radio", value: "radio" },
    { label: "Slider", value: "slider" },
    { label: "Switch", value: "switch" },
    { label: "Tab", value: "tab" },
    { label: "Textarea", value: "textarea" },
    { label: "Tooltip", value: "tooltip" },
  ];

  function showExamples(value: string): boolean {
    return selectedOption.includes(value);
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 40, padding: 40 }}
    >
      <MultiSelect
        isSearchable
        label="Select the examples:"
        name="selectedOptions"
        options={options}
        onChange={setSelectedOption}
      />

      {showExamples("alert") && <AlertExamples />}
      {showExamples("audio-player") && <AudioPlayerExamples />}
      {showExamples("audio-upload") && <AudioUploadExamples />}
      {showExamples("badge") && <BadgeExamples />}
      {showExamples("button") && <ButtonExamples />}
      {showExamples("card-tab") && <CardTabExamples />}
      {showExamples("checkbox") && <CheckboxExamples />}
      {showExamples("currency-input") && <CurrencyInputExamples />}
      {showExamples("divider") && <DividerExamples />}
      {showExamples("drawer") && <DrawerExamples />}
      {showExamples("file-upload") && <FileUploadExamples />}
      {showExamples("icon-button") && <IconButtonExamples />}
      {showExamples("input") && <InputExamples />}
      {showExamples("masked-input") && <MaskedInputExamples />}
      {showExamples("modal") && <ModalExamples />}
      {showExamples("multi-select") && <MultiSelectExamples />}
      {showExamples("phone-input") && <PhoneInputExamples />}
      {showExamples("radio") && <RadioExamples />}
      {showExamples("slider") && <SliderExamples />}
      {showExamples("switch") && <SwitchExamples />}
      {showExamples("tab") && <TabExamples />}
      {showExamples("textarea") && <TextareaExamples />}
      {showExamples("tooltip") && <TooltipExamples />}
    </div>
  );
}

export { App };
