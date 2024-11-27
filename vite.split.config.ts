import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    minify: false,
    rollupOptions: {
      input: "./src/main-split.ts",
      treeshake: false,
      output: {
        dir: "dist-split",
        format: "esm",
        chunkFileNames: ({ facadeModuleId }) => {
          if (facadeModuleId) {
            const name = facadeModuleId
              .replace(resolve(__dirname, "src") + "/", "")
              .replace(".svelte", "");
            return `${name}-[hash].js`;
          } else {
            return `[name]-[hash].js`;
          }
        },
      },
    },
  },
});
