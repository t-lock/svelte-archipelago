import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
// @ts-expect-error
import { svelteArchipelago } from "vite-plugin-svelte-archipelago";

export default defineConfig(({ command }) => ({
  plugins: [
    // Only include svelte plugin during dev/serve
    command === "serve" ? svelte() : null,
    svelteArchipelago(),
  ].filter(Boolean), // Remove null entries
}));
