import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthCheck from "./pages/AuthCheck";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Todos from "./pages/Todos";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import { TodosProvider } from "./contexts/TodosContext";

import "./styles.css";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TodosProvider>
        <BrowserRouter>
          <div style={{ overflowY: "auto", height: "100dvh" }}>
            <Navbar />
            <Routes>
              <Route path="/" element={<AuthCheck />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/todos" element={<Todos />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TodosProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
