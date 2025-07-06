import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ActionContextProvider } from "./context/ActionContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ActionContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ActionContextProvider>
  </StrictMode>
);
