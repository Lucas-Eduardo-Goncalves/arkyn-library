import { BadgeExamples } from "./components/examples.badge";
import { ButtonExamples } from "./components/examples.button";

function App() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 40, padding: 40 }}
    >
      <BadgeExamples />
      <ButtonExamples />
    </div>
  );
}

export { App };
