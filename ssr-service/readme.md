# @tlock/svelte-archipelago-ssr-service

Tiny NodeJS service for server-rendering [Svelte Archipelago](https://github.com/t-lock/svelte-archipelago) component trees as a "sidecar" to your backend of any language.

## Installation

>🐳 **Docker**: The recommended installation method is to use our pre-configured Docker image in your Docker Compose project. Check out the main [Svelte Archipelago](https://github.com/t-lock/svelte-archipelago) repo for a quick start guide.

The following instructions will get you running if you aren't running Docker and want to host your own Node instance:

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
