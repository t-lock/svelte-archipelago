import { hydrate } from "svelte";
import "./app.css";

//@ts-expect-error
window.hydrate = hydrate;
console.log("executing main");

const modules = import.meta.glob("./lib/**/*.svelte");
console.log(modules);

if (typeof window === "undefined") {
  ["Counter", "Counter2", "child/Counter"].forEach(async (name) => {
    try {
      const Component = (await import(`./lib/${name}.svelte`)).default;
      const target = document.querySelector(`#${name}`);
      console.log("hyrdating");
      if (target) hydrate(Component, { target }); //! no props, so this isn't real
    } catch (error) {
      console.error(error);
    }
  });
}
