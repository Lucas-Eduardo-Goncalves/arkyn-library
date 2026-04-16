import { RichText } from "../../src/components/richText";

function App() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 40, padding: 40 }}
    >
      <h1>alo</h1>
      <RichText name="aa" hiddenButtons={[]} />
    </div>
  );
}

export { App };
