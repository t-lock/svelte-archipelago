import { render } from "svelte/server";

function stripHydrationComments(html) {
  return html.replace(/<!--\[--\>|<!--\]--\>/g, "");
}

export function svelteSSR(Component, props = {}) {
  const { head, body } = render(Component, { props });
  // ! TODO: open an issue with Svelte team on why hydration doesn't work with
  // ! the hydration-specific helper comments that Svelte adds....
  // Strip <!--[--> and <!--]--> comments that Svelte SSR adds
  return {
    head: stripHydrationComments(head),
    body: stripHydrationComments(body),
  };
}
