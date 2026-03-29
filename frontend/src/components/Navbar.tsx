import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function Navbar(): JSX.Element {
  const location = useLocation();
  const authenticated = location.pathname === "/todos";

  return (
    <AppBar position="absolute" className="page-navbar">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography variant="h6" component="div">
          Todos App
        </Typography>
        {authenticated && <LogoutButton />}
      </Toolbar>
    </AppBar>
  );
}
