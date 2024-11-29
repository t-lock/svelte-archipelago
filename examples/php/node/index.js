import { createServer } from "http";

const server = createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

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
    try {
      const data = { "node says": JSON.parse(body) };
      res.statusCode = 200;
      res.end(JSON.stringify(data));
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
  console.log("Svelte Sidecar running on port 3000");
});
