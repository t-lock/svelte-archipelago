#!/usr/bin/env node

import degit from "degit";

async function init() {
  try {
    console.log("Creating new Svelte Archipelago project...");

    const project = degit(
      "t-lock/svelte-archipelago/create-svelte-archipelago/project-files",
      {
        force: true,
        verbose: true,
      }
    );

    await project.clone("./svelte");

    console.log(`
🏝️ Done! Your Svelte Archipelago project was created in ./svelte

Next steps:
1. cd svelte
2. npm install
`);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

init();
