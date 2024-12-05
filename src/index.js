import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from 'contexts/AuthContext';

const faviconUrl = `${process.env.PUBLIC_URL}/favicon.ico`;
const manifestUrl = `${process.env.PUBLIC_URL}/manifest.json`;

document.querySelector("link[rel='icon']").setAttribute('href', faviconUrl);
document.querySelector("link[rel='apple-touch-icon']").setAttribute('href', faviconUrl);
document.querySelector("link[rel='manifest']").setAttribute('href', manifestUrl);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
