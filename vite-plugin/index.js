import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

export function svelteArchipelago() {
  let buildComplete = false;

  return {
    name: "vite-plugin-svelte-archipelago",
    enforce: "pre",
    apply: "build",

    async buildStart() {
      if (process.env.BUNDLE_TYPE || buildComplete) return;

      process.env.BUNDLE_TYPE = "client";
      const { build } = await import("vite");

      try {
        // Build client bundle
        await build({
          plugins: [
            svelte({
              compilerOptions: {
                css: "injected",
              },
            }),
          ],
          build: {
            minify: false,
            rollupOptions: {
              input: "./src/main.ts",
              output: {
                format: "esm",
                chunkFileNames: ({ facadeModuleId }) => {
                  if (facadeModuleId) {
                    const name = facadeModuleId
                      .replace(resolve(process.cwd(), "src") + "/", "")
                      .replace(".svelte", "");
                    // ! use hash in final version
                    // (requires ssr map, but gives browser cache invalidation)
                    // * return `${name}-[hash].js`;
                    return `${name}.js`;
                  } else {
                    // * return `[name]-[hash].js`;
                    return `[name].js`;
                  }
                },
              },
            },
          },
        });

        // Build SSR bundle
        process.env.BUNDLE_TYPE = "ssr";
        await build({
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
                      .replace(resolve(process.cwd(), "src") + "/", "")
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

        buildComplete = true;
        console.log("✨ Dual Svelte bundles created successfully");
      } catch (error) {
        console.error("Error creating bundles:", error);
        throw error;
      } finally {
        delete process.env.BUNDLE_TYPE;
      }
    },

    buildEnd() {
      // If our builds completed successfully, exit the process
      if (buildComplete) {
        process.exit(0);
      }
    },
  };
}
