# @tlock/vite-plugin-svelte-archipelago

Vite plugin for bundling [Svelte Archipelago](https://github.com/t-lock/svelte-archipelago) applications.

## Installation

```bash
npm install --save-dev @tlock/vite-plugin-svelte-archipelago vite @sveltejs/vite-plugin-svelte svelte
```

## Usage

```js
// vite.config.js
import { defineConfig } from "vite";
import svelteArchipelago from "@tlock/vite-plugin-svelte-archipelago";

export default defineConfig({
  plugins: [svelteArchipelago()],
});
```

## License

[MIT](https://github.com/t-lock/svelte-archipelago/blob/master/vite-plugin/LICENSE)
