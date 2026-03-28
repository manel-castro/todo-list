import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";

export default function Login(): JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post(
        "/api/auth/login",
        { username, password },
        { withCredentials: true },
      );
      navigate("/");
    } catch (err: any) {
      const backendMsg =
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message;
      setError(backendMsg || err?.message || "Login failed");
    }
  };

  return (
    <Container sx={{ mt: 8, maxWidth: "400px" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <Box component="form" onSubmit={submit} sx={{ display: "grid", gap: 2 }}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained">
          Sign in
        </Button>
      </Box>
    </Container>
  );
}
