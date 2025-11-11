import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ 
  to, 
  label = "Back", 
  className = "",
  showIcon = true,
  variant = "default" // "default", "outline", "text"
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      // Navigate to specific route
      navigate(to);
    } else {
      // Go back to previous page
      navigate(-1);
    }
  };

  // Variant styles
  const variantStyles = {
    default: "bg-gray-200 hover:bg-gray-300 text-gray-700",
    outline: "border-2 border-gray-300 hover:border-gray-400 text-gray-700 bg-transparent",
    text: "text-blue-600 hover:text-blue-700 hover:underline bg-transparent"
  };

  return (
    <button
      onClick={handleBack}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-md 
        transition-all duration-200 font-medium
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {showIcon && <ArrowLeft size={18} />}
      <span>{label}</span>
    </button>
  );
};

export default BackButton;