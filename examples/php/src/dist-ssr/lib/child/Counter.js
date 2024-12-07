import { h as head, e as escape_html } from "../../main.js";
const $$css = {
  hash: "svelte-joc1dw",
  code: ".fancy.svelte-joc1dw {color:red;background-color:blue;}"
};
function Counter($$payload, $$props) {
  $$payload.css.add($$css);
  let { initialCount = 42 } = $$props;
  let count = initialCount;
  const increment = () => {
    count += 1;
  };
  head($$payload, ($$payload2) => {
    $$payload2.out += `<meta name="github:site" content="@t-lock"> <meta name="github:creator" content="@t-lock">`;
  });
  $$payload.out += `<button class="fancy svelte-joc1dw">count is ${escape_html(count)}</button>`;
}
export {
  Counter as default
};
