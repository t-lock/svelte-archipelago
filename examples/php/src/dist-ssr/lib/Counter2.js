import { h as head, e as escape_html } from "../main.js";
const $$css = {
  hash: "svelte-1f35gn7",
  code: ".fancy.svelte-1f35gn7 {color:orchid;background-color:royalblue;}"
};
function Counter2($$payload, $$props) {
  $$payload.css.add($$css);
  let { initialCount = 42 } = $$props;
  let count = initialCount;
  const increment = () => {
    count += 1;
  };
  head($$payload, ($$payload2) => {
    $$payload2.out += `<meta name="github:site" content="@t-lock"> <meta name="github:creator" content="@t-lock">`;
  });
  $$payload.out += `<button class="fancy svelte-1f35gn7">count is ${escape_html(count)}</button>`;
}
export {
  Counter2 as default
};
