import React from "react";
import { Container, Typography } from "@mui/material";

export default function Todos(): JSX.Element {
  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Todos
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        You are logged in. This page will list todos.
      </Typography>
      {/* Logout is handled in the Navbar */}
    </Container>
  );
}
