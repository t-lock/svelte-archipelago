<script lang="ts">
  import { onMount } from "svelte";
  import { flip } from "svelte/animate";

  type GameState = Array<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8>;
  type Props = {
    initialState?: GameState;
  };

  let { initialState = [1, 2, 3, 4, 5, 6, 7, 8, 0] }: Props = $props();

  let initialized = $state(false);
  let gameState: GameState = $state(initialState);
  let completed = $derived(initialized && isComplete(gameState));
  let emptyPosition = $derived(gameState.indexOf(0));

  function isComplete(gameState: GameState) {
    return (
      JSON.stringify(gameState) === JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 0])
    );
  }

  function canMove(index: number): boolean {
    const adjacentPositions = [
      index - 3, // above
      index + 3, // below
      index % 3 !== 0 ? index - 1 : -1, // left
      index % 3 !== 2 ? index + 1 : -1, // right
    ];
    return adjacentPositions.includes(emptyPosition);
  }

  function moveTile(index: number) {
    if (!canMove(index)) return;

    const newPositions: GameState = [...gameState];
    [newPositions[index], newPositions[emptyPosition]] = [
      newPositions[emptyPosition],
      newPositions[index],
    ];
    gameState = newPositions;

    syncState();
  }

  function jumbleBoard(moves: number) {
    const originalMoves = moves;
    while (moves > 0) {
      const validMoves = gameState.filter((i) => canMove(i));
      const randomMove =
        validMoves[Math.floor(Math.random() * validMoves.length)];
      moveTile(randomMove);
      moves--;
    }

    if (completed) jumbleBoard(originalMoves);
  }

  onMount(() => {
    initialized = true;
    if (completed) jumbleBoard(7);
  });

  const fadeAndScale = (_node: Element, { duration }: { duration: number }) => {
    return {
      duration,
      css: (t: number) => `
        opacity: ${t};
        transform: scale(${1 + 0.1 * (1 - t)});
      `,
    };
  };

  /**
   * Welcome!
   *
   * This code will post the current state back to your backend.
   * Uncomment and modify as needed.
   */
  function syncState() {
    fetch("/", {
      method: "POST",
      body: JSON.stringify(gameState),
    });
  }
</script>

<div class="wrapper">
  <div class="puzzle-box">
    <div class={["puzzle", { completed }]}>
      {#if completed}
        <img
          src="/svelte/assets/logo.png"
          alt="Completed Puzzle"
          in:fadeAndScale={{ duration: 200 }}
        />
      {:else}
        {#each gameState as tileNum, position (tileNum)}
          {@const invalid = !canMove(position)}
          <figure animate:flip={{ duration: 200 }}>
            {#if position !== emptyPosition}
              <button
                class={["tile", { invalid }]}
                onclick={() => moveTile(position)}
              >
                <img
                  src="/svelte/assets/tile_{tileNum}.png"
                  alt="Tile {tileNum}"
                />
              </button>
            {/if}
          </figure>
        {/each}
      {/if}
    </div>

    <div class="inset-shadow"></div>
  </div>
  <div class="hello">
    {#if !completed}
      <h1>Welcome to Svelte Archipelago</h1>
      <p>Try implementing persistent state on your backend!</p>
      <p>
        Check <code>Puzzle.svelte</code> for a start on the network code to make
        it happen. Look for the function: <code>syncState</code>
      </p>
    {:else}
      <a href="/" class="again">Go again!</a>
    {/if}
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .puzzle-box {
    position: relative;
    max-width: 80vw;
    max-height: 80vh;
    aspect-ratio: 1;
  }

  .puzzle {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 4px;
    padding: 4px;
    background-color: #cdcdcd;
    border: 20px solid transparent;
    border-radius: 20px;
  }

  .puzzle.completed {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    background-color: #ebebeb;
    box-shadow:
      0 0 10px rgba(51, 234, 63, 0.8),
      0 0 20px rgba(255, 255, 255, 0.65),
      0 0 30px rgba(51, 234, 63, 0.6),
      0 0 40px rgba(51, 234, 63, 0.4);
  }

  .inset-shadow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: -4px;
    pointer-events: none; /* allows clicks to pass through to tiles */
    box-shadow: 0px 0px 20px -1px rgba(0, 0, 0, 0.5) inset;
    border-radius: 20px;
    border: 20px solid #7b7d87;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .tile {
    margin: 0;
    padding: 0;
    background-color: #ebebeb;
    border: 0;
    box-shadow: 2px 2px 2px -1px rgba(0, 0, 0, 0.2);
    cursor: move;
    height: 100%;
    width: 100%;
  }

  .tile:hover {
    box-shadow:
      0 0 5px rgba(255, 69, 0, 0.8),
      0 0 10px rgba(255, 255, 255, 0.65),
      0 0 15px rgba(255, 69, 0, 0.6);
  }

  .invalid {
    cursor: not-allowed;
  }

  figure {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  :global(html) {
    font-family: sans-serif;
  }

  .hello {
    text-align: center;
  }

  code {
    background-color: darkslateblue;
    color: white;
    padding: 4px;
    border-radius: 4px;
  }

  a {
    color: #f96743;
  }

  .again {
    margin-top: 40px;
    font-size: 24px;
    display: inline-block;
  }
</style>
