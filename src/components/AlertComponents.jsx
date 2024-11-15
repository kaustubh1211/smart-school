import React, { useState, useEffect } from "react";
import { Terminal, AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";

export function useAlert() {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000); // Dismiss after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [alert]);

  return { alert, setAlert };
}

export function AlertComponent({ alert, onClose }) {
  if (!alert) return null;

  return (
    <Alert
      variant={alert.type === "error" ? "destructive" : undefined}
      className="mt-4 relative"
    >
      {alert.type === "success" ? (
        <Terminal className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <AlertTitle>
        {alert.type === "success"
          ? "Success"
          : alert.type === "error"
          ? "Error"
          : "Warning"}
      </AlertTitle>
      <AlertDescription>{alert.message}</AlertDescription>
      <Button
        variant="ghost"
        className="absolute top-1 right-1 p-1"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
    </Alert>
  );
}
