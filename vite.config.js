import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative asset paths so the build works at any URL,
  // including GitHub Pages' /Project-venus/ subpath.
  base: "./",
  plugins: [react()],
});
