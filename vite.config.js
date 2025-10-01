import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://backend.jeevandharadigital.in/api/",
        changeOrigin: true,
        secure: true, // Set true since your backend uses HTTPS
      },
    },
    cors: true, // Enable CORS on the Vite dev server
  },
});
