import { hydrate } from "svelte";
import "./app.css";

/**
 * Expose hydrate on global scope
 *
 * TODO - research
 * This runs in the browser because our modules produced below call back to this,
 * we don't actually include it directly (but I think we do need to in dev mode)
 *
 * ? is there a better way here, where we explicitly add only the hydrater (in prod and dev),
 * ? and have our entry point here only produce the bundles, and never be loaded
 * ? in the browser?
 */

if (typeof window !== "undefined") {
  //@ts-expect-error
  window.hydrate = hydrate;
}

// Produce module bundle
if (typeof window === "undefined") {
  const modules = import.meta.glob("./lib/**/*.svelte");
  Object.keys(modules).forEach((name) => import(name));
}
