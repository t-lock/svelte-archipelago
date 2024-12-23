import { render } from "svelte/server";

export function svelteSSR(Component, props = {}) {
  return render(Component, { props });
}
