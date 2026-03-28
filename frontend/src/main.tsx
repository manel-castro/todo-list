import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthCheck from "./pages/AuthCheck";
import Login from "./pages/Login";
import Todos from "./pages/Todos";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

import "./styles.css";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<AuthCheck />} />
          <Route path="/login" element={<Login />} />
          <Route path="/todos" element={<Todos />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
