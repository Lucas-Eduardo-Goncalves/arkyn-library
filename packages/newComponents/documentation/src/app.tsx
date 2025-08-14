import { AlertExamples } from "./components/examples.alert";
import { BadgeExamples } from "./components/examples.badge";
import { ButtonExamples } from "./components/examples.button";
import { IconButtonExamples } from "./components/examples.iconButton";

function App() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 40, padding: 40 }}
    >
      <AlertExamples />
      <BadgeExamples />
      <ButtonExamples />
      <IconButtonExamples />
    </div>
  );
}

export { App };
