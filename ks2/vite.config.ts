import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite Configuration for Kinetic Souls
 * 
 * WHAT IT DOES: 
 * Configures the build pipeline for the React application, ensuring it compiles
 * correctly for both local web development and the Electron desktop wrapper.
 * 
 * HOW IT WORKS:
 * - `plugins`: Injects `@vitejs/plugin-react` to handle JSX transpilation and Fast Refresh (HMR).
 * - `base`: Forces all compiled asset URLs in `index.html` to be relative (`./`) instead of absolute (`/`).
 * 
 * WHY IT EXISTS (The Logic):
 * Electron uses the `file://` protocol to load the game locally. If Vite uses its default
 * absolute pathing (`/assets/...`), Electron will search the root of your hard drive (C:/) 
 * and fail to load the game, resulting in the "Blank Screen of Death" crash.
 */
export default defineConfig({
  plugins: [react()],
  base: './',
});
