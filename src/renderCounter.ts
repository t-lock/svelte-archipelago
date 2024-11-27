import { render } from "svelte/server";
import Counter from "./lib/Counter.svelte";

const result = render(Counter, {
  props: {},
});
result.body; // HTML for somewhere in this <body> tag
result.head; // HTML for somewhere in this <head> tag
