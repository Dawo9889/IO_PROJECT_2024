import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './index.css';
import React from "react";
import App from "./App";
import { AuthProvider } from "./Components/context/AuthProvider";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavbarDefault from './Components/Navbar/NavbarDefault'
import NavbarUpdate from "./Components/Navbar/navbar-update";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <NavbarUpdate />
      {/* <NavbarDefault /> */}
      <Routes>
        <Route path='/*' element={<App />} />
      </Routes>
    </AuthProvider>
    </BrowserRouter>
    </StrictMode>
);