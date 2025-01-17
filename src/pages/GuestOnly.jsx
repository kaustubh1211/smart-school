import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GuestOnly({ children }) {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (accessToken) {
      navigate("/dashboard"); // Redirect to home or another page if the user is logged in
    }
  }, [accessToken, navigate]);

  return <>{children}</>;
}

export default GuestOnly;
