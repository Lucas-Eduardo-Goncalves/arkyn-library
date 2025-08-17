import { AlertExamples } from "./components/examples.alert";
import { BadgeExamples } from "./components/examples.badge";
import { ButtonExamples } from "./components/examples.button";
import { DividerExamples } from "./components/examples.divider";
import { DrawerExamples } from "./components/examples.drawer";
import { IconButtonExamples } from "./components/examples.iconButton";
import { SliderExamples } from "./components/examples.slider";

function App() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 40, padding: 40 }}
    >
      <AlertExamples />
      <BadgeExamples />
      <ButtonExamples />
      <DividerExamples />
      <DrawerExamples />
      <IconButtonExamples />
      <SliderExamples />
    </div>
  );
}

export { App };
