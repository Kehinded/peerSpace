// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { ActionContextProvider } from "./context/ActionContext.tsx";

createRoot(document.getElementById("root")!).render(

    <ActionContextProvider>
      <BrowserRouter>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </BrowserRouter>
    </ActionContextProvider>

);
