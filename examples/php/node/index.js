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
    const path = "/lib/Counter.js";

    //! must be configurable
    const clientAssetPath = "/dist";

    try {
      import(srcPath + path).then((mod) => {
        const Component = mod.default;
        const props = body.length ? JSON.parse(body) : undefined;
        const rendered = svelteSSR(Component, props);

        const template = `
          <!-- ${path} -->
          <div id="${instanceID}" style="display:contents">

            ${/* TBD PROP SCRIPT TAG */ ""}

            ${rendered.head}
            ${rendered.body}

            <script type="module">
              import("${clientAssetPath + path}").then((module) => {
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
      });
    } catch (error) {
      res.statusCode = 400;
      res.end(
        JSON.stringify({
          error: "Invalid JSON payload",
        })
      );
    }
  });

  req.on("error", (error) => {
    res.statusCode = 500;
    res.end(
      JSON.stringify({
        error: "Internal server error",
      })
    );
  });
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Svelte Archipelago renderer service running on port 3000");
});
