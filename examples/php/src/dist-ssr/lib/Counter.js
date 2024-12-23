import { o as on_destroy, h as head, e as escape_html } from "../index.js";
var current_component = null;
function push(fn) {
  current_component = { p: current_component, c: null, d: null };
}
function pop() {
  var component = (
    /** @type {Component} */
    current_component
  );
  var ondestroy = component.d;
  if (ondestroy) {
    on_destroy.push(...ondestroy);
  }
  current_component = component.p;
}
const count = { value: 0 };
const $$css = {
  hash: "svelte-hkfi0m",
  code: ".fancy.svelte-hkfi0m {color:pink;background-color:rebeccapurple;}"
};
function Counter($$payload, $$props) {
  $$payload.css.add($$css);
  push();
  let { initialCount = 42 } = $$props;
  let count$1 = initialCount;
  head($$payload, ($$payload2) => {
    $$payload2.out += `<meta name="github:site" content="@t-lock"> <meta name="github:creator" content="@t-lock">`;
  });
  $$payload.out += `<button class="fancy svelte-hkfi0m">local count is ${escape_html(count$1)}</button> <button>global count is ${escape_html(count.value)}</button>`;
  pop();
}
export {
  Counter as default
};
