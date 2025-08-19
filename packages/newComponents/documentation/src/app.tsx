import { AlertExamples } from "./components/examples.alert";
import { AudioPlayerExamples } from "./components/examples.audioPlayer";
import { BadgeExamples } from "./components/examples.badge";
import { ButtonExamples } from "./components/examples.button";
import { CardTabExamples } from "./components/examples.cardTab";
import { DividerExamples } from "./components/examples.divider";
import { DrawerExamples } from "./components/examples.drawer";
import { IconButtonExamples } from "./components/examples.iconButton";
import { InputExamples } from "./components/examples.input";
import { MaskedInputExamples } from "./components/examples.maskedInput";
import { ModalExamples } from "./components/examples.modal";
import { SliderExamples } from "./components/examples.slider";
import { TabExamples } from "./components/examples.tab";
import { TooltipExamples } from "./components/examples.tooltip";

function App() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 40, padding: 40 }}
    >
      <AlertExamples />
      <AudioPlayerExamples />
      <BadgeExamples />
      <ButtonExamples />
      <CardTabExamples />
      <DividerExamples />
      <DrawerExamples />
      <IconButtonExamples />
      <InputExamples />
      <MaskedInputExamples />
      <ModalExamples />
      <SliderExamples />
      <TabExamples />
      <TooltipExamples />
    </div>
  );
}

export { App };
