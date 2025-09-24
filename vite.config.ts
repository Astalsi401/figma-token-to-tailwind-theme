import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/figma-token-to-tailwind-theme",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@ui": path.resolve(__dirname, "./src/components/ui"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
