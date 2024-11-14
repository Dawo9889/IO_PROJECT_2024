import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './index.css';
import React from "react";
import App from "./App";
import { AuthProvider } from "./Components/context/AuthProvider";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavbarDefault from './Components/Navbar/NavbarDefault'

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <NavbarDefault />
      <Routes>
        <Route path='/*' element={<App />} />
      </Routes>
    </AuthProvider>
    </BrowserRouter>
    </StrictMode>
);