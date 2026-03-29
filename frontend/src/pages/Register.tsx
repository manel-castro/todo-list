import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "../services/axiosClient";
import {
  Container,
  TextField,
  Button,
  Box,
  Link,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";

type RegisterForm = { username: string; password: string; confirm: string };

export default function Register(): JSX.Element {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ mode: "onChange" });

  const submit = async (data: RegisterForm) => {
    setError(null);
    try {
      await axios.post(
        "/api/auth/register",
        { username: data.username, password: data.password },
        { withCredentials: true },
      );
      navigate("/");
    } catch (err: any) {
      const backendMsg =
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message;
      setError(backendMsg || err?.message || "Registration failed");
    }
  };

  const password = watch("password");

  return (
    <Container
      maxWidth={false}
      className="page-container"
      sx={{ maxWidth: 400, mx: "auto" }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Register
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
        <TextField
          label="Confirm Password"
          type="password"
          {...register("confirm", {
            required: "Please confirm your password",
            validate: (v) => v === password || "Passwords do not match",
          })}
          error={!!errors.confirm}
          helperText={errors.confirm?.message}
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          Register
        </Button>
        <Stack direction="row" justifyContent="center">
          <Typography variant="body2">
            Do you already have an account?{" "}
            <Link component={RouterLink} to="/login" underline="hover">
              Login now.
            </Link>
          </Typography>
        </Stack>
      </Box>
    </Container>
  );
}
