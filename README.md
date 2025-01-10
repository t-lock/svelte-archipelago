# Svelte Archipelago

>A complete toolkit for **backend-agnostic**, server-rendered islands of interactivity with Svelte.
>
>Effortlessly add Svelte to **any backend, regardless of language or framework**, whether you want a few islands or your entire frontend, without giving up SSR or the famed Svelte DX!

## Demo Video

Recorded after an all nighter hacking away at the buzzer for Svelte Hackathon 2024.
Apologies. Please watch in 1.25x speed. 🤦 Will re-do these properly soon!

<details>
<summary>📹 Intro Video</summary>

[![Intro](https://img.youtube.com/vi/Ntd3nTOHdUA/0.jpg)](https://youtu.be/Ntd3nTOHdUA)
</details>

<details>
<summary>📹 Getting Started + Example Puzzle Game</summary>

[![Getting Started + Example Puzzle Game](https://img.youtube.com/vi/WVjE_wx9LPU/0.jpg)](https://youtu.be/WVjE_wx9LPU)
</details>

<details>
<summary>📹 Clientside Routing + Global State</summary>

[![Clientside Routing + Global State](https://img.youtube.com/vi/-Z-vB1ElKnY/0.jpg)](https://youtu.be/-Z-vB1ElKnY)
</details>

<details>
<summary>📹 Additional Notes</summary>

[![Additional Notes](https://img.youtube.com/vi/xgErYNs4JZk/0.jpg)](https://youtu.be/xgErYNs4JZk)
</details>

## Why Svelte Archipelago?

Svelte is extremely well-suited to building "islands of interactivity". Because Svelte's reactive primitives are universal, any component you mount/hydrate can consume or update global state freely, without any knowledge of one another or glue code. Just import the modules you need, where you need them, and they'll work together in harmony. They're more like a system of islands. Or... an island chain... An Archipelago!

And yet, it seems almost no one is talking about this on Dev Twitter or Youtube, and this major selling point is not, to my knowledge, explained on [svelte.dev](https://svelte.dev) at all.

The trouble is that managing this type of architecture is cumbersome, and there isn't (yet) a proper toolkit to streamline it. You can build out a handful of little Svelte apps in isolation and mount them individually -- and while this works great -- you lose the context of the wider application during development, and give up on SSR (unless you want to build out a duplicate of every island's initial state in your backend view as well).

To put it simply, SvelteJS is simply **_too good_** to only be a front-end for SvelteKit or SPA applications, so lets build the toolkit that will allow us to bring the magic of Svelte to **every** application framework!

## How does it work?

Svelte Archipelago is a handful of tools which work together to code-split your component trees into server and client components, and serve them alongside your backend over local http, the same way you are probably already accessing your database or redis cache. Each component rendered to html on the server includes its own dynamic import to its corresponding client component, and passes its props during hydration. No REST or Graphql APIs required. Your components' props are your API!

The toolkit is comprised of:

- **A Bundler**
  - on [NPM](https://www.npmjs.com/package/@tlock/vite-plugin-svelte-archipelago)
  - The Svelte Archipelago bundler is a Vite plugin which creates entry points to your application from each individual component tree.
  - It produces two bundles for each component tree: one for the server and one for the browser
- **SSR-as-a-service**
  - on [NPM](https://www.npmjs.com/package/@tlock/svelte-archipelago-ssr-service)
  - Tiny NodeJS service for server-rendering Svelte component trees as a "sidecar" to your favorite backend.
  - Your backend calls the Svelte Archipelago service over local http, just like you are probably already accessing your database or redis cache.
  - Server components' html output includes an inline module script that dynamically imports and hydrates the corresponding client component on page load
- **Docker Image**
  - on [Docker Hub](https://hub.docker.com/repository/docker/tlockaob/svelte-archipelago-ssr-service/general)
  - Get set up in seconds with a few lines of config in your Docker Compose file
  - Alternatively, you can set up your own Node service if you aren't using Docker
- **"NPM Create" Package**
  - on [NPM](https://www.npmjs.com/package/create-svelte-archipelago)
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

## Credits

All code is my own.

The idea for this project was born out of a previous POC I worked on, where the goal was to server render Svelte 4 components within a Golang application by embedding a v8 js engine directly into the Go web server.

That exercise made some headway in the ideas that are featured in Svelte Archipelago, but shares no actual code with this project.

## Discussion

Please reach out via the Discussions tab if you'd like to discuss this project. I'm looking forward to chatting with you!

## License

[MIT](https://github.com/t-lock/svelte-archipelago/blob/master/LICENSE)
