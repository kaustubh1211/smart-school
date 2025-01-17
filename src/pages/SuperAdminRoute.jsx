import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SuperAdminRoute({ children }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role != "SUPER_ADMIN") {
      navigate("/dashboard");
    }
  }, [role]);

  return <>{children}</>;
}
