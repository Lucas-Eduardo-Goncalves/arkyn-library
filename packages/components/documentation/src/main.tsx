import { ModalProvider } from "../../src/providers/modalProvider";
import { ToastProvider } from "../../src/providers/toastProvider";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";

import "../css/reset.css";
import "../css/variables.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ModalProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ModalProvider>
  </StrictMode>,
);
