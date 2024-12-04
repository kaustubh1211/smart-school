import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UserAuth({ children }) {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!accessToken) {
      navigate("/sign-in");
      return;
    }
  }, [accessToken]);
  return <>{children}</>;
}

export default UserAuth;
