import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { TodosProvider } from "./contexts/TodosContext";
import AuthCheck from "./pages/AuthCheck";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Todos from "./pages/Todos";
import theme from "./theme";

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
