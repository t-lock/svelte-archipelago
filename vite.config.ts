import { defineConfig } from "vite";
import svelteArchipelago from "vite-plugin-svelte-archipelago";

export default defineConfig({
  plugins: [
    svelteArchipelago({
      srcPath: "./src",
    }),
  ],
});
