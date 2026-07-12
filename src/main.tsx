import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ProgressProvider } from "./progress";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ProgressProvider>
      <App />
    </ProgressProvider>
  </React.StrictMode>
);
