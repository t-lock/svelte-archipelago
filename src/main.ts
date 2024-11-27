import { hydrate } from "svelte";
import "./app.css";
import Counter from "./lib/Counter.svelte";

const app = hydrate(Counter, {
  target: document.getElementById("app")!,
});

const modules = import.meta.glob("./lib/**/*.svelte");
Object.keys(modules).forEach((path) => modules[path]());

export default app;
