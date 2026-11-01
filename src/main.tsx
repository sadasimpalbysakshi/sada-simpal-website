import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { CartProvider } from "@/contexts/CartContext";

// After a new version of the site is published, a page that was already open can
// ask for files that no longer exist. Reload once to pick up the new version.
window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  try {
    const last = Number(sessionStorage.getItem("sadasimpal-reloaded") ?? 0);
    if (Date.now() - last < 10_000) return; // don't loop
    sessionStorage.setItem("sadasimpal-reloaded", String(Date.now()));
  } catch {
    /* private mode */
  }
  window.location.reload();
});

// BrowserRouter = clean URLs like /product/b1 (needs the host to serve index.html
// for every path — see public/_redirects).
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
  </React.StrictMode>
);
