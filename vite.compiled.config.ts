import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [svelte()],
  build: {
    minify: false,
    rollupOptions: {
      treeshake: false,
      input: "./src-compiled/Counter.js",
      output: {
        dir: "dist-compiled",
        format: "esm",
      },
    },
  },
});
