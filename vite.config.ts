import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: ["sheilah-diffractive-modesta.ngrok-free.dev", "untranspiring-menthaceous-robin.ngrok-free.dev"],
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/leaflet/")) {
            return "vendor-maps";
          }
          if (id.includes("node_modules/lucide-react/")) {
            return "vendor-icons";
          }
          if (id.includes("node_modules/@tanstack/")) {
            return "vendor-query";
          }
        },
      },
    },
  },
}));
