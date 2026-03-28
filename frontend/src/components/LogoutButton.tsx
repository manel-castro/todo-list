import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      setLoading(false);
      navigate("/login");
    } catch (e) {
      const err: any = e;
      const backendMsg =
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message;
      const msg = backendMsg || err?.message || "Logout failed";
      // show user-facing alert
      // eslint-disable-next-line no-alert
      alert(msg);
      setLoading(false);
    }
  };

  return (
    <Button color="inherit" onClick={handleLogout} disabled={loading}>
      {loading ? <CircularProgress color="inherit" size={20} /> : "Logout"}
    </Button>
  );
}
