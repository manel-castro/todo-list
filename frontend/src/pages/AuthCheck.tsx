import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AuthCheck(): JSX.Element | null {
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      try {
        await axios.get("/api/auth/user-authenticated", {
          withCredentials: true,
        });
        navigate("/todos");
      } catch (e) {
        navigate("/login");
      }
    };

    check();
  }, [navigate]);

  return null;
}
