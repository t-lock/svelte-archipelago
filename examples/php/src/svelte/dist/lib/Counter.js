import { p as proxy, a as append_styles, b as prop, s as state, c as set } from "../disclose-version.js";
import { e as event, h as head, f as first_child, c as child, r as reset, s as sibling, t as template_effect, a as append, p as pop, g as get, b as template, d as delegate, $ as $window, n as next, i as push, j as set_text } from "../assets/_virtual_archipelago-entry-LYX1rVle.js";
const count = proxy({ value: 0 });
function incrementLocal(_, count2) {
  set(count2, get(count2) + 1);
}
var root_1 = template(`<meta name="github:site" content="@t-lock"> <meta name="github:creator" content="@t-lock">`, 1);
var root = template(`<button class="fancy svelte-hkfi0m"> </button> <button> </button>`, 1);
const $$css = {
  hash: "svelte-hkfi0m",
  code: ".fancy.svelte-hkfi0m {color:pink;background-color:rebeccapurple;}"
};
function Counter($$anchor, $$props) {
  push($$props, true);
  append_styles($$anchor, $$css);
  let initialCount = prop($$props, "initialCount", 3, 42);
  let count$1 = state(proxy(initialCount()));
  function incrementGlobal() {
    count.value += 1;
  }
  var fragment_1 = root();
  event("resize", $window, (e) => {
    console.log(e);
  });
  head(($$anchor2) => {
    var fragment = root_1();
    next(2);
    append($$anchor2, fragment);
  });
  var button = first_child(fragment_1);
  button.__click = [incrementLocal, count$1];
  var text = child(button);
  reset(button);
  var button_1 = sibling(button, 2);
  button_1.__click = incrementGlobal;
  var text_1 = child(button_1);
  reset(button_1);
  template_effect(() => {
    set_text(text, `local count is ${get(count$1) ?? ""}`);
    set_text(text_1, `global count is ${count.value ?? ""}`);
  });
  append($$anchor, fragment_1);
  pop();
}
delegate(["click"]);
export {
  Counter as default
};
