import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import "./styles/global.css";

createRoot(

document.getElementById("root")

).render(

<StrictMode>

<AuthProvider>

<App/>

<ToastContainer

position="top-right"

autoClose={2500}

/>

</AuthProvider>

</StrictMode>

);