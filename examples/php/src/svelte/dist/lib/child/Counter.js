import { a as append_styles, b as prop, s as state, p as proxy, c as set } from "../../disclose-version.js";
import { e as event, h as head, c as child, r as reset, t as template_effect, a as append, g as get, b as template, d as delegate, $ as $window, n as next, j as set_text } from "../../assets/_virtual_archipelago-entry-LYX1rVle.js";
const increment = (_, count) => {
  set(count, get(count) + 1);
};
var root_1 = template(`<meta name="github:site" content="@t-lock"> <meta name="github:creator" content="@t-lock">`, 1);
var root = template(`<button class="fancy svelte-joc1dw"> </button>`);
const $$css = {
  hash: "svelte-joc1dw",
  code: ".fancy.svelte-joc1dw {color:red;background-color:blue;}"
};
function Counter($$anchor, $$props) {
  append_styles($$anchor, $$css);
  let initialCount = prop($$props, "initialCount", 3, 42);
  let count = state(proxy(initialCount()));
  var button = root();
  event("resize", $window, (e) => {
    console.log(e);
  });
  head(($$anchor2) => {
    var fragment = root_1();
    next(2);
    append($$anchor2, fragment);
  });
  button.__click = [increment, count];
  var text = child(button);
  reset(button);
  template_effect(() => set_text(text, `count is ${get(count) ?? ""}`));
  append($$anchor, button);
}
delegate(["click"]);
export {
  Counter as default
};
