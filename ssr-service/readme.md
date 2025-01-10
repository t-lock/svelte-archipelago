# @tlock/svelte-archipelago-ssr-service

Tiny NodeJS service for server-rendering [Svelte Archipelago](https://github.com/t-lock/svelte-archipelago) component trees as a "sidecar" to your backend of any language.

## Installation

```bash
npm install @tlock/svelte-archipelago-ssr-service
```

## Usage

Start the standalone service:
```bash
npx svelte-archipelago-service
```

Or alternatively, integrate into your existing Node project:
```js
import { createSvelteSSRService } from "@tlock/svelte-archipelago-ssr-service";

const server = createSvelteSSRService();
server.start();
```

## License

[MIT](https://github.com/t-lock/svelte-archipelago/blob/master/ssr-service/LICENSE)
