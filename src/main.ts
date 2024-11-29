import { hydrate } from "svelte";
import "./app.css";

//@ts-expect-error
window.hydrate = hydrate;
console.log("executing main");

const modules = import.meta.glob("./lib/**/*.svelte");
console.log(modules);

["Counter", "Counter2"].forEach(async (name) => {
  try {
    const Component = (await import(`./lib/${name}.svelte`)).default;
    const target = document.querySelector(`#${name}`);
    if (target) hydrate(Component, { target }); //! no props, so this isn't real
  } catch (error) {
    console.error(error);
  }
});
