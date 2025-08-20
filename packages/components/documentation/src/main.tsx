import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";

import "../css/reset.css";
import "../css/variables.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
