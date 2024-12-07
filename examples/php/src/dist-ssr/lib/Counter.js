import { p as push, h as head, e as escape_html, a as pop } from "../main.js";
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
  function incrementLocal() {
    count$1 += 1;
  }
  function incrementGlobal() {
    count.value += 1;
  }
  head($$payload, ($$payload2) => {
    $$payload2.out += `<meta name="github:site" content="@t-lock"> <meta name="github:creator" content="@t-lock">`;
  });
  $$payload.out += `<button class="fancy svelte-hkfi0m">local count is ${escape_html(count$1)}</button> <button>global count is ${escape_html(count.value)}</button>`;
  pop();
}
export {
  Counter as default
};
