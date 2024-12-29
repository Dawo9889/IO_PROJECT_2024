import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './index.css';
import React from "react";
import App from "./App";
import { AuthProvider } from "./Components/context/AuthProvider";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavbarUpdate from "./Components/Navbar/navbar-update";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <StrictMode>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <AuthProvider>
      <NavbarUpdate />
      <Routes>
        <Route path='/*' element={<div className="bg-project-dark"><App /></div>} />
      </Routes>
    </AuthProvider>
    </BrowserRouter>
    </QueryClientProvider>
    </StrictMode>
);