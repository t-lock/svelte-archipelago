import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        css: "injected",
      },
    }),
  ],
  build: {
    ssr: true,
    emptyOutDir: true,
    outDir: "dist-ssr",
    rollupOptions: {
      input: "src/lib/Counter.svelte",
    },
  },
});
