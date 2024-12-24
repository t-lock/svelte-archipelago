import { createServer } from "http";
import { randomUUID } from "node:crypto";
import { svelteSSR } from "./renderer.js";

const srcPath = process.env.SVELTE_SRC_PATH;

const server = createServer((req, res) => {
  res.setHeader("Content-Type", "text/html");

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(
      JSON.stringify({
        error: "Method not allowed",
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

    //! TODO must be made configurable
    const clientAssetPath = "/dist";

    try {
      const { path, props } = JSON.parse(body);

      if (!path || typeof path !== "string") {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Invalid path" }));
        return;
      }

      // Move the import into a separate promise chain
      import(srcPath + path + ".js")
        .then((mod) => {
          const Component = mod.default;
          const rendered = svelteSSR(Component, props);

          const template = `
            <!-- ${path} -->
            <div id="${instanceID}" style="display:contents">

              ${/* TBD PROP SCRIPT TAG */ ""}

              ${rendered.head}
              ${rendered.body}

              <script type="module">
                import("${clientAssetPath + path}.js").then((module) => {
                  const Component = module.default;
                  const target = document.getElementById("${instanceID}");

                  let props = {};

                  const propScript = target.querySelector('script[type="application/json"]');
                  if (propScript) {
                    props = JSON.parse(propScript.textContent ?? "{}");
                    // ? server only prop option (idea)
                    // props.mode = "csr";
                  }
                  hydrate(Component, {
                    target,
                    props: props,
                  });
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

server.listen(3000, "0.0.0.0", () => {
  console.log("Svelte Archipelago renderer service running on port 3000");
});
