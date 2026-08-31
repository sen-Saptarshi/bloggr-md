import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "./components/theme-provider.tsx";

// Redirect legacy HashRouter links (/#/blog/x or #/x -> /x) so old shared
// URLs keep working after the switch to BrowserRouter + root-level slugs.
if (window.location.hash.startsWith("#/")) {
  const path = window.location.hash.slice(1);
  window.history.replaceState(null, "", path.replace(/^\/blog\//, "/"));
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
