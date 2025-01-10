# Svelte Archipelago

>A complete toolkit for **backend-agnostic**, server-rendered islands of interactivity with Svelte.
>
>Effortlessly add Svelte to **any backend, regardless of language or framework**, whether you want a few islands or your entire frontend, without giving up SSR or the famed Svelte DX!

## Why Svelte Archipelago?

Svelte is extremely well-suited to building "islands of interactivity". Because Svelte's reactive primitives are universal, any component you mount/hydrate can consume or update global state freely, without any knowledge of one another or glue code. Just import the modules you need, where you need them, and they'll work together in harmony. They're more like a system of islands. Or... an island chain... An Archipelago!

And yet, it seems almost no one is talking about this on Dev Twitter or Youtube, and this major selling point is not, to my knowledge, explained on [svelte.dev](https://svelte.dev) at all.

The trouble is that managing this type of architecture is cumbersome, and there isn't (yet) a proper toolkit to streamline it. You can build out a handful of little Svelte apps in isolation and mount them individually -- and while this works great -- you lose the context of the wider application during development, and give up on SSR (unless you want to build out a duplicate of every island's initial state in your backend view as well).

Put it simply, SvelteJS is simply **__too good__** to only be a front-end for SvelteKit or SPA applications, so lets build the toolkit that will allow us to bring the magic of Svelte to **every** application framework!

## How does it work?

Svelte Archipelago is a handful of tools which work together to code-split your component trees into server and client components, and serve them alongside your backend over local http, the same way you are probably already accessing your database or redis cache. Each component rendered to html on the server includes its own dynamic import to its corresponding client component, and passes its props during hydration. No REST or Graphql APIs required. Your components' props are your API!

The toolkit is comprised of:

- **A Bundler**
  - The Svelte Archipelago bundler is a Vite plugin which creates entry points to your application from each individual component tree.
  - It produces two bundles for each component tree: one for the server and one for the browser
- **SSR-as-a-service**
  - Tiny NodeJS service for server-rendering Svelte component trees as a "sidecar" to your favorite backend.
  - Your backend calls the Svelte Archipelago service over local http, just like you are probably already accessing your database or redis cache.
  - Server components' html output includes an inline module script that dynamically imports and hydrates the corresponding client component on page load
- **Docker Image**
  - Get set up in seconds with a few lines of config in your Docker Compose file
  - Alternatively, you can set up your own Node service if you aren't using Docker
- **"NPM Create" Package**
  - Once your backend is running, scaffolding your frontend is a single cli command
  - Then go about writing your Svelte Components with HMR as if you were working on any other Svelte or SvelteKit project.


## Quick Start:

The recommended installation method is to use our pre-configured Docker image in your Docker Compose project.

If you aren't using Docker, you can find installation instructions for Node in the [ssr-service readme](https://github.com/t-lock/svelte-archipelago/blob/master/ssr-service/readme.md)

Just add a `sveltessr` service to `docker-compose.yaml` and give it read-only access to your existing backend volume.

For example, for a typical PHP / LEMP application, you'd add the Svelte Archipelago service and give it access to `/var/www/html`:
```
services:
  sveltessr:
    image: tlockaob/svelte-archipelago-ssr-service
    volumes:
      - ./src:/var/www/html:ro # read-only access to PHP source files
    networks:
      - lemp-network
    environment:
      - BACKEND_FS_ROOT=/var/www/html #REQUIRED
      # default - SVELTE_SRC_PATH=/svelte
      # default - SVELTE_DEV_SERVER_URL=http://localhost:5173
      - SVELTE_MODE=${SVELTE_MODE:-production} # defaults to 'production' if not set
```

Then for convenience, add an environment variable to your backend service to reference the Svelte Archipelago url:

```
services:
  your-backend-service:
    environment:
      - SVELTE_SSR_URL=http://sveltessr:3000
```

Once your backend is configured, scaffold your Svelte component library with `npm create svelte-archipelago`

### Production mode

Build your Svelte components and start your containers:

```bash
  # from root (/examples/php)
  docker-compose up

  # from svelte folder (/examples/php/svelte)
  npm install
  npm run build
```

### Development Mode with HMR (Hot Module Reloading)

set SVELTE_MODE to `development`, start your containers and start the Vite dev server:

```bash
  # from root (/examples/php)
  SVELTE_MODE=development docker-compose up

  # from svelte folder (/examples/php/svelte)
  npm run install
  npm run dev
```
