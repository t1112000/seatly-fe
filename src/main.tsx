import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!clientId) {
  throw new Error("Missing VITE_GOOGLE_CLIENT_ID environment variable");
}

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider
    clientId={clientId}
    children={
      <BrowserRouter>
        <App />
      </BrowserRouter>
    }
  />
);
