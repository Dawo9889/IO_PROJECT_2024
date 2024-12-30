import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./Components/context/AuthProvider";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from "react";
import App from "./App";
import Navbar from "./Components/Navbar/navbar";
import './index.css';

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <StrictMode>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path='/*' element={<div className="bg-project-dark"><App /></div>} />
      </Routes>
    </AuthProvider>
    </BrowserRouter>
    </QueryClientProvider>
    </StrictMode>
);