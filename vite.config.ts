import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
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
  // uses index.html as the entry point. This is a problem for us
  // build: {
  //   rollupOptions: {
  //     input: "./src/main.ts",
  //   },
  // },
  build: {
    minify: false,
    rollupOptions: {
      // treeshake: false,
      input: "./src/main.ts",
      output: {
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
