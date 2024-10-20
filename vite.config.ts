import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path-browserify"; // Use browser-compatible path
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  build: {
    outDir: "build",
  },
  server: {
    open: true,
  },
  plugins: [
    react(),
    nodePolyfills({
      exclude: ["fs"], // Exclude Node modules not needed in browser
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true, // Polyfill `node:` protocol imports
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend"),
      process: "process/browser",
      path: "path-browserify", // Use browser-compatible `path`
      os: "os-browserify", // Use browser-compatible `os`
      stream: "stream-browserify", // Use browser-compatible `stream`
    },
  },
});
