import { PhoneInput } from "@components";

function App() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 40, padding: 40 }}
    >
      <PhoneInput name="phone" label="Phone Input" />
    </div>
  );
}

export { App };
