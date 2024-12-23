import { svelte } from "@sveltejs/vite-plugin-svelte";
import { readdirSync, statSync } from "fs";
import { join, resolve } from "path";

const VIRTUAL_HYDRATE_ID = "\0virtual:hydrate";
const VIRTUAL_ENTRY_ID = "\0virtual:archipelago-entry";

const frameworkPlugin = (
  options = {
    srcPath: "./",
  }
) => {
  return [
    process.env.NODE_ENV === "development"
      ? [...svelte(), svelteArchipelagoDev()]
      : svelteArchipelagoBuild(options),
  ];
};

export default frameworkPlugin;

function svelteArchipelagoDev() {
  return {
    name: "vite-plugin-archipelago-hydrate",

    resolveId(id) {
      if (id === "/@hydrate") return VIRTUAL_HYDRATE_ID;
    },

    load(id) {
      if (id === VIRTUAL_HYDRATE_ID) {
        return `
          import { hydrate } from "svelte";
          window.hydrate = hydrate;
       `;
      }
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/@hydrate") {
          res.setHeader("Content-Type", "application/javascript");
          server
            .transformRequest("/@hydrate")
            .then((result) => {
              if (result) res.end(result.code);
            })
            .catch(next);
        } else {
          next();
        }
      });
    },
  };
}

function svelteArchipelagoBuild(
  options = {
    srcPath: "./",
  }
) {
  let buildComplete = false;
  let inputs;

  return {
    name: "vite-plugin-svelte-archipelago",
    enforce: "pre",
    apply: "build",

    resolveId(id) {
      if (id === VIRTUAL_ENTRY_ID) {
        return id;
      }
    },

    load(id) {
      if (id === VIRTUAL_ENTRY_ID) {
        const globPattern = `/${options?.srcPath ?? ""}/**/*.svelte`;
        return `
          import { hydrate } from "svelte";

          if (typeof window !== "undefined") {
            window.hydrate = hydrate;
          }

          if (typeof window === "undefined") {
            const modules = import.meta.glob("${globPattern}");
            Object.keys(modules).forEach((name) => import(name));
          }
        `;
      }
    },

    configResolved(resolvedConfig) {
      if (!inputs) {
        inputs = getAllSvelteComponents(
          `${resolvedConfig.root}/${options?.srcPath ?? ""}`
        );
      }
    },

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
              input: VIRTUAL_ENTRY_ID,
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
              input: inputs,
              output: {
                dir: "dist-ssr",
                format: "esm",
                entryFileNames: "[name].js",
                chunkFileNames: "[name].js",
              },
            },
          },
        });

        buildComplete = true;
        console.log("✨ Svelte Archipelago bundles created successfully");
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

function getAllSvelteComponents(dir, fileList = []) {
  const srcPath = resolve(dir);
  const files = readdirSync(srcPath);
  files.forEach((file) => {
    const filePath = join(srcPath, file);
    if (
      statSync(filePath).isDirectory() &&
      !filePath.includes("node_modules")
    ) {
      getAllSvelteComponents(filePath, fileList);
    } else if (filePath.endsWith(".svelte")) {
      fileList.push(filePath);
    }
  });

  return fileList.reduce((acc, file) => {
    const name = file
      .replace(srcPath, "")
      .replace(".svelte", "")
      .replace("/", "");
    acc[name] = file;
    return acc;
  }, {});
}
