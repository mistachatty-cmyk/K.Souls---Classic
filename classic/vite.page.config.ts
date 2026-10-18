import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    outDir: "dist-page",
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "../page-mode/main.ts"),
      name: "KineticSoulsOfficialPage",
      formats: ["iife"],
      fileName: () => "kinetic-official-page.js",
    },
  },
});
