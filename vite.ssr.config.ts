import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        css: "injected",
        dev: false,
      },
    }),
  ],
  ssr: {
    noExternal: true,
  },
  build: {
    ssr: true,
    minify: false,
    rollupOptions: {
      input: "./src/main.ts",
      output: {
        dir: "dist-ssr",
        format: "esm",
        chunkFileNames: ({ facadeModuleId }) => {
          if (facadeModuleId) {
            const name = facadeModuleId
              .replace(resolve(__dirname, "src") + "/", "")
              .replace(".svelte", "");
            return `${name}.js`;
          } else {
            return `[name].js`;
          }
        },
      },
    },
  },
});
