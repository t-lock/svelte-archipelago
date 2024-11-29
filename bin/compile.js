import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "svelte/compiler";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEST = join(__dirname, "../src-compiled");

function doCompile([name, relativePath]) {
  const source = readFileSync(join(__dirname, relativePath), "utf8");
  const compiled = compile(source, {
    css: "injected",
  });

  console.log(compiled);

  // Create or empty folder
  if (existsSync(DEST)) {
    rmSync(DEST, { recursive: true });
  }
  mkdirSync(DEST);

  // Write file
  writeFileSync(join(DEST, name + ".js"), compiled.js.code);
  writeFileSync(join(DEST, name + ".js.map"), compiled.js.map.mappings);
}

Object.entries({
  Counter: "../src/lib/Counter.svelte",
}).forEach((entry) => doCompile(entry));
