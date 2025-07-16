import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3500,
  },
  build: {
    target: "esnext",
  },
});
