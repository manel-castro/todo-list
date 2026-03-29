import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/axiosClient";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import { Link, Stack } from "@mui/material";

export default function Login(): JSX.Element {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  type LoginForm = { username: string; password: string };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginForm>({
    mode: "onChange",
    defaultValues: { username: "", password: "" },
  });

  const submit = async (data: LoginForm) => {
    setError(null);
    try {
      await axios.post("/api/auth/login", {
        username: data.username,
        password: data.password,
      });
      navigate("/");
    } catch (err: any) {
      const backendMsg =
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message;
      setError(backendMsg || err?.message || "Login failed");
    }
  };

  return (
    <Container
      maxWidth={false}
      className="page-container"
      sx={{ maxWidth: 400, mx: "auto" }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(submit)}
        sx={{ display: "grid", gap: 2 }}
      >
        <TextField
          label="Username"
          {...register("username", { required: "Username is required" })}
          error={!!errors.username}
          helperText={errors.username?.message}
        />

        <TextField
          label="Password"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Minimum 6 characters" },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        {error && <Alert severity="error">{error}</Alert>}

        <Button type="submit" variant="contained" disabled={isSubmitting}>
          Sign in
        </Button>

        <Stack direction="row" justifyContent="center">
          <Typography variant="body2">
            You don't have an account?{" "}
            <Link component={RouterLink} to="/register" sx={{ mt: 1 }}>
              Register now.
            </Link>
          </Typography>
        </Stack>
      </Box>
    </Container>
  );
}
