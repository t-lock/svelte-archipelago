import { createServer } from "http";
import { randomUUID } from "node:crypto";
import { svelteSSR } from "./renderer.js";

const DEFAULT_CONFIG = {
  port: 3000,
  host: "0.0.0.0",
  fsRoot: process.env.BACKEND_FS_ROOT,
  srcPath: process.env.SVELTE_SRC_PATH || "/svelte",
  devServerUrl: process.env.SVELTE_DEV_SERVER_URL || "http://localhost:5173",
  mode: process.env.SVELTE_MODE || "production",
};

export function createSvelteSSRService(userConfig = {}) {
  const config = { ...DEFAULT_CONFIG, ...userConfig };

  const server = createServer((req, res) => {
    res.setHeader("Content-Type", "text/html");

    if (req.method !== "POST") {
      res.statusCode = 405;
      res.end(
        JSON.stringify({
          error: `Method: ${req.method} not allowed`,
        })
      );
      return;
    }

    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const instanceID = randomUUID();

      try {
        const { path, props, mode: passedMode } = JSON.parse(body);

        // Handle invalid or missing component path
        if (!path || typeof path !== "string") {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Invalid path" }));
          return;
        }

        // Handle malformed props
        let propsJson = null;
        if (props) {
          try {
            propsJson = JSON.stringify(props);
          } catch (_e) {
            res.end(JSON.stringify({ error: "Invalid props" }));
          }
        }

        // Allow overriding the global mode
        // (also provides a way to configure mode without env var)
        if (passedMode) config.mode = passedMode;

        const ssrComponentPath =
          config.fsRoot + config.srcPath + "/dist-ssr" + path + ".js";

        const csrComponentPath =
          config.mode == "development"
            ? config.devServerUrl + path + ".svelte"
            : config.srcPath + "/dist" + path + ".js";

        // Move the import into a separate promise chain
        import(ssrComponentPath)
          .then((mod) => {
            const Component = mod.default;
            const rendered = svelteSSR(Component, props);

            const template = `
              <!-- ${path} -->
              <div id="${instanceID}" style="display:contents">

                ${
                  propsJson
                    ? `<script type="application/json">${propsJson}</script>`
                    : ""
                }

                ${rendered.head}
                ${rendered.body}

                <script type="module">
                  ${
                    config.mode === "development"
                      ? `await import("${config.devServerUrl}/@hydrate");`
                      : ""
                  }

                  const { default: Component } = await import("${csrComponentPath}");
                    const target = document.getElementById("${instanceID}");
                    let props = {};

                    const propScript = target.querySelector('script[type="application/json"]');
                    if (propScript) {
                      props = JSON.parse(propScript.textContent ?? "{}");
                    }

                    hydrate(Component, {
                      target,
                      props: props,
                    });
                </script>
              </div>
            `;

            res.statusCode = 200;
            res.end(template);
          })
          .catch((error) => {
            console.error("Import error:", error);
            res.statusCode = 404;
            res.end(
              JSON.stringify({
                error: "Component not found",
                details: error.message,
              })
            );
          });
      } catch (error) {
        console.error("Parse error:", error);
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            error: "Invalid JSON payload",
            details: error.message,
          })
        );
      }
    });

    req.on("error", (error) => {
      console.error("Request error:", error);
      res.statusCode = 500;
      res.end(
        JSON.stringify({
          error: "Internal server error",
          details: error.message,
        })
      );
    });
  });

  // Add global error handlers
  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
  });

  process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection:", error);
  });

  return {
    server,
    start() {
      server.listen(config.port, config.host, () => {
        console.log(
          `Svelte Archipelago ssr service running on port ${config.port}`
        );
      });
    },
  };
}
