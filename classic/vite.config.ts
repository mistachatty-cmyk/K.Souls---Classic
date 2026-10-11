import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Standalone config: no Replit env vars required. Relative base so the build
// works on Vercel, gsix.online embeds, and any static host.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: { outDir: "dist", emptyOutDir: true },
});
