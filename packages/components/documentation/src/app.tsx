import { useAutomation, useToast } from "@components";
import { Success } from "./a/success";
import { errorHandler } from "./a/errorHandler";

function App() {
  function deuRuim() {
    try {
      throw new Success("Deu ruim", { type: "success", message: "Deu ruim" });
    } catch (error) {
      const a = errorHandler(error);
      return a;
    }
  }

  console.log(deuRuim());
  useAutomation(deuRuim());

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 40, padding: 40 }}
    >
      <button children="A" onClick={deuRuim} />
    </div>
  );
}

export { App };
